import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
import { debug } from '@/lib/utils'

type BreastfeedingDetails = {
  side: "Left" | "Right"
  duration: number // Duration in minutes, defaults to 0
  order: number
}

type FeedingSession = Database['public']['Tables']['feeding_sessions']['Row'] & {
  breastfeeding_sessions?: {
    left_duration: number | null
    right_duration: number | null
    feeding_order: string[]
    latch_quality: string | null
  }[]
}

export async function saveBreastfeedingSession({
  caregiverId: authUserId,
  childId,
  startTime = new Date(),
  latchQuality,
  notes,
  feedings
}: {
  caregiverId: string // This is actually the auth user ID
  childId: string
  startTime?: Date
  latchQuality?: string | null
  notes?: string
  feedings: BreastfeedingDetails[]
}) {
  try {
    debug.info('Starting to save breastfeeding session', {
      authUserId,
      childId, 
      feedings
    })

    // Get the actual caregiver ID from the auth user ID
    const { data: caregiver, error: caregiverError } = await supabase
      .from('caregivers')
      .select('id')
      .eq('auth_user_id', authUserId)
      .single()

    if (caregiverError) throw caregiverError
    if (!caregiver) throw new Error('Caregiver not found')

    // Calculate total duration and end time
    const totalDuration = getTotalDuration(feedings)
    const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000)

    debug.info('Creating feeding session record')
    const { data: session, error: sessionError } = await supabase
      .from('feeding_sessions')
      .insert([{
        caregiver_id: caregiver.id,
        child_id: childId,
        type: 'breastfeeding',
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: notes || null
      }])
      .select()
      .single()

    if (sessionError) throw sessionError
    if (!session) throw new Error('Failed to create feeding session')

    debug.info('Created feeding session', { sessionId: session.id })

    // Get durations for each side
    const leftFeeding = feedings.find(f => f.side === "Left")
    const rightFeeding = feedings.find(f => f.side === "Right")

    // At least one side must have a duration
    if (!leftFeeding && !rightFeeding) {
      throw new Error('At least one feeding side must be specified')
    }

    // Insert breastfeeding details
    const { error: detailsError } = await supabase
      .from('breastfeeding_sessions')
      .insert([{  // Wrap in array
        session_id: session.id,
        left_duration: leftFeeding?.duration || 0,
        right_duration: rightFeeding?.duration || 0,
        feeding_order: feedings.map(f => f.side),
        latch_quality: latchQuality
      }])

    if (detailsError) throw detailsError
    debug.info('Added breastfeeding details successfully')

    return session.id
  } catch (error) {
    debug.error('Error saving breastfeeding session:', error)
    throw error
  }
}

function getTotalDuration(feedings: BreastfeedingDetails[]) {
  return feedings.reduce((total, feeding) => total + (feeding.duration ?? 0), 0)
}

export async function getBreastfeedingSession(sessionId: string) {
  const { data: session, error: sessionError } = await supabase
    .from('feeding_sessions')
    .select(`
      *,
      breastfeeding_sessions (
        left_duration,
        right_duration,
        feeding_order,
        latch_quality
      )
    `)
    .eq('id', sessionId)
    .single()

  if (sessionError) throw sessionError
  return session
}

export async function getRecentFeedings(caregiverId: string, childId: string, limit = 10) {
  const { data: sessions, error } = await supabase
    .from('feeding_sessions')
    .select(`
      *,
      breastfeeding_sessions (
        left_duration,
        right_duration,
        feeding_order,
        latch_quality
      )
    `)
    .eq('caregiver_id', caregiverId)
    .eq('child_id', childId)
    .order('start_time', { ascending: false })
    .limit(limit)

  if (error) throw error
  return sessions
}

export async function getDailyFeedingSummary(caregiverId: string, childId: string, date: Date) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const { data: sessions, error } = await supabase
    .from('feeding_sessions')
    .select(`
      *,
      breastfeeding_sessions (
        left_duration,
        right_duration,
        feeding_order,
        latch_quality
      )
    `)
    .eq('caregiver_id', caregiverId)
    .eq('child_id', childId)
    .gte('start_time', startOfDay.toISOString())
    .lte('start_time', endOfDay.toISOString())
    .order('start_time', { ascending: true })

  if (error) throw error

  // Calculate summary metrics
  const summary = {
    totalSessions: sessions?.length || 0,
    totalBreastfeedingTime: 0,
    leftBreastUsage: 0,
    rightBreastUsage: 0,
    sessions: sessions || []
  }

  sessions?.forEach((session: FeedingSession) => {
    if (session.type === 'breastfeeding' && session.breastfeeding_sessions?.[0]) {
      const details = session.breastfeeding_sessions[0]
      if (details.left_duration) {
        summary.totalBreastfeedingTime += details.left_duration
        summary.leftBreastUsage++
      }
      if (details.right_duration) {
        summary.totalBreastfeedingTime += details.right_duration
        summary.rightBreastUsage++
      }
    }
  })

  return summary
}