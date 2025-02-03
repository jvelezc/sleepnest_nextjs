"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Baby, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CaregiverRegistrationPage() {
  const router = useRouter()

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
                <Baby className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Find Your Sleep Coach
              </h1>
              <p className="mt-2 text-muted-foreground">
                To join our platform, you'll need an invitation from a certified sleep coach.
              </p>
            </div>
          </div>

          <Card className="p-6 bg-muted/50 mb-6">
            <h2 className="font-semibold mb-2">How to Get Started:</h2>
            <ol className="space-y-4 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary mt-0.5">1.</span>
                <span>Join our WhatsApp community to connect with certified sleep coaches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary mt-0.5">2.</span>
                <span>Ask for a referral</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary mt-0.5">3.</span>
                <span>Once you find a coach, they'll send you an invitation to join the platform</span>
              </li>
            </ol>
          </Card>

          <div className="flex flex-col gap-4">
            <Button 
              className="w-full"
              onClick={() => window.open("https://chat.whatsapp.com/Bt77pIrCWncG98SDE1mVMn", "_blank")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Join WhatsApp Community
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              Return to Home
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}