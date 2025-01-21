"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

export function InviteCaregiverDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showResendAlert, setShowResendAlert] = useState(false)
  const [pendingValues, setPendingValues] = useState<z.infer<typeof formSchema> | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
      setPendingValues(null)
      setShowResendAlert(false)
    }
    setOpen(newOpen)
  }

  const sendInvitationEmail = async (invitationId: string, values: z.infer<typeof formSchema>) => {
    if (!process.env.NEXT_PUBLIC_EDGE_FUNCTION_KEY) {
      throw new Error('Edge function key is not configured')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/invite_caregiver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_EDGE_FUNCTION_KEY}`,
      },
      body: JSON.stringify({
        to: values.email,
        name: values.name,
        specialist_name: user?.email,
        invitation_id: invitationId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send invitation email')
    }

    return response.json()
  }

  const handleInvitation = async (values: z.infer<typeof formSchema>, resend: boolean = false) => {
    if (loading) return
    setLoading(true)
    
    try {
      // Create or update invitation using the RPC function
      const { data: invitationId, error: inviteError } = await supabase.rpc(
        "invite_caregiver",
        {
          caregiver_email: values.email,
          caregiver_name: values.name,
          resend
        }
      )

      if (inviteError) {
        // Handle the case where invitation already exists
        if (inviteError.message.includes("already been sent") && !resend) {
          setPendingValues(values)
          setShowResendAlert(true)
          setLoading(false)
          return
        }
        throw inviteError
      }

      if (!invitationId) {
        throw new Error("Failed to create invitation")
      }

      // Send invitation email
      await sendInvitationEmail(invitationId, values)

      // Show success toast and close dialogs
      toast({
        title: resend ? "Invitation Resent" : "Invitation Sent",
        description: `Successfully ${resend ? "resent" : "sent"} invitation to ${values.email}`,
      })

      // Reset state and close dialogs
      setShowResendAlert(false)
      setPendingValues(null)
      form.reset()
      setOpen(false)
    } catch (err) {
      console.error("Invitation error:", err)
      
      // More specific error messages based on the error type
      let errorMessage = "Failed to send invitation"
      if (err instanceof Error) {
        if (err.message.includes("Invalid JWT")) {
          errorMessage = "Authentication error. Please try again or contact support."
        } else if (err.message.includes("already been sent")) {
          errorMessage = "An invitation has already been sent to this email."
        } else {
          errorMessage = err.message
        }
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await handleInvitation(values)
  }

  return (
    <>
      <AlertDialog 
        open={showResendAlert} 
        onOpenChange={(open) => {
          if (!open) {
            setShowResendAlert(false)
            setPendingValues(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resend Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              An invitation has already been sent to this email. Would you like to resend it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (pendingValues) {
                  await handleInvitation(pendingValues, true)
                }
              }}
            >
              Yes, Resend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Invite Caregiver
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Invite Caregiver</DialogTitle>
            </div>
            <DialogDescription>
              Send an invitation to a caregiver to join your practice.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caregiver's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caregiver's Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  An invitation email will be sent to the caregiver with instructions to create their account.
                </p>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}