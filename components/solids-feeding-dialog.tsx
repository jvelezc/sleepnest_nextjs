"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import * as z from "zod"
import { UtensilsCrossed, HelpCircle, X, Plus, Calendar as CalendarIcon, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useChildStore } from "@/lib/store/child"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  foods: z.array(z.string()).min(1, "Please add at least one food"),
  amount_eaten: z.enum(["none", "taste", "some", "most", "all"]),
  reaction: z.enum(["enjoyed", "neutral", "disliked", "allergic"]),
  notes: z.string().optional()
})

interface SolidsFeedingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SolidsFeedingDialog({
  open,
  onOpenChange
}: SolidsFeedingDialogProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { selectedChild } = useChildStore()
  const [saving, setSaving] = useState(false)
  const [newFood, setNewFood] = useState("")
  const [caregiverId, setCaregiverId] = useState<string | null>(null)
  const [step, setStep] = useState<'date-time' | 'details'>('date-time')
  const [feedingDate, setFeedingDate] = useState<Date>(new Date())
  const [feedingTime, setFeedingTime] = useState(format(new Date(), 'HH:mm'))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foods: [],
      amount_eaten: "some",
      reaction: "neutral",
      notes: ""
    }
  })

  useEffect(() => {
    async function getCaregiverId() {
      if (!user) return

      try {
        const { data: caregiver, error: caregiverError } = await supabase
          .from('caregivers')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (caregiverError || !caregiver) {
          throw new Error('Failed to get caregiver ID')
        }

        setCaregiverId(caregiver.id)
      } catch (err) {
        console.error('Error getting caregiver ID:', err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load caregiver data"
        })
      }
    }

    getCaregiverId()
  }, [user, toast])

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
    setStep('date-time')
    setNewFood("")
  }

  const addFood = () => {
    if (!newFood.trim()) return
    const currentFoods = form.getValues("foods")
    form.setValue("foods", [...currentFoods, newFood.trim()])
    setNewFood("")
  }

  const removeFood = (index: number) => {
    const currentFoods = form.getValues("foods")
    form.setValue("foods", currentFoods.filter((_, i) => i !== index))
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true)

      if (!selectedChild) {
        throw new Error('No child selected')
      }

      if (!caregiverId) {
        throw new Error('No caregiver ID found')
      }

      // Create feeding session
      const { data: session, error: sessionError } = await supabase
        .from('feeding_sessions')
        .insert([{
          caregiver_id: caregiverId,
          child_id: selectedChild.id,
          type: 'solids',
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          notes: values.notes || null
        }])
        .select()
        .single()

      if (sessionError) throw sessionError
      if (!session) throw new Error('Failed to create feeding session')

      // Create solids details
      const { error: solidsError } = await supabase
        .from('solids_sessions')
        .insert([{
          session_id: session.id,
          foods: values.foods,
          amount_eaten: values.amount_eaten,
          reaction: values.reaction
        }])

      if (solidsError) throw solidsError

      toast({
        title: "Success",
        description: "Solids feeding recorded successfully",
      })

      onOpenChange(false)
      form.reset()
      
      if (typeof window.refreshFeedingHistory === 'function') {
        window.refreshFeedingHistory()
      }
    } catch (error) {
      console.error('Error saving solids feeding:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save feeding session. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-2xl font-bold">
            Solids Feeding
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation()
              toast({
                title: "About Solids Feeding",
                description: "Record solid food feedings including types of food, amount eaten, and your baby's reaction. This helps track food introduction and preferences.",
                duration: 5000,
              })
            }}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {step === 'date-time' && (
              <div className="space-y-4">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>When did the feeding occur?</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(feedingDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={feedingDate}
                        onSelect={(date) => date && setFeedingDate(date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("2000-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label>What time did the feeding start?</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={feedingTime}
                      onChange={(e) => setFeedingTime(e.target.value)}
                      className="flex-1"
                    />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Please enter when the feeding started
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    onClick={() => setStep('details')}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 'details' && (
              <>
            {/* Foods */}
            <div className="space-y-2">
              <Label>Foods Offered</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter a food item"
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addFood()
                    }
                  }}
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={addFood}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("foods").map((food, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10"
                    onClick={() => removeFood(index)}
                  >
                    {food}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              {form.formState.errors.foods && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.foods.message}
                </p>
              )}
            </div>

            {/* Amount Eaten */}
            <div className="space-y-2">
              <Label>Amount Eaten</Label>
              <RadioGroup
                defaultValue={form.getValues("amount_eaten")}
                onValueChange={(value) => form.setValue("amount_eaten", value as any)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="taste" id="taste" />
                  <Label htmlFor="taste">Just Tasted</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="some" id="some" />
                  <Label htmlFor="some">Some</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="most" id="most" />
                  <Label htmlFor="most">Most</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Reaction */}
            <div className="space-y-2">
              <Label>Baby's Reaction</Label>
              <RadioGroup
                defaultValue={form.getValues("reaction")}
                onValueChange={(value) => form.setValue("reaction", value as any)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enjoyed" id="enjoyed" />
                  <Label htmlFor="enjoyed">Enjoyed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <Label htmlFor="neutral">Neutral</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disliked" id="disliked" />
                  <Label htmlFor="disliked">Disliked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="allergic" id="allergic" />
                  <Label htmlFor="allergic">Allergic Reaction</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about the feeding..."
                {...form.register("notes")}
              />
              <div className="text-xs text-muted-foreground">
                Suggested topics:
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>New foods introduced</li>
                  <li>Texture preferences</li>
                  <li>Any allergic reactions</li>
                  <li>Feeding environment</li>
                </ul>
              </div>
            </div>
            </>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 border-t pt-4">
            <div className="flex justify-between items-center w-full gap-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              {step === 'details' && (
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Record"}
                </Button>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={() => {
                form.reset()
                setNewFood("")
                setStep('date-time')
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reset Form
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}