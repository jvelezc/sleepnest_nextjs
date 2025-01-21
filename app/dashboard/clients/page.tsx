"use client"

import { useEffect, useState } from "react"
import { Users, Mail, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { InviteCaregiverDialog } from "@/components/invite-caregiver-dialog"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Caregiver = {
  caregiver_id: string
  user_id: string
  caregiver_name: string
  caregiver_email: string
  last_activity: string
  status: string
}

export default function ClientsPage() {
  const { user } = useAuth()
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [specialistId, setSpecialistId] = useState<string | null>(null)

  useEffect(() => {
    async function getSpecialistId() {
      if (!user) {
        setLoading(false)
        return
      }
      
      try {
        setError(null)
        const { data, error } = await supabase
          .from('specialists')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (error) throw error
        if (data) setSpecialistId(data.id)
      } catch (err) {
        console.error('Error fetching specialist ID:', err)
        setError('Failed to fetch specialist data')
      } finally {
        setLoading(false)
      }
    }

    getSpecialistId()
  }, [user])

  useEffect(() => {
    async function loadCaregivers() {
      if (!specialistId) return
      
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase.rpc('get_specialist_caregivers', {
          p_specialist_id: specialistId,
          p_sort_field: 'last_activity',
          p_sort_order: 'desc',
          p_limit: 50,
          p_offset: 0
        })

        if (error) throw error
        setCaregivers(data || [])
      } catch (err) {
        console.error('Error loading caregivers:', err)
        setError('Failed to load caregivers')
      } finally {
        setLoading(false)
      }
    }

    loadCaregivers()
  }, [specialistId])

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground">Manage and monitor your client relationships</p>
          </div>
          <InviteCaregiverDialog />
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <h3 className="text-lg font-medium text-destructive">Error Loading Clients</h3>
          <p className="text-sm text-destructive/80 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (caregivers.length === 0) {
    return (
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground">Manage and monitor your client relationships</p>
          </div>
          <InviteCaregiverDialog />
        </div>

        <div className="space-y-6">
          {/* Empty State */}
          <div className="rounded-lg border bg-card p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No Clients Yet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Get started by inviting your first client to join your practice.
              </p>
              <InviteCaregiverDialog />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activeClients = caregivers.filter(c => c.status === 'active')
  const inactiveClients = caregivers.filter(c => c.status !== 'active')

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage and monitor your client relationships</p>
        </div>
        <InviteCaregiverDialog />
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active Clients ({activeClients.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({inactiveClients.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeClients.map((caregiver) => (
              <Card key={caregiver.caregiver_id}>
                <CardHeader>
                  <CardTitle>{caregiver.caregiver_name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{caregiver.caregiver_email}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {format(new Date(caregiver.last_activity), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Last active {format(new Date(caregiver.last_activity), 'h:mm a')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inactiveClients.map((caregiver) => (
              <Card key={caregiver.caregiver_id}>
                <CardHeader>
                  <CardTitle>{caregiver.caregiver_name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{caregiver.caregiver_email}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {format(new Date(caregiver.last_activity), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Last active {format(new Date(caregiver.last_activity), 'h:mm a')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}