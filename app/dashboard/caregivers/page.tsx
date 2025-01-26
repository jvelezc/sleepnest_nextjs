"use client"

import { useEffect, useState } from "react"
import { UserCircle, Mail, Calendar, Clock, MessageCircle, Search, Briefcase } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChatWindow } from "@/components/chat-window"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Specialist = {
  specialist_id: string
  name: string
  email: string
  business_name: string
  verification_status: string
  last_activity: string
}

type ChatSession = {
  specialistId: string
  caregiverId: string
  specialistName: string
} | null

export default function CaregiversPage() {
  const { user } = useAuth()
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [caregiverId, setCaregiverId] = useState<string | null>(null)
  const [chatSession, setChatSession] = useState<ChatSession>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [page, setPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    async function getCaregiverId() {
      if (!user) {
        setLoading(false)
        return
      }
      
      try {
        setError(null)
        const { data, error } = await supabase
          .from('caregivers')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (error) throw error
        if (data) setCaregiverId(data.id)
      } catch (err) {
        console.error('Error fetching caregiver ID:', err)
        setError('Failed to fetch caregiver data')
      }
    }

    getCaregiverId()
  }, [user])

  useEffect(() => {
    async function loadSpecialists() {
      if (!caregiverId) return
      
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('specialist_caregiver')
          .select(`
            specialist:specialists (
              id,
              name,
              email,
              business_name,
              verification_status,
              last_sign_in_at
            )
          `)
          .eq('caregiver_id', caregiverId)

        if (error) throw error
        
        if (!data) return

        const formattedData = data.map(({ specialist }) => ({
          specialist_id: specialist.id,
          name: specialist.name,
          email: specialist.email,
          business_name: specialist.business_name,
          verification_status: specialist.verification_status,
          last_activity: specialist.last_sign_in_at
        }))

        setSpecialists(formattedData)
        setFilteredSpecialists(formattedData)
      } catch (err) {
        console.error('Error loading specialists:', err)
        setError('Failed to load specialists')
      } finally {
        setLoading(false)
      }
    }

    loadSpecialists()
  }, [caregiverId])

  useEffect(() => {
    let filtered = [...specialists]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        s => 
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.business_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "recent":
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
        case "business":
          return a.business_name.localeCompare(b.business_name)
        default:
          return 0
      }
    })

    setFilteredSpecialists(filtered)
  }, [specialists, searchQuery, sortBy])

  const paginatedSpecialists = filteredSpecialists.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const totalPages = Math.ceil(filteredSpecialists.length / itemsPerPage)

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
              placeholder="Search specialists..."
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
              <SelectItem value="business">Sort by Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Specialists Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedSpecialists.map((specialist) => (
            <Card key={specialist.specialist_id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{specialist.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Briefcase className="h-3 w-3" />
                        <span className="text-xs">{specialist.business_name}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={specialist.verification_status === 'verified' ? 'default' : 'secondary'}>
                    {specialist.verification_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{specialist.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last active {format(new Date(specialist.last_activity), 'h:mm a')}</span>
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
                        if (caregiverId) {
                          setChatSession({
                            specialistId: specialist.specialist_id,
                            caregiverId,
                            specialistName: specialist.name
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
          caregiverName={chatSession.specialistName}
          onClose={() => setChatSession(null)}
        />
      )}
    </div>
  )
}