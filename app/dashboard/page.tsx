"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, ChartLine as ChartLineUp, Calendar, Clock, MessageCircle, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { InviteCaregiverDialog } from "@/components/invite-caregiver-dialog"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "@/components/chat-window"

type Caregiver = {
  caregiver_id: string
  user_id: string
  caregiver_name: string
  caregiver_email: string
  last_activity: string
  status: string
}

type ChatSession = {
  specialistId: string
  caregiverId: string
  caregiverName: string
} | null

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [specialistId, setSpecialistId] = useState<string | null>(null)
  const [chatSession, setChatSession] = useState<ChatSession>(null)

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
          p_limit: 9,
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
            <h1 className="text-3xl font-bold text-foreground">Sleep Specialist Dashboard</h1>
            <p className="text-muted-foreground">Manage your clients and track their progress</p>
          </div>
          <InviteCaregiverDialog />
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Your Caregivers</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
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

  if (caregivers.length === 0) {
    return (
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sleep Specialist Dashboard</h1>
            <p className="text-muted-foreground">Manage your clients and track their progress</p>
          </div>
          <InviteCaregiverDialog />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Your Caregivers</h2>
          
          {/* Empty State */}
          <div className="rounded-lg border bg-card p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Welcome to Your Dashboard</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                You haven't added any caregivers yet. Start growing your
                practice by inviting your first caregiver.
              </p>
              <InviteCaregiverDialog />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Sleep Specialist Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your practice</p>
        </div>
        <InviteCaregiverDialog />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caregivers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active clients in your practice
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <ChartLineUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {caregivers.filter(c => {
                const lastActive = new Date(c.last_activity);
                const now = new Date();
                return now.getTime() - lastActive.getTime() < 24 * 60 * 60 * 1000;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Clients active in last 24h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {caregivers.filter(c => {
                const joinDate = new Date(c.last_activity);
                const now = new Date();
                return now.getTime() - joinDate.getTime() < 7 * 24 * 60 * 60 * 1000;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              New clients this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <Button variant="outline" onClick={() => router.push('/dashboard/clients')}>
            View All Clients
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {caregivers
                .sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime())
                .slice(0, 5)
                .map((caregiver) => (
                  <div key={caregiver.caregiver_id} className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{caregiver.caregiver_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Last active {format(new Date(caregiver.last_activity), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (specialistId) {
                          setChatSession({
                            specialistId,
                            caregiverId: caregiver.caregiver_id,
                            caregiverName: caregiver.caregiver_name
                          })
                        }
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {chatSession && (
        <ChatWindow
          specialistId={chatSession.specialistId}
          caregiverId={chatSession.caregiverId}
          caregiverName={chatSession.caregiverName}
          onClose={() => setChatSession(null)}
        />
      )}
    </div>
  )
}