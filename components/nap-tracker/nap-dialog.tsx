"use client"

import { useState, useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, HelpCircle, X, Moon, BedDouble } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useChildStore } from "@/lib/store/child"
import { supabase } from "@/lib/supabase"
import { useCaregiverStore } from "@/lib/store/caregiver"

const stepVariants = {
  enter: {
    x: 20,
    opacity: 0
  },
  center: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -20,
    opacity: 0
  }
}

const STEPS = [
  'start',
  'end', 
  'location',
  'environment',
  'onset',
  'sleep_latency',
  'restfulness',
  'sleep_debt',
  'notes'
] as const
type StepType = typeof STEPS[number]

const formSchema = z.object({
  start_time: z.date(),
  start_time_input: z.string(),
  end_time: z.date(),
  end_time_input: z.string(),
  location_id: z.string().min(1, "Please select a location"),
  environment_id: z.string().min(1, "Please select an environment"),
  onset_method_id: z.string().min(1, "Please select an onset method"),
  sleep_latency: z.number().min(0).max(60),
  restfulness_id: z.string().min(1, "Please select a restfulness rating"),
  signs_of_sleep_debt: z.boolean().default(false),
  notes: z.string().optional()
})

interface NapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NapDialog({ open, onOpenChange }: NapDialogProps) { 
  const { toast } = useToast()
  const { user } = useAuth()
  const { caregiverId } = useCaregiverStore()
  const { selectedChild } = useChildStore()
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState<StepType>('start')
  const [locations, setLocations] = useState<{id: string, description: string}[]>([])
  const [environments, setEnvironments] = useState<{id: string, description: string}[]>([])
  const [onsetMethods, setOnsetMethods] = useState<{id: string, description: string}[]>([])
  const [restfulnessRatings, setRestfulnessRatings] = useState<{id: string, description: string}[]>([])

  const currentStepIndex = useMemo(() => 
    STEPS.findIndex(step => step === currentStep)
  , [currentStep])

