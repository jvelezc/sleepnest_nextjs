"use client"

"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Moon, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useChildStore } from "@/lib/store/child"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

type NapSession = {
  nap_id: string
  start_time: string
  end_time: string
  total_duration: number
  location_description: string
  environment_description: string
  onset_method_description: string
  sleep_latency: number
  restfulness_description: string
  signs_of_sleep_debt: boolean
  notes: string | null
}

export function NapHistory() {
  const { selectedChild } = useChildStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<NapSession[]>([])
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadNaps = async () => {
    if (!selectedChild) return

    try {
      setLoading(true)
      const { data, error } = await supabase.rpc(
        'get_child_nap_sessions',
        { 
          p_child_id: selectedChild.id,
          p_limit: 10
        }
      )

      if (error) throw error
      setSessions(data || [])
    } catch (err) {
      console.error('Error loading nap sessions:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load nap history"
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh when child changes or refresh is triggered
  useEffect(() => {
    loadNaps()
  }, [selectedChild, refreshTrigger])

  // Expose refresh function
  useEffect(() => {
    const refreshHistory = () => {
      setRefreshTrigger(prev => prev + 1)
    }
    window.refreshNapHistory = refreshHistory
    return () => {
      delete window.refreshNapHistory
    }
  }, [])

  const handleDelete = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('nap_sessions')
        .delete()
        .eq('id', sessionId) // Keep this as 'id' since it's the column name in the table

      if (error) throw error

      setSessions(prev => prev.filter(s => s.nap_id !== sessionId))
      toast({
        title: "Success",
        description: "Nap record deleted successfully"
      })
    } catch (err) {
      console.error('Error deleting nap session:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete nap record"
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
          <CardTitle>Recent Naps</CardTitle>
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Naps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.nap_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {format(new Date(session.start_time), 'MMM d, h:mm a')}
                      {" - "}
                      {format(new Date(session.end_time), 'h:mm a')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.location_description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {session.total_duration} min
                  </Badge>
                  <Badge>
                    {session.restfulness_description}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setSessionToDelete(session.nap_id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No nap sessions recorded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Nap Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this nap record? This action cannot be undone.
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