"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle } from "lucide-react"

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<boolean>
  onCancel: () => void
}

export function TwoFactorAuth({ onVerify, onCancel }: TwoFactorAuthProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus the input on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.length !== 6) {
      setError("Please enter a 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await onVerify(code)

      if (!success) {
        setError("Invalid verification code. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h1 className="text-2xl font-bold dark:text-white">Two-Factor Authentication</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Enter the 6-digit code from your authenticator app</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code" className="dark:text-white">
            Verification Code
          </Label>
          <Input
            ref={inputRef}
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="123456"
            className="text-center text-lg tracking-widest dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">For demo purposes, enter any 6-digit code</p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 dark:border-gray-700 dark:text-white"
            onClick={onCancel}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
    </div>
  )
}
