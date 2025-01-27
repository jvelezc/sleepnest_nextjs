"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Milk, HelpCircle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HighlightedText } from "@/components/ui/highlighted-text"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useChildStore } from "@/lib/store/child"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  amount_ml: z.number().min(1).max(500),
  milk_type: z.enum(["expressed", "donor"]),
  warmed: z.boolean().default(false),
  notes: z.string().optional()
})

interface BottleFeedingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FeedingType = 'breastfeeding' | 'bottle' | 'formula' | 'solids'

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
      milk_type: "expressed",
      warmed: false,
      notes: ""
    }
  })

  useEffect(() => {
    async function getCaregiverId() {
      if (!user) return

      try {
        // Query the caregivers table directly instead of using RPC
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
  }, [user])

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
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

      const now = new Date().toISOString()
      
      // Create feeding session with array wrapper and null check
      const { data: session, error: sessionError } = await supabase
        .from('feeding_sessions')
        .insert([{  // Wrap in array
          caregiver_id: caregiverId, // Now we know this is not null
          child_id: selectedChild.id,
          type: 'bottle' as FeedingType,
          start_time: now,
          end_time: now,
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
          milk_type: values.milk_type,
          amount_ml: values.amount_ml,
          amount_oz: Math.round(values.amount_ml * 0.033814 * 10) / 10,
          warmed: values.warmed
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
                description: "Record expressed breast milk or donor milk feedings. Track amount, temperature preference, and any notes about the feeding.",
                duration: 5000,
              })
            }}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </Button>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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

            {/* Milk Type */}
            <div className="space-y-2">
              <Label>Milk Type</Label>
              <RadioGroup
                defaultValue={form.getValues("milk_type")}
                onValueChange={(value) => form.setValue("milk_type", value as "expressed" | "donor")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expressed" id="expressed" />
                  <Label htmlFor="expressed">Expressed Breast Milk</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="donor" id="donor" />
                  <Label htmlFor="donor">Donor Milk</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Warmed */}
            <div className="flex items-center justify-between">
              <Label htmlFor="warmed">Warmed Before Feeding</Label>
              <Switch
                id="warmed"
                checked={form.watch("warmed")}
                onCheckedChange={(checked) => form.setValue("warmed", checked)}
              />
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
              <Button
                type="submit"
                size="sm"
                className="flex-1"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Record"}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={() => form.reset()}
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