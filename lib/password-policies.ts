import type { PasswordPolicy } from "@/lib/types"
import { logAdminActivity } from "@/lib/admin-logger"

// Default password policy
const defaultPolicy: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expiryDays: 90,
  preventReuse: 5,
}

// In a real app, this would be stored in a database
let passwordPolicy: PasswordPolicy = { ...defaultPolicy }

export function getPasswordPolicy(): PasswordPolicy {
  return { ...passwordPolicy }
}

export function updatePasswordPolicy(
  policy: Partial<PasswordPolicy>,
  actingUserId: string,
  actingUserName: string,
): PasswordPolicy {
  // Update policy
  passwordPolicy = {
    ...passwordPolicy,
    ...policy,
  }

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "password_policy",
    details: `Updated password policy`,
  })

  return { ...passwordPolicy }
}

export function resetPasswordPolicy(actingUserId: string, actingUserName: string): PasswordPolicy {
  // Reset to default
  passwordPolicy = { ...defaultPolicy }

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "password_policy",
    details: `Reset password policy to default`,
  })

  return { ...passwordPolicy }
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check length
  if (password.length < passwordPolicy.minLength) {
    errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`)
  }

  // Check uppercase
  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  // Check lowercase
  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  // Check numbers
  if (passwordPolicy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  // Check special characters
  if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// In a real app, this would be stored in a database
const passwordHistory: Record<string, string[]> = {}

export function addPasswordToHistory(userId: string, password: string): void {
  if (!passwordHistory[userId]) {
    passwordHistory[userId] = []
  }

  // Add to history
  passwordHistory[userId] = [password, ...passwordHistory[userId]].slice(0, passwordPolicy.preventReuse)
}

export function isPasswordInHistory(userId: string, password: string): boolean {
  if (!passwordHistory[userId]) {
    return false
  }

  return passwordHistory[userId].includes(password)
}

export function getPasswordExpiryDate(lastChangeDate: string): string {
  const expiryDate = new Date(lastChangeDate)
  expiryDate.setDate(expiryDate.getDate() + passwordPolicy.expiryDays)
  return expiryDate.toISOString()
}

export function isPasswordExpired(expiryDate: string): boolean {
  return new Date(expiryDate) < new Date()
}
