export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  brand: string
  material: string
  weight: string
  dimensions: string
  stock?: number
  sku?: string
  status?: "in_stock" | "out_of_stock" | "discontinued"
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export type AdminRole = "super_admin" | "admin" | "editor" | "viewer"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  lastLogin?: string
  createdAt: string
  twoFactorEnabled: boolean
  groups?: string[]
  lastPasswordChange?: string
  passwordExpires?: string
  allowedIPs?: string[]
  sessions?: AdminSession[]
}

export interface AdminSession {
  id: string
  userId: string
  userAgent: string
  ipAddress: string
  createdAt: string
  lastActive: string
  isActive: boolean
}

export interface AdminActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  details?: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

export interface UserGroup {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt?: string
  members: string[] // User IDs
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  expiryDays: number
  preventReuse: number
}