  const defaultStartTime = new Date()
  const defaultEndTime = new Date(defaultStartTime)
  defaultEndTime.setMinutes(defaultEndTime.getMinutes() + 30)

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
      restfulness_id: '',
      sleep_latency: 5,
      signs_of_sleep_debt: false
    }
  })

  // Load lookup data
  useEffect(() => {
    async function loadLookupData() {
      try {
        // Load and sort lookup data alphabetically by description
        const [
          { data: locationData },
          { data: environmentData },
          { data: onsetData },
          { data: restfulnessData }
        ] = await Promise.all([
          supabase.from('nap_location').select('id, description').order('description'),
          supabase.from('sleep_environment').select('id, description').order('description'),
          supabase.from('sleep_onset_method').select('id, description').order('description'),
          supabase.from('restfulness_rating').select('id, description').order('description')
        ])

        if (locationData) setLocations(locationData)
        if (environmentData) setEnvironments(environmentData)
        if (onsetData) setOnsetMethods(onsetData)
        if (restfulnessData) setRestfulnessRatings(restfulnessData)
      } catch (err) {
        console.error('Error loading lookup data:', err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load nap tracking options"
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
    // Trigger haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
    
    const nextIndex = currentStepIndex + 1
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex])
    }
  }

  const prevStep = () => {
    // Trigger haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }

    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex])
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Starting nap session submission...')
      setSaving(true)

      if (!selectedChild) {
        console.error('No child selected')
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a child first"
        })
        return
      }

      if (!caregiverId) {
        console.error('No caregiver ID found:', { caregiverId })
        toast({
          variant: "destructive",
          title: "Error",
          description: "Caregiver data not found"
        })
        return
      }
      
      // Parse dates and times
      const startDate = new Date(values.start_time)
      const endDate = new Date(values.end_time)  // Use end_time instead of start_time
      
      console.log('Initial dates:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        startTimeInput: values.start_time_input,
        endTimeInput: values.end_time_input
      })

      const [startHours, startMinutes] = values.start_time_input.split(':').map(Number)
      const [endHours, endMinutes] = values.end_time_input.split(':').map(Number)
      
      console.log('Parsed times:', {
        startHours,
        startMinutes,
        endHours,
        endMinutes
      })

      startDate.setHours(startHours, startMinutes, 0, 0)
      endDate.setHours(endHours, endMinutes, 0, 0)

      console.log('After setting hours:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })

      // Validate end time is after start time
      if (endDate <= startDate) {
        console.error('Invalid time range:', { startDate, endDate })
        toast({
          variant: "destructive",
          title: "Invalid Times",
          description: "End time must be after start time"
        })
        return
      }

      const rpcParams = {
        p_caregiver_id: caregiverId,
        p_child_id: selectedChild.id,
        p_start_time: startDate.toISOString(),
        p_end_time: endDate.toISOString(),
        p_location_id: values.location_id,
        p_environment_id: values.environment_id,
        p_onset_method_id: values.onset_method_id,
        p_sleep_latency: values.sleep_latency,
        p_restfulness_id: values.restfulness_id,
        p_signs_of_sleep_debt: values.signs_of_sleep_debt,
        p_notes: values.notes?.trim() || ''
      }

      console.log('Attempting RPC call with params:', rpcParams)

      const { data: result, error: sessionError } = await supabase.rpc(
        'handle_nap_session',
        rpcParams
      )

      if (sessionError) {
        console.error('RPC Error:', sessionError)
        throw sessionError
      }

      // Handle the text response from the function
      if (typeof result === 'string' && result.startsWith('Error:')) {
        throw new Error(result.substring(7)) // Remove 'Error: ' prefix
      }

      console.log('Nap session created successfully:', result)

      toast({
        title: "Success",
        description: "Nap session recorded successfully"
      })

      onOpenChange(false)
      form.reset()
      setCurrentStep('start')
      
      if (typeof window.refreshNapHistory === 'function') {
        try {
          window.refreshNapHistory()
        } catch (refreshError) {
          console.error('Error refreshing nap history:', refreshError)
        }
      }
    } catch (error) {
      console.error('Error in nap session submission:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save nap session. Please try again."
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto flex flex-col"
        aria-describedby="nap-dialog-description"
      >
        <DialogHeader className="relative border-b pb-4">
          <DialogTitle className="text-center text-2xl font-bold">
            {selectedChild ? `Record ${selectedChild.name}'s Nap` : 'Record Nap'}
          </DialogTitle>
          <div id="nap-dialog-description" className="sr-only">
            Track your baby's nap details including start time, end time, location, and other important factors.
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-8 w-8 rounded-full p-0"
                onClick={(e) => {
                  e.stopPropagation()
                }}
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
                Naps are essential for your baby's growth, learning, and mood. Quality naps help:
              </p>
              <ul className="mb-4 space-y-1 list-disc list-inside">
                <li>Brain development and memory consolidation</li>
                <li>Prevent overtiredness and night sleep disruption</li>
                <li>Regulate mood and reduce fussiness</li>
                <li>Support physical growth and immune function</li>
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
            <AnimatePresence mode="wait">
            {currentStep === 'start' && (
              <motion.div
                key="start"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center">
                    When did {selectedChild?.name || 'your baby'} fall asleep?
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
              </motion.div>
            )}

            {currentStep === 'end' && (
              <motion.div
                key="end"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
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
              </motion.div>
            )}

            {currentStep === 'location' && (
              <motion.div
                key="location"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center">
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
                        <BedDouble className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{location.description}</span>
                      </Button>
                    ))}
                  </div>
                  {form.formState.errors.location_id && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.location_id.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 'environment' && (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center">
                    How was {selectedChild?.name || 'your baby\'s'} sleep environment?
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
                  {form.formState.errors.environment_id && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.environment_id.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {currentStep === 'onset' && (
              <>
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
                          if (!form.formState.errors.sleep_latency) {
                          nextStep()
                          }
                        }}
                      >
                        <Moon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-2">{method.description}</span>
                      </Button>
                    ))}
                  </div>
                  {form.formState.errors.onset_method_id && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.onset_method_id.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {currentStep === 'sleep_latency' && (
              <motion.div
                key="sleep_latency"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
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
                    {form.formState.errors.sleep_latency && (
                      <p className="text-sm text-destructive text-center mt-1">
                        {form.formState.errors.sleep_latency.message}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground text-center">
                      <p>Slide to adjust the time it took your baby to fall asleep</p>
                      <p className="mt-1">Most babies take 5-20 minutes to fall asleep</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 'restfulness' && (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-center mb-4">
                    How was {selectedChild?.name || 'your baby\'s'} nap?
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
                  {form.formState.errors.restfulness_id && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.restfulness_id.message}
                    </p>
                  )}
                </div>
              </>
            )}
            
            {currentStep === 'sleep_debt' && (
              <motion.div
                key="sleep_debt"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <div className="space-y-2 mt-6">
                  <h3 className="text-lg font-medium text-center">
                    Did {selectedChild?.name || 'your baby'} seem overtired?
                  </h3>
                  <div className="grid grid-cols-2 gap-3 max-w-[240px] mx-auto">
                    <Button
                      type="button"
                      variant={form.watch("signs_of_sleep_debt") ? "default" : "outline"}
                      className="w-full py-3 h-auto hover:bg-accent/50"
                      onClick={() => {
                        form.setValue("signs_of_sleep_debt", true)
                        nextStep()
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant={!form.watch("signs_of_sleep_debt") ? "default" : "outline"}
                      className="w-full py-3 h-auto hover:bg-accent/50"
                      onClick={() => {
                        form.setValue("signs_of_sleep_debt", false)
                        nextStep()
                      }}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            {currentStep === 'notes' && (
              <motion.div
                key="notes"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <div className="space-y-2 mt-6">
                  <h3 className="text-lg font-medium text-center">
                    Any notes about {selectedChild?.name || 'your baby\'s'} nap?
                  </h3>
                  <div className="max-w-xl mx-auto space-y-2">
                    <Textarea
                      placeholder="Add any notes about the nap..."
                      {...form.register("notes")}
                      className="min-h-[80px] max-h-[200px]"
                    />
                    <div className="text-xs text-muted-foreground">
                      Suggested topics:
                      <ul className="mt-1 space-y-1 list-disc list-inside">
                        <li>Sleep cues {selectedChild?.name || 'your baby'} showed</li>
                        <li>Any disruptions during the nap</li>
                        <li>{selectedChild?.name || 'Baby\'s'} mood before and after</li>
                        <li>Changes to normal routine</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
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
                      currentStepIndex === index ? 'bg-primary' : 'bg-muted'
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
                    "Save Nap"
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