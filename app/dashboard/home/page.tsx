"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardHomePage() {
  const router = useRouter()
  const { role } = useAuth()

  useEffect(() => {
    // Redirect to appropriate dashboard based on role
    if (role === 'caregiver') {
      router.replace('/dashboard/caregiver')
    } else if (role === 'specialist') {
      router.replace('/dashboard/specialist')
    }
  }, [role, router])

  return null // No UI needed since we're redirecting
}