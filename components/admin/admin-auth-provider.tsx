"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { AdminUser } from "@/lib/types"
import { verifyAdminCredentials, updateLastLogin, hasPermission, getAdminUserById } from "@/lib/admin-users"
import { logAdminActivity } from "@/lib/admin-logger"
import { createSession, updateSessionActivity, terminateSession } from "@/lib/admin-sessions"
import { getUserPermissionsFromGroups } from "@/lib/user-groups"
import { isPasswordExpired } from "@/lib/password-policies"

type TwoFactorState = {
  required: boolean
  verified: boolean
  userId: string | null
}

type AdminAuthContextType = {
  user: AdminUser | null
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; requireTwoFactor?: boolean; passwordExpired?: boolean }>
  verifyTwoFactor: (code: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  twoFactorState: TwoFactorState
  hasPermission: (permission: string) => boolean
  sessionId: string | null
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [twoFactorState, setTwoFactorState] = useState<TwoFactorState>({
    required: false,
    verified: false,
    userId: null,
  })
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if admin user is logged in from localStorage
    const storedUserId = localStorage.getItem("adminUserId")
    const storedSessionId = localStorage.getItem("adminSessionId")

    if (storedUserId && storedSessionId) {
      const userData = getAdminUserById(storedUserId)
      if (userData) {
        setUser(userData)
        setSessionId(storedSessionId)

        // Update session activity
        updateSessionActivity(storedSessionId)

        // Check if password is expired
        if (userData.passwordExpires && isPasswordExpired(userData.passwordExpires)) {
          // Password is expired, redirect to change password page
          if (!pathname?.includes("/admin/change-password")) {
            router.push("/admin/change-password")
          }
        }
      }
    }
    setIsLoading(false)
  }, [router, pathname])

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isLoading && !user && !pathname?.includes("/admin/login")) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router, pathname])

  // Update session activity periodically
  useEffect(() => {
    if (sessionId) {
      const interval = setInterval(
        () => {
          updateSessionActivity(sessionId)
        },
        5 * 60 * 1000,
      ) // Every 5 minutes

      return () => clearInterval(interval)
    }
  }, [sessionId])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Verify credentials
      const userData = verifyAdminCredentials(email, password)

      if (!userData) {
        throw new Error("Invalid credentials")
      }

      // Check if IP is allowed (in a real app)
      // const clientIP = "127.0.0.1" // In a real app, you would get the client IP
      // if (!isIPAllowed(clientIP, userData.allowedIPs)) {
      //   throw new Error("Access denied from this IP address")
      // }

      // Check if password is expired
      if (userData.passwordExpires && isPasswordExpired(userData.passwordExpires)) {
        setUser(userData)
        setIsLoading(false)
        return { success: true, passwordExpired: true }
      }

      // Check if 2FA is enabled
      if (userData.twoFactorEnabled) {
        setTwoFactorState({
          required: true,
          verified: false,
          userId: userData.id,
        })

        setIsLoading(false)
        return { success: true, requireTwoFactor: true }
      }

      // Complete login if 2FA is not required
      completeLogin(userData)

      return { success: true }
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
      throw error
    }
  }

  const verifyTwoFactor = async (code: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would verify the code against a service
      // For demo purposes, we'll accept any 6-digit code
      const isValid = /^\d{6}$/.test(code)

      if (!isValid) {
        setIsLoading(false)
        return false
      }

      if (twoFactorState.userId) {
        const userData = getAdminUserById(twoFactorState.userId)
        if (userData) {
          completeLogin(userData)

          // Reset 2FA state
          setTwoFactorState({
            required: false,
            verified: true,
            userId: null,
          })

          return true
        }
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("2FA verification failed:", error)
      setIsLoading(false)
      return false
    }
  }

  const completeLogin = (userData: AdminUser) => {
    // Update last login time
    updateLastLogin(userData.id)

    // Create a new session
    const session = createSession(
      userData.id,
      navigator.userAgent,
      "127.0.0.1", // In a real app, you would get the client IP
    )

    // Set session ID
    setSessionId(session.id)
    localStorage.setItem("adminSessionId", session.id)

    // Set user in state
    setUser(userData)

    // Store user ID in localStorage
    localStorage.setItem("adminUserId", userData.id)

    // Log the activity
    logAdminActivity({
      userId: userData.id,
      userName: userData.name,
      action: "login",
      resource: "admin_panel",
      details: `User logged in: ${userData.name} (${userData.email})`,
    })

    // Redirect to admin dashboard
    router.push("/admin")

    setIsLoading(false)
  }

  const logout = () => {
    if (user) {
      // Log the activity before clearing the user
      logAdminActivity({
        userId: user.id,
        userName: user.name,
        action: "logout",
        resource: "admin_panel",
        details: `User logged out: ${user.name} (${user.email})`,
      })

      // Terminate the session
      if (sessionId) {
        terminateSession(sessionId, user.id, user.name)
      }
    }

    setUser(null)
    setSessionId(null)
    localStorage.removeItem("adminUserId")
    localStorage.removeItem("adminSessionId")

    // Reset 2FA state
    setTwoFactorState({
      required: false,
      verified: false,
      userId: null,
    })

    router.push("/admin/login")
  }

  const checkPermission = (permission: string) => {
    if (!user) return false

    // Check role-based permissions
    const hasRolePermission = hasPermission(user, permission)

    // Check group-based permissions
    const groupPermissions = getUserPermissionsFromGroups(user.id)
    const hasGroupPermission = groupPermissions.includes(permission)

    return hasRolePermission || hasGroupPermission
  }

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        login,
        verifyTwoFactor,
        logout,
        isLoading,
        twoFactorState,
        hasPermission: checkPermission,
        sessionId,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
