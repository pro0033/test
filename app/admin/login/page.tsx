"use client"

import type React from "react"
import { useState } from "react"
import { useAdminAuth } from "@/components/admin/admin-auth-provider"
import { TwoFactorAuth } from "@/components/admin/two-factor-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, verifyTwoFactor, twoFactorState } = useAdminAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await login(email, password)

      if (!result.success) {
        setError("Invalid email or password. Please try again.")
      }
      // If 2FA is required, the UI will update based on twoFactorState
    } catch (error) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorVerify = async (code: string) => {
    return await verifyTwoFactor(code)
  }

  const handleTwoFactorCancel = () => {
    // Reset the form
    setEmail("")
    setPassword("")
    setError("")

    // Reload the page to reset the auth state
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      {twoFactorState.required ? (
        <TwoFactorAuth onVerify={handleTwoFactorVerify} onCancel={handleTwoFactorCancel} />
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold dark:text-white">Admin Login</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-white">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Demo credentials:</p>
            <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <p>
                <strong>Admin:</strong> admin@example.com / admin123
              </p>
              <p>
                <strong>Editor:</strong> editor@example.com / editor123
              </p>
              <p>
                <strong>Viewer:</strong> viewer@example.com / viewer123
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
