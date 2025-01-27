"use client"

import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import { Baby, Milk, PillBottle as BabyBottle, UtensilsCrossed, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { supabase } from "@/lib/supabase"
import { useChildStore } from "@/lib/store/child"
import { useToast } from "@/hooks/use-toast"

type FeedingSession = {
  id: string
  type: 'breastfeeding' | 'bottle' | 'formula' | 'solids'
  start_time: string
  end_time: string | null
  notes: string | null
  caregiver_id: string
  child_id: string
  created_at: string | null
  updated_at: string | null
  breastfeeding_sessions?: {
    left_duration: number | null
    right_duration: number | null
    feeding_order: string[]
  }[]
  bottle_sessions?: {
    amount_ml: number
    amount_oz: number | null
    milk_type: string
    warmed: boolean | null
  }[]
  solids_sessions?: {
    foods: string[]
    amount_eaten: string
    reaction: string
  }[]
}

export function FeedingHistory() {
  const { selectedChild } = useChildStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<FeedingSession[]>([])
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadFeedings = useCallback(async () => {
    if (!selectedChild) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('feeding_sessions')
        .select(`
          *,
          breastfeeding_sessions (
            left_duration,
            right_duration,
            feeding_order
          ),
          bottle_sessions (
            amount_ml,
            amount_oz,
            milk_type,
            warmed
          ),
          solids_sessions (
            foods,
            amount_eaten,
            reaction
          )
        `)
        .eq('child_id', selectedChild.id)
        .order('start_time', { ascending: false })
        .limit(10)

      if (error) throw error

      // Type assertion to ensure data matches our type
      const typedData = (data || []) as FeedingSession[]
      setSessions(typedData)
    } catch (err) {
      console.error('Error loading feeding sessions:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load feeding history"
      })
    } finally {
      setLoading(false)
    }
  }, [selectedChild, toast])

  // Refresh when child changes or refresh is triggered
  useEffect(() => {
    loadFeedings()
  }, [selectedChild, refreshTrigger, loadFeedings])

  // Expose refresh function
  useEffect(() => {
    const refreshHistory = () => {
      setRefreshTrigger(prev => prev + 1)
    }
    window.refreshFeedingHistory = refreshHistory
    return () => {
      delete window.refreshFeedingHistory
    }
  }, [])

  const handleDelete = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('feeding_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      setSessions(prev => prev.filter(s => s.id !== sessionId))
      toast({
        title: "Success",
        description: "Feeding record deleted successfully"
      })
    } catch (err) {
      console.error('Error deleting feeding session:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete feeding record"
      })
    } finally {
      setSessionToDelete(null)
    }
  }

  if (!selectedChild) return null

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No feeding sessions recorded yet
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {session.type === 'breastfeeding' && <Baby className="h-5 w-5 text-primary" />}
                    {session.type === 'bottle' && <Milk className="h-5 w-5 text-primary" />}
                    {session.type === 'formula' && <BabyBottle className="h-5 w-5 text-primary" />}
                    {session.type === 'solids' && <UtensilsCrossed className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <div className="font-medium capitalize">
                      {session.type === 'breastfeeding' ? 'Breastfeeding' : session.type}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(session.start_time), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.type === 'breastfeeding' && session.breastfeeding_sessions?.[0] && (
                    <>
                      <Badge variant="outline">
                        L: {session.breastfeeding_sessions[0].left_duration || 0}min
                      </Badge>
                      <Badge variant="outline">
                        R: {session.breastfeeding_sessions[0].right_duration || 0}min
                      </Badge>
                      <Badge>
                        {(session.breastfeeding_sessions[0].left_duration || 0) + 
                         (session.breastfeeding_sessions[0].right_duration || 0)}min total
                      </Badge>
                    </>
                  )}
                  {session.type === 'bottle' && session.bottle_sessions?.[0] && (
                    <>
                      <Badge variant="outline">
                        {session.bottle_sessions[0].amount_ml}mL
                      </Badge>
                      {session.bottle_sessions[0].amount_oz && (
                        <Badge variant="outline">
                          {session.bottle_sessions[0].amount_oz.toFixed(1)}oz
                        </Badge>
                      )}
                      <Badge>
                        {session.bottle_sessions[0].milk_type === 'expressed' ? 'Expressed' : 'Donor'} Milk
                      </Badge>
                      {session.bottle_sessions[0].warmed && (
                        <Badge variant="secondary">Warmed</Badge>
                      )}
                    </>
                  )}
                  {session.type === 'solids' && session.solids_sessions?.[0] && (
                    <>
                      <Badge variant="outline">
                        {session.solids_sessions[0].foods.length} food{session.solids_sessions[0].foods.length !== 1 ? 's' : ''}
                      </Badge>
                      <Badge>
                        {session.solids_sessions[0].amount_eaten}
                      </Badge>
                      <Badge variant={
                        session.solids_sessions[0].reaction === 'enjoyed' ? 'default' :
                        session.solids_sessions[0].reaction === 'allergic' ? 'destructive' :
                        'secondary'
                      }>
                        {session.solids_sessions[0].reaction}
                      </Badge>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setSessionToDelete(session.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feeding Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feeding record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sessionToDelete && handleDelete(sessionToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}