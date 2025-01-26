"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { supabase } from '@/lib/supabase'
import { isValidSession } from '@/lib/supabase'

export function useAuth() {
  const { user, session, role, loading, error, signIn, signOut, clearError, refreshAuth } = useAuthStore() 

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const userRole = session?.user?.user_metadata?.role
      useAuthStore.setState({ 
        user: session?.user ?? null,
        session,
        role: userRole as 'specialist' | 'caregiver' | null,
        loading: false 
      })
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const userRole = session?.user?.user_metadata?.role
      useAuthStore.setState({ 
        user: session?.user ?? null,
        session,
        role: userRole as 'specialist' | 'caregiver' | null,
        loading: false,
        error: null
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  // Refresh session periodically
  useEffect(() => {
    if (!session) return
    
    const checkSession = async () => {
      const isValid = await isValidSession()
      if (!isValid) {
        await refreshAuth()
      }
    }
    
    // Check session every minute
    const interval = setInterval(checkSession, 60 * 1000)
    
    return () => clearInterval(interval)
  }, [session, refreshAuth])

  return {
    user,
    session,
    loading,
    role,
    error,
    signIn,
    signOut,
    clearError,
    refreshAuth
  }
}