"use client"

import { useEffect, useMemo } from "react"
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
  const { user, role, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const defaultPath = useMemo(() => {
    return role === 'caregiver' ? '/dashboard/caregiver' : '/dashboard/specialist'
  }, [role])

  useEffect(() => {
    if (!user) {
      const loginPath = role === 'caregiver' ? '/login/caregiver' : '/login/specialist'
      router.replace(loginPath)
      return
    }

    // Redirect to appropriate dashboard if on root dashboard path
    if (pathname === '/dashboard') {
      router.replace(defaultPath)
    }
  }, [user, role, router, pathname, defaultPath])

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
          <div className="text-sm text-muted-foreground">{role === 'caregiver' ? 'Caregiver' : 'Specialist'}</div>
          <div className="text-xs text-muted-foreground">
            Last login: {new Date().toLocaleDateString()}
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Button
              variant={pathname === defaultPath ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push(defaultPath)}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          {role === 'specialist' ? (
            <Button
              variant={pathname === "/dashboard/clients" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/clients")}
            >
              <Users className="mr-2 h-4 w-4" />
              Clients
            </Button>
          ) : (
            <Button
              variant={pathname === "/dashboard/caregivers" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/dashboard/caregivers")}
            >
              <Users className="mr-2 h-4 w-4" />
              Specialists
            </Button>
          )}
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