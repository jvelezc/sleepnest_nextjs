"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const { user, session, loading, error, signIn, signOut, clearError } = useAuthStore()

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      useAuthStore.setState({ 
        user: session?.user ?? null,
        session,
        loading: false 
      })
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      useAuthStore.setState({ 
        user: session?.user ?? null,
        session,
        loading: false,
        error: null
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signOut,
    clearError,
  }
}