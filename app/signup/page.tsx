"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Loader2, BabyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { debug, isValidUUID } from "@/lib/utils"
import type { Database } from "@/types/database.types"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Define the shape of the specialist data
type SpecialistData = {
  name: string | null
  business_name: string | null
}

// Define the shape of the invitation query result
type InvitationQueryResult = {
  id: string
  email: string
  name: string
  status: string
  expires_at: string | null
  specialists: SpecialistData
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function CaregiverSignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [validatingInvitation, setValidatingInvitation] = useState(true)
  const [invitationError, setInvitationError] = useState<string | null>(null)
  const [specialistName, setSpecialistName] = useState<string | null>(null)
  const [url, setUrl] = useState('')

  // Get and validate invitation details from URL
  const rawInvitationId = searchParams.get("invitation_id")
  const invitationId = rawInvitationId && isValidUUID(rawInvitationId) ? rawInvitationId : null
  const invitedEmail = searchParams.get("email")

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  useEffect(() => {
    debug.info('CaregiverSignupPage mounted', {
      invitationId,
      invitedEmail,
      url,
      searchParams: Object.fromEntries(searchParams.entries())
    })

    return () => {
      debug.info('CaregiverSignupPage unmounted')
    }
  }, [invitationId, invitedEmail, url, searchParams])

  debug.info('URL parameters:', {
    rawInvitationId,
    invitationId,
    invitedEmail,
    url: url,
    searchParams: Object.fromEntries(searchParams.entries())
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: invitedEmail ? decodeURIComponent(invitedEmail) : "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    async function validateInvitation() {
      debug.info('Starting invitation validation', {
        invitationId,
        invitedEmail
      })

      if (!invitationId || !invitedEmail) {
        debug.warn('Missing invitation parameters', {
          invitationId,
          invitedEmail
        })
        setInvitationError("Invalid invitation format")
        setValidatingInvitation(false)
        return
      }

      try {
        debug.info('Validating invitation:', { invitationId, invitedEmail })

        // Before the query
        debug.info('Invitation query details:', { 
          invitationId,
          invitedEmail,
          decodedEmail: decodeURIComponent(invitedEmail),
          isValidUUID: isValidUUID(invitationId)
        })

        const { data: rawData, error } = await supabaseAdmin
          .from("caregiver_invitations")
          .select(`
            id,
            email,
            name,
            status,
            expires_at,
            specialists (
              name,
              business_name
            )
          `)
          .eq("id", invitationId)
          .eq("email", invitedEmail)
          .single()

        // After the query
        debug.info('Query result:', {
          hasData: !!rawData,
          data: rawData,
          error
        })

        if (error) {
          debug.error('Invitation query failed', { 
            error,
            invitationId,
            status: error.code,
            message: error.message,
            details: error.details
          })
          throw new Error("Invitation not found")
        }

        // After getting the invitation, verify the email matches
        if (rawData.email !== decodeURIComponent(invitedEmail)) {
          debug.warn('Email mismatch in invitation', {
            invitationEmail: rawData.email,
            providedEmail: decodeURIComponent(invitedEmail)
          })
          throw new Error("Invalid invitation email")
        }

        // Add debug for invitation data
        debug.info('Raw invitation data received:', rawData)

        // Transform the raw data to match our expected type
        const invitation: InvitationQueryResult = {
          ...rawData,
          specialists: Array.isArray(rawData.specialists) 
            ? rawData.specialists[0] 
            : rawData.specialists
        }

        if (invitation.status === "accepted") {
          debug.warn('Attempt to use already accepted invitation', {
            invitationId,
            status: invitation.status
          })
          throw new Error("This invitation has already been used")
        }

        if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
          debug.warn('Attempt to use expired invitation', {
            invitationId,
            expiresAt: invitation.expires_at
          })
          throw new Error("This invitation has expired")
        }

        debug.info('Invitation is valid:', invitation)

        // Set specialist name for display
        setSpecialistName(
          invitation.specialists?.business_name || 
          invitation.specialists?.name || 
          null
        )

        // Pre-fill the name if provided in the invitation
        if (invitation.name) {
          form.setValue("name", invitation.name)
        }

        setValidatingInvitation(false)
      } catch (err) {
        debug.error('Invitation validation failed', {
          error: err,
          invitationId,
          invitedEmail
        })
        setInvitationError(err instanceof Error ? err.message : "Invalid invitation")
        setValidatingInvitation(false)
      }
    }

    validateInvitation()
  }, [invitationId, invitedEmail, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    debug.info('Starting form submission', {
      email: values.email,
      name: values.name,
      invitationId
    })

    if (!invitationId) {
      debug.error('Missing invitationId during form submission')
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid invitation",
      })
      return
    }

    setLoading(true)

    try {
      // Check if user exists using RPC
      const { data: userExists, error: lookupError } = await supabase.rpc(
        'check_user_exists',
        { p_email: values.email }
      )

      if (lookupError) {
        debug.error('User lookup failed', { error: lookupError })
        throw lookupError
      }

      if (userExists) {
        debug.info('User already exists')
        throw new Error('An account with this email already exists')
      }

      // User doesn't exist, create new account
      debug.info('Creating new auth account')
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name, role: 'caregiver' }
        }
      })

      if (signUpError) {
        debug.error('Auth signup failed', { error: signUpError })
        throw signUpError
      }

      if (!authData.user) {
        debug.error('Auth signup returned no user')
        throw new Error("Failed to create account")
      }

      // Handle all database operations with RPC
      debug.info('Calling handle_caregiver_signup RPC', { 
        userId: authData.user.id, 
        invitationId 
      })
      const { error: rpcError } = await supabase.rpc(
        'handle_caregiver_signup',
        {
          p_user_id: authData.user.id,
          p_invitation_id: invitationId
        }
      )

      if (rpcError) {
        debug.error('RPC call failed', { error: rpcError })
        throw rpcError
      }

      debug.info('Signup process completed successfully')
      toast({
        title: "Account created",
        description: "Your caregiver account has been created successfully. Please check your email to verify your account.",
      })

      router.push("/login/caregiver")
    } catch (err) {
      debug.error('Signup process failed', {
        error: err,
        email: values.email,
        invitationId
      })
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create account",
      })
    } finally {
      setLoading(false)
    }
  }

  if (validatingInvitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Validating your invitation...</p>
        </div>
      </div>
    )
  }

  if (invitationError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg shadow-lg p-6 text-center"
          >
            <h1 className="text-2xl font-bold text-destructive mb-4">Invalid Invitation</h1>
            <p className="text-muted-foreground mb-6">{invitationError}</p>
            <Button onClick={() => router.push("/")}>Return Home</Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full overflow-hidden rounded-xl shadow-xl p-6 bg-card"
        >
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="inline-flex items-center text-sm mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <BabyIcon className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Create Your Caregiver Account</h1>
              {specialistName && (
                <p className="mt-2 text-muted-foreground">
                  Join {specialistName}'s sleep consultation practice
                </p>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is how you'll appear to your sleep specialist
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the email where you received the invitation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters with uppercase, lowercase, and numbers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Caregiver Account"
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  )
}