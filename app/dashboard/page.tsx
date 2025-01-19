"use client"

import { Users } from "lucide-react"
import { InviteCaregiverDialog } from "@/components/invite-caregiver-dialog"

export default function DashboardPage() {
  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sleep Specialist Dashboard</h1>
          <p className="text-muted-foreground">Manage your clients and track their progress</p>
        </div>
        <InviteCaregiverDialog />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Your Caregivers</h2>
        
        {/* Empty State */}
        <div className="rounded-lg border bg-card p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Welcome to Your Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              You haven't added any caregivers yet. Start growing your
              practice by inviting your first caregiver.
            </p>
            <InviteCaregiverDialog />
          </div>
        </div>
      </div>
    </div>
  )
}