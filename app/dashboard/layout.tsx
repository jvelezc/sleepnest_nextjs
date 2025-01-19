"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Moon, Sun, LogOut, Home, Users, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!user) {
      router.replace("/login/specialist")
    }
  }, [user, router])

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    router.replace("/")
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="font-medium text-lg text-foreground">{user.email}</div>
          <div className="text-sm text-muted-foreground">Specialist</div>
          <div className="text-xs text-muted-foreground">
            Last login: {new Date().toLocaleDateString()}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              variant={pathname === "/dashboard/clients" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/clients")}
            >
              <Users className="mr-2 h-4 w-4" />
              Clients
            </Button>
            <Button
              variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}