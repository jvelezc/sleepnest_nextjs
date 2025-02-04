"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Moon, HelpCircle, X, Calendar as CalendarIcon, Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useChildStore } from "@/lib/store/child"
import { useCaregiverStore } from "@/lib/store/caregiver"
import { supabase } from "@/lib/supabase"

type StepType = 
  | 'start'
  | 'end'
  | 'location'
  | 'environment'
  | 'onset'
  | 'sound'
  | 'sound_level'
  | 'sleep_latency'
  | 'restfulness'
  | 'sleep_debt'
  | 'notes'

const formSchema = z.object({
  start_time: z.date(),
  start_time_input: z.string(),
  end_time: z.date(),
  end_time_input: z.string(),
  location_id: z.string().min(1, "Please select a location"),
  environment_id: z.string().min(1, "Please select an environment"),
  onset_method_id: z.string().min(1, "Please select an onset method"),
  sound_id: z.string().optional(),
  sound_level_id: z.string().optional(),
  sleep_latency: z.number().min(0).max(60),
  restfulness_id: z.string().min(1, "Please select a restfulness rating"),
  signs_of_sleep_debt: z.boolean().default(false),
  notes: z.string().optional()
})

interface SleepDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SleepDialog({
  open,
  onOpenChange
}: SleepDialogProps) {
  const { toast } = useToast()
  const { selectedChild } = useChildStore()
  const { caregiverId } = useCaregiverStore()
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState<StepType>('start')
  const [locations, setLocations] = useState<{id: string, description: string}[]>([])
  const [environments, setEnvironments] = useState<{id: string, description: string}[]>([])
  const [onsetMethods, setOnsetMethods] = useState<{id: string, description: string}[]>([])
  const [restfulnessRatings, setRestfulnessRatings] = useState<{id: string, description: string}[]>([])
  const [sleepSounds, setSleepSounds] = useState<{id: string, name: string}[]>([])
  const [soundLevels, setSoundLevels] = useState<{id: string, level: string}[]>([])

  const defaultStartTime = new Date()
  const defaultEndTime = new Date(defaultStartTime)
  defaultEndTime.setHours(defaultEndTime.getHours() + 8) // Default 8 hour sleep duration

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_time: defaultStartTime,
      start_time_input: format(defaultStartTime, 'HH:mm'),
      end_time: defaultEndTime,
      end_time_input: format(defaultEndTime, 'HH:mm'),
      location_id: '',
      environment_id: '',
      onset_method_id: '',
      sound_id: undefined,
      sound_level_id: undefined,
      sleep_latency: 5,
      restfulness_id: '',
      signs_of_sleep_debt: false,
      notes: ''
    }
  })

  // Load lookup data
  useEffect(() => {
    async function loadLookupData() {
      try {
        // Load and sort lookup data alphabetically
        const [
          { data: locationData },
          { data: environmentData },
          { data: onsetData },
          { data: restfulnessData },
          { data: soundData },
          { data: levelData }
        ] = await Promise.all([
          supabase.from('nap_location').select('id, description').order('description'),
          supabase.from('sleep_environment').select('id, description').order('description'),
          supabase.from('sleep_onset_method').select('id, description').order('description'),
          supabase.from('restfulness_rating').select('id, description').order('description'),
          supabase.from('sleep_sounds').select('id, name').order('name'),
          supabase.from('sound_levels').select('id, level').order('level')
        ])

        if (locationData) setLocations(locationData)
        if (environmentData) setEnvironments(environmentData)
        if (onsetData) setOnsetMethods(onsetData)
        if (restfulnessData) setRestfulnessRatings(restfulnessData)
        if (soundData) setSleepSounds(soundData)
        if (levelData) setSoundLevels(levelData)
      } catch (err) {
        console.error('Error loading lookup data:', err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sleep tracking options"
        })
      }
    }

    if (open) {
      loadLookupData()
    }
  }, [open, toast])

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
    setCurrentStep('start')
  }

  const nextStep = () => {
    const nextIndex = STEPS.indexOf(currentStep) + 1
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex])
    }
  }

  const prevStep = () => {
    const prevIndex = STEPS.indexOf(currentStep) - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex])
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Starting sleep session submission...')
      
      // Validate required data
      setSaving(true)

      if (!selectedChild) {
        throw new Error('Please select a child first')
      }

      if (!caregiverId) {
        throw new Error('Caregiver data not found')
      }
      
      // Parse dates and times
      const startDate = new Date(values.start_time)
      const endDate = new Date(values.end_time)
      
      const [startHours, startMinutes] = values.start_time_input.split(':').map(Number)
      const [endHours, endMinutes] = values.end_time_input.split(':').map(Number)
      
      startDate.setHours(startHours, startMinutes, 0, 0)
      endDate.setHours(endHours, endMinutes, 0, 0)

      // Validate end time is after start time
      if (endDate <= startDate) {
        throw new Error('End time must be after start time')
      }

      const rpcParams = {
        p_caregiver_id: caregiverId,
        p_child_id: selectedChild.id,
        p_start_time: startDate.toISOString(),
        p_end_time: endDate.toISOString(),
        p_location_id: values.location_id,
        p_environment_id: values.environment_id,
        p_onset_method_id: values.onset_method_id,
        p_restfulness_id: values.restfulness_id,
        p_signs_of_sleep_debt: values.signs_of_sleep_debt,
        p_sound_id: values.sound_id,
        p_sound_level_id: values.sound_level_id,
        p_notes: values.notes?.trim() || null
      }

      console.log('Attempting RPC call with params:', rpcParams)

      const { data: result, error: sessionError } = await supabase.rpc(
        'handle_sleep_session',
        rpcParams
      )

      if (sessionError) throw sessionError

      // Handle the text response from the function
      if (typeof result === 'string' && result.startsWith('Error:')) {
        throw new Error(result.substring(7)) // Remove 'Error: ' prefix
      }

      toast({
        title: "Success",
        description: "Sleep session recorded successfully"
      })

      onOpenChange(false)
      form.reset()
      setCurrentStep('start')
      
      if (typeof window.refreshSleepHistory === 'function') {
        window.refreshSleepHistory()
      }
    } catch (error) {
      console.error('Error in sleep session submission:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save sleep session"
      })
    } finally {
      setSaving(false)
    }
  }

  // Add this function to check if current step is valid
  const isCurrentStepValid = () => {
    const values = form.getValues()
    
    switch (currentStep) {
      case 'start':
        return !!values.start_time && !!values.start_time_input
      case 'end':
        return !!values.end_time && !!values.end_time_input
      case 'location':
        return !!values.location_id
      case 'environment':
        return !!values.environment_id
      case 'onset':
        return !!values.onset_method_id
      case 'sound':
        return true // Optional
      case 'sound_level':
        return true // Optional
      case 'sleep_latency':
        return values.sleep_latency >= 0 && values.sleep_latency <= 60
      case 'restfulness':
        return !!values.restfulness_id
      case 'sleep_debt':
        return true // Always valid as it's a boolean
      case 'notes':
        return true // Optional field
      default:
        return false
    }
  }

  const STEPS = [
    'start',
    'end', 
    'location',
    'environment',
    'onset',
    'sound',
    'sound_level',
    'sleep_latency',
    'restfulness',
    'sleep_debt',
    'notes'
  ] as const

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto flex flex-col"
        aria-describedby="sleep-dialog-description"
      >
        <DialogHeader className="relative border-b pb-4">
          <DialogTitle className="text-center text-2xl font-bold">
            {selectedChild ? `Record ${selectedChild.name}'s Sleep` : 'Record Sleep'}
          </DialogTitle>
          <div id="sleep-dialog-description" className="sr-only">
            Track your baby's sleep details including start time, end time, location, and other important factors.
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-8 w-8 rounded-full p-0"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="max-w-[300px] p-4" 
              side="right"
              align="start"
              sideOffset={10}
            >
              <p className="mb-2">
                Sleep tracking helps:
              </p>
              <ul className="mb-4 space-y-1 list-disc list-inside">
                <li>Establish healthy sleep patterns</li>
                <li>Monitor sleep quality</li>
                <li>Identify sleep associations</li>
                <li>Track total sleep duration</li>
              </ul>
              <p>
                Regular tracking helps identify natural sleep patterns and establish healthy routines.
              </p>
            </PopoverContent>
          </Popover>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="flex-1 py-6">
            <div className="space-y-4">
              {currentStep === 'start' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-center">
                    When did {selectedChild?.name || 'your baby'} go to sleep?
                  </h3>
                  <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal h-auto py-3"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(form.watch("start_time"), "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={form.watch("start_time")}
                          onSelect={(date) => date && form.setValue("start_time", date)}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        className="flex-1"
                        {...form.register("start_time_input")}
                      />
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'end' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-center">
                    When did {selectedChild?.name || 'your baby'} wake up?
                  </h3>
                  <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal h-auto py-3"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(form.watch("end_time"), "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={form.watch("end_time")}
                          onSelect={(date) => date && form.setValue("end_time", date)}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        className="flex-1"
                        {...form.register("end_time_input")}
                      />
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'location' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    Where did {selectedChild?.name || 'your baby'} sleep?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {locations.map((location) => (
                      <Button
                        key={location.id}
                        type="button"
                        variant={form.watch("location_id") === location.id ? "default" : "outline"}
                        className="w-full py-3 px-4 h-auto text-left justify-start hover:bg-accent/50 whitespace-normal"
                        onClick={() => {
                          form.setValue("location_id", location.id)
                          form.clearErrors("location_id")
                          nextStep()
                        }}
                      >
                        <Moon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{location.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'environment' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    What was the sleep environment like?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {environments.map((env) => (
                      <Button
                        key={env.id}
                        type="button"
                        variant={form.watch("environment_id") === env.id ? "default" : "outline"}
                        className="w-full py-3 px-4 h-auto text-left justify-start hover:bg-accent/50 whitespace-normal"
                        onClick={() => {
                          form.setValue("environment_id", env.id)
                          form.clearErrors("environment_id")
                          nextStep()
                        }}
                      >
                        <Moon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{env.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'onset' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    How did {selectedChild?.name || 'your baby'} fall asleep?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {onsetMethods.map((method) => (
                      <Button
                        key={method.id}
                        type="button"
                        variant={form.watch("onset_method_id") === method.id ? "default" : "outline"}
                        className="w-full py-3 px-4 h-auto text-left justify-start hover:bg-accent/50 whitespace-normal"
                        onClick={() => {
                          form.setValue("onset_method_id", method.id)
                          form.clearErrors("onset_method_id")
                          nextStep()
                        }}
                      >
                        <Moon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{method.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'sound' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    What sound was used for sleep? (Optional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {sleepSounds.map((sound) => (
                      <Button
                        key={sound.id}
                        type="button"
                        variant={form.watch("sound_id") === sound.id ? "default" : "outline"}
                        className="w-full py-3 px-4 h-auto text-left justify-start hover:bg-accent/50 whitespace-normal"
                        onClick={() => {
                          form.setValue("sound_id", sound.id)
                          nextStep()
                        }}
                      >
                        <Moon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{sound.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'sound_level' && form.watch("sound_id") && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    What was the sound level? (Optional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {soundLevels.map((level) => (
                      <Button
                        key={level.id}
                        type="button"
                        variant={form.watch("sound_level_id") === level.id ? "default" : "outline"}
                        className="w-full py-3 px-4 h-auto text-left justify-start hover:bg-accent/50 whitespace-normal"
                        onClick={() => {
                          form.setValue("sound_level_id", level.id)
                          nextStep()
                        }}
                      >
                        <Moon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{level.level}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'sleep_latency' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    How long did it take {selectedChild?.name || 'your baby'} to fall asleep?
                  </h3>
                  <div className="max-w-sm mx-auto space-y-6">
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={60}
                        step={1}
                        value={[form.watch("sleep_latency")]}
                        onValueChange={(value) => {
                          form.setValue("sleep_latency", value[0])
                          form.clearErrors("sleep_latency")
                        }}
                        className="py-4"
                      />
                      <div className="text-center">
                        <span className="text-2xl font-semibold">{form.watch("sleep_latency")}</span>
                        <span className="text-muted-foreground ml-2">minutes</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      <p>Slide to adjust the time it took to fall asleep</p>
                      <p className="mt-1">Most babies take 5-20 minutes to fall asleep</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'restfulness' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    How was {selectedChild?.name || 'your baby\'s'} sleep?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {restfulnessRatings.map((rating) => (
                      <Button
                        key={rating.id}
                        type="button"
                        variant={form.watch("restfulness_id") === rating.id ? "default" : "outline"}
                        className="w-full py-3 px-4 h-auto text-left justify-start hover:bg-accent/50 whitespace-normal"
                        onClick={() => {
                          form.setValue("restfulness_id", rating.id)
                          form.clearErrors("restfulness_id")
                          nextStep()
                        }}
                      >
                        <Moon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{rating.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'sleep_debt' && (
                <div className="space-y-2 mt-6">
                  <h3 className="text-lg font-medium text-center">
                    Did {selectedChild?.name || 'your baby'} show signs of being overtired?
                  </h3>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Label htmlFor="sleep-debt">Signs of sleep debt</Label>
                    <Switch
                      id="sleep-debt"
                      checked={form.watch("signs_of_sleep_debt")}
                      onCheckedChange={(checked) => {
                        form.setValue("signs_of_sleep_debt", checked)
                        nextStep()
                      }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground text-center mt-4">
                    <p>Signs of sleep debt may include:</p>
                    <ul className="mt-2 space-y-1">
                      <li>Excessive fussiness</li>
                      <li>Difficulty falling asleep</li>
                      <li>Short sleep duration</li>
                      <li>Frequent night wakings</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 'notes' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center">
                    Any notes about {selectedChild?.name || 'your baby\'s'} sleep?
                  </h3>
                  <div className="max-w-xl mx-auto space-y-2">
                    <Textarea
                      placeholder="Add any notes about the sleep session..."
                      {...form.register("notes")}
                      className="min-h-[80px] max-h-[200px]"
                    />
                    <div className="text-xs text-muted-foreground">
                      Suggested topics:
                      <ul className="mt-1 space-y-1 list-disc list-inside">
                        <li>Sleep cues observed</li>
                        <li>Any disruptions during sleep</li>
                        <li>Mood before and after sleep</li>
                        <li>Changes to normal routine</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 p-4">
            {/* Progress Dots */}
            <div className="flex justify-center mb-4">
              <div className="flex gap-1.5">
                {STEPS.map((step, index) => (
                  <div
                    key={step}
                    className={`h-1.5 w-6 rounded-full transition-colors duration-200 ${
                      STEPS.indexOf(currentStep) === index ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={currentStep === 'start' ? handleClose : prevStep}
              >
                {currentStep === 'start' ? 'Cancel' : 'Back'}
              </Button>
              
              {currentStep === 'notes' ? (
                <Button
                  type="submit"
                  size="sm"
                  className="w-full"
                  disabled={saving || !form.formState.isValid}
                >
                  {saving ? (
                    <>
                      <span className="mr-2">Saving</span>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    "Save Sleep Record"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  onClick={nextStep}
                  disabled={!isCurrentStepValid()}
                >
                  Next
                </Button>
              )}
            </div>

            {/* Show validation message if step is invalid */}
            {!isCurrentStepValid() && (
              <p className="text-sm text-destructive text-center mt-2">
                {currentStep === 'restfulness' && 'Please select a restfulness rating'}
                {currentStep === 'location' && 'Please select a location'}
                 {currentStep === 'environment' && 'Please select an environment'}
                {currentStep === 'onset' && 'Please select an onset method'}
                {currentStep === 'sleep_latency' && 'Please set a valid sleep latency time'}
              </p>
            )}

            {/* Reset Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-muted-foreground hover:text-destructive"
              onClick={() => {
                form.reset()
                setCurrentStep('start')
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Reset Form
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}