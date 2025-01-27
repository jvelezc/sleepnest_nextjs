"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { supabase } from '@/lib/supabase'
import { isValidSession } from '@/lib/supabase'
import { Session, User, AuthError, AuthChangeEvent } from '@supabase/supabase-js'

type AuthResponse = {
  data: {
    session: Session | null
    user?: User | null
  }
  error: AuthError | null
}

export function useAuth() {
  const { user, session, role, loading, error, signOut, clearError, refreshAuth } = useAuthStore()

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: AuthResponse) => {
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
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
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

  const handleSignIn = async (email: string, password: string, role?: 'caregiver' | 'specialist') => {
    try {
      useAuthStore.setState({ loading: true, error: null });

      // First check if user exists
      const { data: userExists, error: lookupError } = await supabase.rpc(
        'check_user_exists',
        { p_email: email }
      );

      if (lookupError) throw lookupError;
      if (!userExists) {
        throw new Error('No account found with this email');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Get user role from metadata or parameter
      const userRole = data.user?.user_metadata?.role || role;

      // Ensure profile record exists based on role
      if (userRole === 'specialist' || userRole === 'caregiver') {
        const { error: profileError } = await supabase.rpc(
          userRole === 'specialist' ? 'ensure_specialist_record_exists' : 'ensure_caregiver_exists',
          { p_user_id: data.user.id }
        );
        if (profileError) throw profileError;
      }

      // Add retry logic for profile creation
      let retries = 3;
      while (retries > 0) {
        try {
          const { data: profile } = await supabase
            .from(userRole === 'specialist' ? 'specialists' : 'caregivers')
            .select('id')
            .eq('auth_user_id', data.user.id)
            .single();

          if (profile) break;
          
          // If no profile found, wait briefly and retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries--;
        } catch (err) {
          console.error('Profile check failed, retrying...', err);
          retries--;
          if (retries === 0) throw err;
        }
      }
      useAuthStore.setState({ 
        user: data.user,
        session: data.session,
        role: userRole,
        loading: false,
        error: null 
      });
    } catch (err) {
      useAuthStore.setState({
        error: err instanceof Error ? err.message : 'An unknown error occurred',
        loading: false,
        user: null,
        session: null,
        role: null,
      });
      throw err;
    }
  }

  return {
    user,
    session,
    loading,
    role,
    error,
    signIn: handleSignIn,
    signOut,
    clearError,
    refreshAuth
  }
}