"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Milk, HelpCircle, X, Calendar as CalendarIcon, Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
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
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HighlightedText } from "@/components/ui/highlighted-text"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useChildStore } from "@/lib/store/child"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  amount_ml: z.number().min(1).max(500),
  feeding_duration: z.number().min(0).optional(),
  date: z.date(),
  time: z.string(),
  notes: z.string().optional()
})

interface BottleFeedingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BottleFeedingDialog({
  open,
  onOpenChange
}: BottleFeedingDialogProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { selectedChild } = useChildStore()
  const [saving, setSaving] = useState(false)
  const [caregiverId, setCaregiverId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount_ml: 60,
      date: new Date(),
      time: format(new Date(), 'HH:mm'),
      feeding_duration: undefined,
      notes: ""
    }
  })

  const [step, setStep] = useState<'date-time' | 'details'>('date-time')

  useEffect(() => {
    async function getCaregiverId() {
      if (!user) return
      
      let retries = 3;
      
      try {
        while (retries > 0) {
          const { data: caregiver, error: caregiverError } = await supabase
            .from('caregivers')
            .select('id')
            .eq('auth_user_id', user.id)
            .single()

          if (!caregiverError && caregiver) {
            setCaregiverId(caregiver.id)
            return
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000))
          retries--

          if (retries === 0) {
            throw new Error('Failed to get caregiver ID after multiple attempts')
          }
        }
      } catch (err) {
        console.error('Error getting caregiver ID:', err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load caregiver data. Please try again."
        })
      }
    }

    getCaregiverId()
  }, [user, toast])

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
    setStep('date-time')
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
      
      // Parse the date and time
      const feedingDate = values.date
      const [hours, minutes] = values.time.split(':').map(Number)
      
      feedingDate.setHours(hours, minutes)
      const startTime = feedingDate.toISOString()
      
      // Calculate end time based on duration if provided
      const endTime = values.feeding_duration
        ? new Date(feedingDate.getTime() + values.feeding_duration * 60000).toISOString()
        : startTime

      const now = new Date().toISOString()
      
      // Create feeding session with array wrapper and null check
      const { data: session, error: sessionError } = await supabase
        .from('feeding_sessions')
        .insert([{  // Wrap in array
          caregiver_id: caregiverId, // Now we know this is not null
          child_id: selectedChild.id,
          type: 'bottle' as const,
          start_time: startTime,
          end_time: endTime,
          notes: values.notes || null
        }])
        .select()
        .single()

      if (sessionError) throw sessionError
      if (!session) throw new Error('Failed to create feeding session')

      // Create bottle details
      const { error: bottleError } = await supabase
        .from('bottle_sessions')
        .insert([{  // Also wrap in array
          session_id: session.id,
          amount_ml: values.amount_ml,
          amount_oz: Math.round(values.amount_ml * 0.033814 * 10) / 10,
          feeding_duration: values.feeding_duration || null
        }])

      if (bottleError) throw bottleError

      toast({
        title: "Success",
        description: "Bottle feeding recorded successfully",
      })

      onOpenChange(false)
      form.reset()
      
      if (typeof window.refreshFeedingHistory === 'function') {
        window.refreshFeedingHistory()
      }
    } catch (error) {
      console.error('Error saving bottle feeding:', error)
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
            Bottle Feeding
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation()
              toast({
                title: "About Bottle Feeding",
                description: "Record bottle feedings including amount and any notes about the feeding.",
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
                        className={`w-full justify-start text-left font-normal ${
                          !form.watch("date") && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("date") ? format(form.watch("date"), "PPP") : <span>Select feeding date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("date")}
                        onSelect={(date) => date && form.setValue("date", date)}
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
                      className="flex-1"
                      {...form.register("time")}
                    />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Please enter the time you started feeding the baby
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
            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    min={1}
                    max={500}
                    {...form.register("amount_ml", { valueAsNumber: true })}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    milliliters (mL)
                  </div>
                </div>
                <div className="w-20 text-sm text-muted-foreground">
                  ≈ {(form.watch("amount_ml") * 0.033814).toFixed(1)} oz
                </div>
              </div>
              {form.formState.errors.amount_ml && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount_ml.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>How long did the feeding take? (Optional)</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Enter duration in minutes"
                    {...form.register("feeding_duration", { valueAsNumber: true })}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Total minutes spent feeding
                  </div>
                </div>
              </div>
              {form.formState.errors.feeding_duration && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.feeding_duration.message}
                </p>
              )}
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
                  <li>Baby's response to the bottle</li>
                  <li>Any difficulties during feeding</li>
                  <li>Time taken to finish</li>
                  <li>Position used</li>
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