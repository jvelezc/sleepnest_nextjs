"use client"

import { useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Calendar as CalendarIcon } from "lucide-react"
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
import { Clock, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HighlightedText } from "@/components/ui/highlighted-text"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { saveBreastfeedingSession } from "@/lib/services/feeding"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth" 
import { useChildStore } from "@/lib/store/child"

interface BreastfeedingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'date-time' | 'right-question' | 'right-duration' | 'left-question' | 'left-duration' | 'latch-quality' | 'notes' | 'summary'

export function BreastfeedingDialog({
  open,
  onOpenChange
}: BreastfeedingDialogProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { selectedChild } = useChildStore()
  const [step, setStep] = useState<Step>('date-time')
  const [leftFeeding, setLeftFeeding] = useState<number | null>(null)
  const [rightFeeding, setRightFeeding] = useState<number | null>(null)
  const [showCustomDuration, setShowCustomDuration] = useState(false)
  const [customDuration, setCustomDuration] = useState("")
  const [latchQuality, setLatchQuality] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [feedingDate, setFeedingDate] = useState<Date>(new Date())
  const [feedingTime, setFeedingTime] = useState(format(new Date(), 'HH:mm'))

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  const handleCustomDurationSubmit = () => {
    const duration = parseInt(customDuration)
    if (!isNaN(duration) && duration > 0 && duration <= 60) {
      if (step === 'right-duration') {
        setRightFeeding(duration)
        setStep('left-question')
      } else if (step === 'left-duration') {
        setLeftFeeding(duration)
        setStep('latch-quality')
      }
      setShowCustomDuration(false)
      setCustomDuration("")
    }
  }

  const handleDurationSelect = (duration: number) => {
    if (step === 'right-duration') {
      setRightFeeding(duration)
      setStep('left-question')
    } else if (step === 'left-duration') {
      setLeftFeeding(duration)
      setStep('latch-quality')
    }
  }

  const handleLatchQualitySelect = (quality: string) => {
    setLatchQuality(quality)
    if (notes) {
      setStep('summary')
    } else {
      setStep('notes')
    }
  }

  const handleNotesSubmit = () => {
    if (notes.trim()) {
      setStep('summary')
    } else {
      setNotes("")
      setStep('summary')
    }
  }

  const resetForm = () => {
    setStep('date-time')
    setLeftFeeding(null)
    setRightFeeding(null)
    setShowCustomDuration(false)
    setLatchQuality(null)
    setCustomDuration("")
    setNotes("")
    setFeedingDate(new Date())
    setFeedingTime(format(new Date(), 'HH:mm'))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      
      // Parse the date and time
      const startDate = new Date(feedingDate)
      const [hours, minutes] = feedingTime.split(':').map(Number)
      startDate.setHours(hours, minutes)

      if (!selectedChild) {
        throw new Error('No child selected')
      }

      const feedings: Array<{side: "Left" | "Right", duration: number, order: number}> = []

      if (leftFeeding !== null) {
        feedings.push({
          side: "Left",
          duration: leftFeeding,
          order: 0
        })
      }

      if (rightFeeding !== null) {
        feedings.push({
          side: "Right",
          duration: rightFeeding,
          order: feedings.length
        })
      }

      // Get caregiver ID from user metadata
      const caregiverId = user?.id
      if (!caregiverId) throw new Error('User not found')

      await saveBreastfeedingSession({
        caregiverId,
        childId: selectedChild.id,
        startTime: startDate,
        latchQuality,
        feedings,
        notes: notes.trim() || undefined
      })

      toast({
        title: "Success",
        description: "Feeding session recorded successfully",
      })

      onOpenChange(false)
      resetForm()
      
      // Trigger feeding history refresh
      if (typeof window.refreshFeedingHistory === 'function') {
        window.refreshFeedingHistory()
      }
    } catch (error) {
      console.error('Error saving feeding session:', error)
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
            Breastfeeding
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 rounded-full p-0"
            onClick={(e) => {
              e.stopPropagation()
              toast({
                title: "Why track feeding duration?",
                description: "Recording feeding duration helps establish patterns and ensure adequate nutrition. Estimates are fine - no need to be exact!",
                duration: 5000,
              })
            }}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {step === 'date-time' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                When did {selectedChild?.name || 'baby'} feed?
              </h3>
              
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>Date</Label>
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
                <Label>Time</Label>
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

              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('right-question')}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'right-question' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Did {selectedChild?.name || 'baby'} feed from the <HighlightedText>right</HighlightedText>?
              </h3>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('right-duration')}
                >
                  Yes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setStep('left-question')}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {step === 'right-duration' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                How long did {selectedChild?.name || 'baby'} feed from the <HighlightedText>right</HighlightedText>?
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[5, 10, 15, 20, 25, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleDurationSelect(mins)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-muted hover:bg-accent transition-colors"
                  >
                    <span className="text-base font-medium">{mins} minutes</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomDuration(true)}
                  size="sm"
                  className="w-full max-w-[200px]"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Enter Custom Time
                </Button>

                {showCustomDuration && (
                  <div className="flex gap-2 w-full max-w-[200px]">
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      placeholder="Enter minutes"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="text-center"
                    />
                    <Button size="sm" onClick={handleCustomDurationSubmit}>
                      Set
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'left-question' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Did {selectedChild?.name || 'baby'} feed from the <HighlightedText>left</HighlightedText>?
              </h3>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('left-duration')}
                >
                  Yes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setStep('latch-quality')}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {step === 'left-duration' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                How long did {selectedChild?.name || 'baby'} feed from the <HighlightedText>left</HighlightedText>?
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[5, 10, 15, 20, 25, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleDurationSelect(mins)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-muted hover:bg-accent transition-colors"
                  >
                    <span className="text-base font-medium">{mins} minutes</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomDuration(true)}
                  size="sm"
                  className="w-full max-w-[200px]"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Enter Custom Time
                </Button>

                {showCustomDuration && (
                  <div className="flex gap-2 w-full max-w-[200px]">
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      placeholder="Enter minutes"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="text-center"
                    />
                    <Button size="sm" onClick={handleCustomDurationSubmit}>
                      Set
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'latch-quality' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                How would you rate {selectedChild?.name || 'baby'}'s latch during breastfeeding?
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant={latchQuality === 'excellent' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handleLatchQualitySelect('excellent')}
                >
                  Excellent
                  <span className="ml-2 text-sm text-muted-foreground">
                    (comfortable and effective)
                  </span>
                </Button>
                <Button
                  type="button"
                  variant={latchQuality === 'good' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handleLatchQualitySelect('good')}
                >
                  Good
                  <span className="ml-2 text-sm text-muted-foreground">
                    (some discomfort but generally effective)
                  </span>
                </Button>
                <Button
                  type="button"
                  variant={latchQuality === 'poor' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handleLatchQualitySelect('poor')}
                >
                  Poor
                  <span className="ml-2 text-sm text-muted-foreground">
                    (painful or ineffective)
                  </span>
                </Button>
              </div>
            </div>
          )}

          {step === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Additional Notes</h3>
              <Textarea
                placeholder="Optional: Add any observations about the feeding..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Suggested topics:
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Baby's mood during feeding</li>
                  <li>Any difficulties or concerns</li>
                  <li>Position used for feeding</li>
                  <li>Distractions or interruptions</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNotesSubmit}>
                  {notes.trim() ? 'Save Notes' : 'Skip Notes'}
                </Button>
              </div>
            </div>
          )}

          {step === 'summary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Feeding Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">
                      <HighlightedText>Right</HighlightedText>
                    </div>
                    {rightFeeding ? (
                      <div className="text-2xl font-bold">{rightFeeding} min</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not used</div>
                    )}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-sm font-medium mb-2">
                      <HighlightedText>Left</HighlightedText>
                    </div>
                    {leftFeeding ? (
                      <div className="text-2xl font-bold">{leftFeeding} min</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not used</div>
                    )}
                  </div>
                </Card>
              </div>
              {(leftFeeding || rightFeeding) && (
                <div className="text-center text-sm text-muted-foreground">
                  Total feeding time: {(leftFeeding || 0) + (rightFeeding || 0)} minutes 
                </div>
              )}
              {latchQuality && (
                <div className="text-center text-sm">
                  Latch Quality: <span className="font-medium capitalize">{latchQuality}</span>
                </div>
              )}
              {notes && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Notes:</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">{notes}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
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
            {step === 'summary' && (
              <Button
                type="button"
                size="sm"
                className="flex-1"
                onClick={handleSubmit}
                disabled={(!leftFeeding && !rightFeeding) || saving}
              >
                {saving ? "Saving..." : "Save Record"}
              </Button>
            )}
          </div>
          {step === 'summary' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={resetForm}
            >
              <X className="mr-2 h-4 w-4" />
              Reset and Start Over
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}