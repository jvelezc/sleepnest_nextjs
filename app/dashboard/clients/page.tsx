"use client"

import { useEffect, useState } from "react"
import { Users, Mail, Calendar, Clock, MessageCircle, Search, Filter, Archive } from "lucide-react"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InviteCaregiverDialog } from "@/components/invite-caregiver-dialog"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import { Button } from "@/components/ui/button" 
import { ChatWindow } from "@/components/chat-window"
import { useToast } from "@/hooks/use-toast"

type Caregiver = {
  caregiver_id: string
  user_id: string
  caregiver_name: string
  caregiver_email: string
  last_activity: string
  status: string
  archived: boolean
}

type ChatSession = {
  specialistId: string
  caregiverId: string
  caregiverName: string
} | null

export default function ClientsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [filteredCaregivers, setFilteredCaregivers] = useState<Caregiver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [specialistId, setSpecialistId] = useState<string | null>(null)
  const [chatSession, setChatSession] = useState<ChatSession>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [page, setPage] = useState(1)
  const [showArchived, setShowArchived] = useState(false)
  const [includeArchived, setIncludeArchived] = useState(false)
  const itemsPerPage = 9

  useEffect(() => {
    async function getSpecialistId() {
      if (!user) {
        console.log('No user found')
        setLoading(false)
        return
      }
      
      try {
        setError(null)
        console.log('Fetching specialist ID for user:', user.id)
        const { data, error } = await supabase
          .from('specialists')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (error) throw error
        if (data) {
          console.log('Found specialist ID:', data.id)
          setSpecialistId(data.id)
        }
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
        
        const { data, error } = await supabase.rpc('get_specialist_caregivers_with_archive', {
          p_specialist_id: specialistId,
          p_sort_field: 'last_activity',
          p_sort_order: 'desc',
          p_limit: 50,
          p_offset: 0,
          p_include_archived: includeArchived,
          p_archived_only: showArchived
        })

        if (error) throw error
        console.log('Loaded caregivers:', data?.length || 0)
        setCaregivers(data || [])
        setFilteredCaregivers(data || [])
      } catch (err) {
        console.error('Error loading caregivers:', err)
        setError('Failed to load caregivers')
      } finally {
        setLoading(false)
      }
    }

    loadCaregivers()
  }, [specialistId, showArchived, includeArchived])

  const handleArchiveToggle = async (caregiverId: string, currentArchived: boolean) => {
    try {
      const { error } = await supabase.rpc('toggle_caregiver_archive', {
        p_specialist_id: specialistId,
        p_caregiver_id: caregiverId
      })

      if (error) throw error

      // Update local state
      setCaregivers(prev => prev.map(c => 
        c.caregiver_id === caregiverId 
          ? {...c, archived: !currentArchived}
          : c
      ))
      setFilteredCaregivers(prev => prev.map(c => 
        c.caregiver_id === caregiverId 
          ? {...c, archived: !currentArchived}
          : c
      ))

      toast({
        title: currentArchived ? "Caregiver Unarchived" : "Caregiver Archived",
        description: `Successfully ${currentArchived ? "unarchived" : "archived"} caregiver.`
      })
    } catch (err) {
      console.error('Error toggling archive status:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update archive status"
      })
    }
  }

  useEffect(() => {
    let filtered = [...caregivers]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        c => 
          c.caregiver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.caregiver_email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.caregiver_name.localeCompare(b.caregiver_name)
        case "recent":
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
        case "status":
          return (b.status === "active" ? 1 : -1) - (a.status === "active" ? 1 : -1)
        default:
          return 0
      }
    })

    setFilteredCaregivers(filtered)
  }, [caregivers, searchQuery, sortBy])

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

  const activeClients = filteredCaregivers.filter(c => c.status === 'active')
  const inactiveClients = filteredCaregivers.filter(c => c.status !== 'active')

  const totalArchived = filteredCaregivers.filter(c => c.archived).length

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground">Manage and monitor your client relationships</p>
        </div>
        <InviteCaregiverDialog />
      </div>

      <div className="flex flex-col space-y-6">
        {/* Search and Filter Bar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search caregivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full transition-all duration-200 ease-in-out"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                  id="archived-mode"
                  className="transition-opacity duration-200"
                />
                <label
                  htmlFor="archived-mode"
                  className="text-sm text-muted-foreground cursor-pointer transition-colors duration-200 hover:text-foreground"
                >
                  Show Archived
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={includeArchived}
                  onCheckedChange={setIncludeArchived}
                  id="include-archived"
                  className="transition-opacity duration-200"
                />
                <label
                  htmlFor="include-archived"
                  className="text-sm text-muted-foreground cursor-pointer transition-colors duration-200 hover:text-foreground"
                >
                  Include Archived in Search
                </label>
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] transition-all duration-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active Clients ({activeClients.length})
            </TabsTrigger>
            <TabsTrigger value="archived" disabled={!showArchived}>
              Archived ({totalArchived})
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
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleArchiveToggle(caregiver.caregiver_id, caregiver.archived)}
                        >
                          {caregiver.archived ? 'Unarchive' : 'Archive'}
                        </Button>
                        <Button
                          variant="secondary"
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCaregivers.filter(c => c.archived).map((caregiver) => (
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
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleArchiveToggle(caregiver.caregiver_id, caregiver.archived)}
                        >
                          Unarchive
                        </Button>
                        <Button
                          variant="secondary"
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
                      {caregiver.archived && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Archive className="h-4 w-4" />
                          <span>Archived</span>
                        </div>
                      )}
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleArchiveToggle(caregiver.caregiver_id, caregiver.archived)}
                        >
                          {caregiver.archived ? 'Unarchive' : 'Archive'}
                        </Button>
                        <Button
                          variant="secondary"
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {chatSession && (
            <ChatWindow
              specialistId={chatSession.specialistId}
              caregiverId={chatSession.caregiverId}
              caregiverName={chatSession.caregiverName}
              onClose={() => setChatSession(null)}
            />
          )}
        </Tabs>
      </div>
    </div>
  )
}