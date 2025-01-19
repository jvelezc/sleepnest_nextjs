"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const { user, session, loading, error, signIn, signOut, clearError } = useAuthStore()

  useEffect(() => {
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      useAuthStore.setState({ 
        user: session?.user ?? null,
        session,
        loading: false
      })
    })

    // Cleanup subscription on unmount
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