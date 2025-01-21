import { create } from 'zustand'
import { supabase } from '../supabase'
import { User, Session } from '@supabase/supabase-js'
import { refreshSession } from '../supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
  refreshAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null })
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      
      set({ 
        user: data.user,
        session: data.session,
        loading: false,
        error: null 
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unknown error occurred',
        loading: false,
        user: null,
        session: null,
      })
      throw err
    }
  },

  refreshAuth: async () => {
    try {
      const session = await refreshSession()
      if (session) {
        set({ 
          user: session.user,
          session,
          loading: false,
          error: null 
        })
      }
    } catch (err) {
      set({ 
        error: 'Failed to refresh session',
        loading: false 
      })
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null })
      await supabase.auth.signOut()
      set({ 
        user: null,
        session: null,
        loading: false,
        error: null 
      })
    } catch (err) {
      set({ 
        error: 'Failed to sign out',
        loading: false 
      })
      throw err
    }
  },

  clearError: () => set({ error: null }),
}))