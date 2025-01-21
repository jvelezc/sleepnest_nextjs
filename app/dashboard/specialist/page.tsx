"use client"

import { useEffect, useState } from "react"
import { Users, Mail, Calendar, Clock, MessageCircle, Search, Filter, UserCircle } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "@/components/chat-window"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function SpecialistDashboardPage() {
  const { user } = useAuth()
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [filteredCaregivers, setFilteredCaregivers] = useState<Caregiver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [specialistId, setSpecialistId] = useState<string | null>(null)
  const [chatSession, setChatSession] = useState<ChatSession>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [page, setPage] = useState(1)
  const itemsPerPage = 9

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

  const paginatedCaregivers = filteredCaregivers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const totalPages = Math.ceil(filteredCaregivers.length / itemsPerPage)

  if (loading) {
    return (
      <div className="flex-1 p-8">
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

  return (
    <div className="flex-1 p-8">
      <div className="flex flex-col space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search caregivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="recent">Sort by Recent</SelectItem>
              <SelectItem value="status">Sort by Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Caregiver Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedCaregivers.map((caregiver) => (
            <Card key={caregiver.caregiver_id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{caregiver.caregiver_name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{caregiver.caregiver_email}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={caregiver.status === 'active' ? 'default' : 'secondary'}>
                    {caregiver.status}
                  </Badge>
                </div>
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
                      onClick={() => {
                        // Handle view profile
                      }}
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
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