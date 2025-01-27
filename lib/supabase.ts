import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const RETRY_COUNT = 3
const RETRY_DELAY = 1000

const STORAGE_KEY = 'sb-auth-token'

// Add this type at the top with other imports
type FetchParameters = Parameters<typeof fetch>

// Create a single Supabase client instance
const createSupabaseClient = (retryAttempt = 0): SupabaseClient<Database> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  const client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: typeof window !== 'undefined',
        detectSessionInUrl: true,
        storage: {
          getItem: (key) => {
            try {
              const storedSession = typeof window !== 'undefined' 
                ? window.localStorage.getItem(key)
                : null
              return storedSession
            } catch (error) {
              console.error('Error reading session:', error)
              return null
            }
          },
          setItem: (key, value) => {
            try {
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, value)
              }
            } catch (error) {
              console.error('Error storing session:', error)
            }
          },
          removeItem: (key) => {
            try {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key)
              }
            } catch (error) {
              console.error('Error removing session:', error)
            }
          }
        }
      },
      db: {
        schema: 'public'
      },
      global: {
        fetch: async (...args: FetchParameters) => {
          try {
            const response = await fetch(...args)
            return response
          } catch (error) {
            if (retryAttempt < RETRY_COUNT) {
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
              // Use regular fetch for retries instead of recursive client creation
              return fetch(...args)
            }
            throw error
          }
        }
      }
    }
  )

  return client
}

// Export a single instance
export const supabase = createSupabaseClient()

// Create admin client only when needed
export const createAdminClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_EDGE_FUNCTION_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    }
  )
}

// Helper to check if session is valid
export const isValidSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession() 
    if (error) throw error
    
    // Check if session is expired
    if (session?.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000)
      const now = new Date()
      return expiresAt > now
    }
    
    return false
  } catch (error) {
    console.error('Error checking session:', error)
    return false
  }
}

// Helper to refresh session
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (session) {
      // Check if session needs refresh (e.g. less than 5 minutes until expiry)
      const expiresAt = new Date(session.expires_at! * 1000)
      const fiveMinutes = 5 * 60 * 1000
      const now = new Date()
      
      if (expiresAt.getTime() - now.getTime() < fiveMinutes) {
        const { data: { session: newSession }, error: refreshError } = 
          await supabase.auth.refreshSession()
        
        if (refreshError) throw refreshError
        return newSession
      }
      
      return session
    }
    
    return null
  } catch (error) {
    console.error('Error refreshing session:', error)
    return null
  }
}

// Type helper for Supabase client responses
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = {
  code: string
  details: string
  hint: string
  message: string
}