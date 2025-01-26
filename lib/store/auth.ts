import { create } from 'zustand'
import { supabase } from '../supabase'
import { User, Session } from '@supabase/supabase-js'
import { refreshSession } from '../supabase'

interface AuthState {
  user: User | null
  session: Session | null
  role: 'specialist' | 'caregiver' | null
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
  role: null,
  loading: false,
  error: null,

  signIn: async (email, password, role?: 'specialist' | 'caregiver') => {
    try {
      set({ loading: true, error: null })
      
      // First check if user exists
      const { data: userExists, error: lookupError } = await supabase.rpc(
        'check_user_exists',
        { p_email: email }
      )

      if (lookupError) throw lookupError
      if (!userExists) {
        throw new Error('No account found with this email')
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) throw signInError
      
      // Get user role from metadata or parameter
      const userRole = data.user?.user_metadata?.role || role

      // Ensure specialist record exists if user is a specialist
      if (userRole === 'specialist') {
        const { error: specialistError } = await supabase.rpc(
          'ensure_specialist_record_exists',
          { p_user_id: data.user.id }
        )
        if (specialistError) throw specialistError
      }

      set({ 
        user: data.user,
        session: data.session,
        role: userRole,
        loading: false,
        error: null 
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unknown error occurred',
        loading: false,
        user: null,
        session: null,
        role: null,
      })
      throw err
    }
  },

  refreshAuth: async () => {
    try {
      const session = await refreshSession()
      if (session) {
        const role = session.user?.user_metadata?.role as 'specialist' | 'caregiver' | null
        set({ 
          user: session.user,
          session,
          role,
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
        role: null,
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