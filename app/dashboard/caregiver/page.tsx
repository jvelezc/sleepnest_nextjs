"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Baby, Milk, PillBottle as BabyBottle, UtensilsCrossed, BedDouble } from "lucide-react"
import { format } from "date-fns"
import { ChildSelector } from "@/components/child-selector"
import { AddChildDialog } from "@/components/add-child-dialog"
import { useChildStore } from "@/lib/store/child"
import { FeedingTypeDialog } from "@/components/feeding-type-dialog"
import { NapDialog } from "@/components/nap-tracker/nap-dialog"
import { NapHistory } from "@/components/nap-tracker/nap-history"
import { BreastfeedingDialog } from "@/components/breastfeeding-dialog"
import { BottleFeedingDialog } from "@/components/bottle-feeding-dialog"
import { FormulaFeedingDialog } from "@/components/formula-feeding-dialog"
import { SolidsFeedingDialog } from "@/components/solids-feeding-dialog"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ActivityHistory } from "@/components/activity-history"
import { supabase } from "@/lib/supabase"
import { HighlightedText } from "@/components/ui/highlighted-text"
import { useCaregiverStore } from "@/lib/store/caregiver"

type Child = {
  id: string
  name: string
  date_of_birth: string
}

export default function CaregiverDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { caregiverId, setCaregiverId } = useCaregiverStore()
  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false)
  const [breastfeedingDialogOpen, setBreastfeedingDialogOpen] = useState(false)
  const [bottleFeedingDialogOpen, setBottleFeedingDialogOpen] = useState(false)
  const [formulaFeedingDialogOpen, setFormulaFeedingDialogOpen] = useState(false)
  const [solidsFeedingDialogOpen, setSolidsFeedingDialogOpen] = useState(false)
  const [napDialogOpen, setNapDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [children, setChildren] = useState<Child[]>([])
  const { selectedChild, setSelectedChild } = useChildStore()
  const [addChildOpen, setAddChildOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadChildren = async () => {
    if (!caregiverId) return

    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, date_of_birth')
        .eq('caregiver_id', caregiverId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      if (data && data.length > 0) {
        setChildren(data)
        setSelectedChild(data[0]) // Select first child by default
      }
    } catch (err) {
      console.error('Error loading children:', err)
    }
  }

  useEffect(() => {
    async function getCaregiverId() {
      if (!user || caregiverId) {
        setLoading(false)
        return
      }
      
      try {
        setError(null)
        console.log('Fetching caregiver ID for user:', user.id)

        const { data: caregiver, error: caregiverError } = await supabase
          .from('caregivers')
          .select('id')
          .eq('auth_user_id', user.id)
          .maybeSingle()

        if (caregiverError) throw caregiverError

        if (!caregiver) {
          console.log('Creating new caregiver record')
          const { data: newCaregiver, error: insertError } = await supabase
            .from('caregivers')
            .insert({
              auth_user_id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unnamed Caregiver',
              active: true
            })
            .select('id')
            .single()

          if (insertError) throw insertError
          if (!newCaregiver) throw new Error('Failed to create caregiver record')
          
          console.log('Created caregiver record:', newCaregiver.id)
          setCaregiverId(newCaregiver.id)
        } else {
          console.log('Found existing caregiver ID:', caregiver.id)
          setCaregiverId(caregiver.id)
        }

        setError(null)
      } catch (err) {
        console.error('Error getting caregiver ID:', err)
        if (retryCount < 3) {
          setTimeout(() => setRetryCount(c => c + 1), 1000)
        }
      } finally {
        setLoading(false)
      }
    }

    getCaregiverId()
  }, [user, caregiverId, retryCount, setCaregiverId])

  useEffect(() => { loadChildren() }, [caregiverId])

  const handleFeedingTypeSelect = (type: 'breastfeeding' | 'bottle' | 'formula' | 'solids') => {
    setFeedingDialogOpen(false)
    
    if (!selectedChild) {
      toast({
        variant: "destructive",
        title: "No Child Selected",
        description: "Please select a child first to track feeding."
      })
      return
    }

    if (type === 'breastfeeding') {
      setBreastfeedingDialogOpen(true)
    } else if (type === 'bottle') {
      setBottleFeedingDialogOpen(true)
    } else if (type === 'formula') {
      setFormulaFeedingDialogOpen(true)
    } else if (type === 'solids') {
      setSolidsFeedingDialogOpen(true)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-4 w-1/2 bg-muted rounded"></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (children.length === 0) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-lg border-2 border-dashed p-12 space-y-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Baby className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome!</h2>
              <p className="text-muted-foreground">
                To get started tracking your baby's activities, please add your child's information.
              </p>
            </div>
            <Button 
              onClick={() => setAddChildOpen(true)}
              disabled={!caregiverId}
            >
              Add Your First Child
            </Button>
          </div>
        </div>
        {caregiverId && (
          <AddChildDialog
            open={addChildOpen}
            onOpenChange={setAddChildOpen}
            caregiverId={caregiverId}
            onSuccess={() => loadChildren()}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {selectedChild ? (
                <>Track <HighlightedText>{selectedChild.name}'s</HighlightedText> Schedule</>
              ) : (
                'Track Your Baby\'s Schedule'
              )}
            </h1>
            <p className="text-muted-foreground">
              Record essential activities to understand your baby's patterns and support their healthy development.
            </p>
          </div>
          <ChildSelector
            children={children}
            caregiverId={caregiverId!}
            onChildAdded={loadChildren}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Nighttime Sleep Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Moon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Nighttime Sleep</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Quality nighttime sleep is crucial for your baby's growth, mood, and cognitive development. Track sleep patterns to establish healthy routines.
              </p>
              <Button variant="outline" className="w-full">
                Record sleep →
              </Button>
            </CardContent>
          </Card>

          {/* Daytime Naps Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BedDouble className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Daytime Naps</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Regular naps prevent overtiredness and support learning and development. Monitor nap schedules to ensure optimal rest throughout the day.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (!selectedChild) {
                    toast({
                      variant: "destructive",
                      title: "No Child Selected",
                      description: "Please select a child first to track naps."
                    })
                    return
                  }
                  setNapDialogOpen(true)
                }}
              >
                Log nap →
              </Button>
            </CardContent>
          </Card>

          {/* Feeding Time Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Baby className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Feeding Time</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Proper nutrition is vital for your baby's growth and development. Track feeding patterns to ensure they're getting the nourishment they need.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (!selectedChild) {
                    toast({
                      variant: "destructive",
                      title: "No Child Selected",
                      description: "Please select a child first to track feeding."
                    })
                    return
                  }
                  setFeedingDialogOpen(true)
                }}
              >
                Track feeding →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity History */}
        <ActivityHistory />
      </div>

      <FeedingTypeDialog 
        open={feedingDialogOpen}
        onOpenChange={setFeedingDialogOpen}
        onSelectType={handleFeedingTypeSelect}
      />

      <BreastfeedingDialog
        open={breastfeedingDialogOpen}
        onOpenChange={setBreastfeedingDialogOpen}
      />

      <BottleFeedingDialog
        open={bottleFeedingDialogOpen}
        onOpenChange={setBottleFeedingDialogOpen}
      />

      <FormulaFeedingDialog
        open={formulaFeedingDialogOpen}
        onOpenChange={setFormulaFeedingDialogOpen}
      />

      <SolidsFeedingDialog
        open={solidsFeedingDialogOpen}
        onOpenChange={setSolidsFeedingDialogOpen}
      />
      
      <NapDialog
        open={napDialogOpen}
        onOpenChange={setNapDialogOpen}
      />
    </div>
  )
}