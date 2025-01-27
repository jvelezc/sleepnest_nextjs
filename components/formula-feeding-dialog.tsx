"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PillBottle as BabyBottle, HelpCircle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useChildStore } from "@/lib/store/child"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  amount_ml: z.number().min(1).max(500),
  brand: z.string().min(1, "Please enter the formula brand"),
  concentration: z.enum(["standard", "concentrated", "diluted"]),
  prepared_by: z.string().optional(),
  notes: z.string().optional()
})

interface FormulaFeedingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FormulaFeedingDialog({
  open,
  onOpenChange
}: FormulaFeedingDialogProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { selectedChild } = useChildStore()
  const [saving, setSaving] = useState(false)
  const [caregiverId, setCaregiverId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount_ml: 60,
      brand: "",
      concentration: "standard",
      prepared_by: "",
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
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSaving(true)
      const amountMl = Math.round(values.amount_ml) // Ensure whole number

      if (!selectedChild) {
        throw new Error('No child selected')
      }

      if (!caregiverId) {
        throw new Error('No caregiver ID found')
      }

      const { data: session, error: sessionError } = await supabase
        .from('feeding_sessions')
        .insert([{
          caregiver_id: caregiverId,
          child_id: selectedChild.id,
          type: 'formula',
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(), // Formula feeding is instantaneous
          notes: values.notes || null
        }])
        .select()
        .single()

      if (sessionError) throw sessionError
      if (!session) throw new Error('Failed to create feeding session')

      const { error: formulaError } = await supabase
        .from('formula_sessions')
        .insert([{
          session_id: session.id,
          brand: values.brand,
          amount_ml: amountMl,
          concentration: values.concentration,
          prepared_by: values.prepared_by || null
        }])

      if (formulaError) throw formulaError

      toast({
        title: "Success",
        description: "Formula feeding recorded successfully",
      })

      onOpenChange(false)
      form.reset()
      
      if (typeof window.refreshFeedingHistory === 'function') {
        window.refreshFeedingHistory()
      }
    } catch (error) {
      console.error('Error saving formula feeding:', error)
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
            Formula Feeding
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation()
              toast({
                title: "About Formula Feeding",
                description: "Record formula feedings including amount, brand, concentration, and preparation details. This helps track your baby's formula intake and preferences.",
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

            {/* Brand */}
            <div className="space-y-2">
              <Label>Formula Brand</Label>
              <Input
                placeholder="Enter formula brand name"
                {...form.register("brand")}
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.brand.message}
                </p>
              )}
            </div>

            {/* Concentration */}
            <div className="space-y-2">
              <Label>Formula Concentration</Label>
              <RadioGroup
                defaultValue={form.getValues("concentration")}
                onValueChange={(value) => form.setValue("concentration", value as "standard" | "concentrated" | "diluted")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="concentrated" id="concentrated" />
                  <Label htmlFor="concentrated">Concentrated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diluted" id="diluted" />
                  <Label htmlFor="diluted">Diluted</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Prepared By */}
            <div className="space-y-2">
              <Label>Prepared By (Optional)</Label>
              <Input
                placeholder="Who prepared the formula?"
                {...form.register("prepared_by")}
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
                  <li>Baby's response to the formula</li>
                  <li>Water temperature used</li>
                  <li>Time taken to finish</li>
                  <li>Any digestive reactions</li>
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