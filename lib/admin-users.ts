import type { AdminUser, AdminRole } from "@/lib/types"
import { logAdminActivity } from "@/lib/admin-logger"

// In a real app, this would be stored in a database
let adminUsers: AdminUser[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "super_admin",
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    twoFactorEnabled: false,
  },
  {
    id: "editor-1",
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    twoFactorEnabled: false,
  },
  {
    id: "viewer-1",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    twoFactorEnabled: false,
  },
]

// Password map (in a real app, you would use hashed passwords in a database)
const passwordMap: Record<string, string> = {
  "admin@example.com": "admin123",
  "editor@example.com": "editor123",
  "viewer@example.com": "viewer123",
}

export function getAdminUsers(
  filters?: {
    role?: AdminRole
    search?: string
  },
  pagination?: {
    page: number
    limit: number
  },
): { users: AdminUser[]; total: number } {
  let filteredUsers = [...adminUsers]

  // Apply filters
  if (filters) {
    if (filters.role) {
      filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) => user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search),
      )
    }
  }

  // Apply pagination
  const total = filteredUsers.length
  if (pagination) {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    filteredUsers = filteredUsers.slice(start, end)
  }

  return { users: filteredUsers, total }
}

export function getAdminUserById(id: string): AdminUser | undefined {
  return adminUsers.find((user) => user.id === id)
}

export function getAdminUserByEmail(email: string): AdminUser | undefined {
  return adminUsers.find((user) => user.email === email)
}

export function createAdminUser(
  userData: Omit<AdminUser, "id" | "createdAt" | "lastLogin">,
  password: string,
  actingUserId: string,
  actingUserName: string,
): AdminUser {
  // Check if email already exists
  if (adminUsers.some((user) => user.email === userData.email)) {
    throw new Error("Email already exists")
  }

  const newUser: AdminUser = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
  }

  // Add user to the list
  adminUsers = [...adminUsers, newUser]

  // Add password to the map
  passwordMap[userData.email] = password

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "create",
    resource: "admin_user",
    resourceId: newUser.id,
    details: `Created new admin user: ${newUser.name} (${newUser.email}) with role: ${newUser.role}`,
  })

  return newUser
}

export function updateAdminUser(
  id: string,
  userData: Partial<Omit<AdminUser, "id" | "createdAt">>,
  actingUserId: string,
  actingUserName: string,
): AdminUser {
  const userIndex = adminUsers.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Update user
  const updatedUser = {
    ...adminUsers[userIndex],
    ...userData,
  }

  adminUsers = [...adminUsers.slice(0, userIndex), updatedUser, ...adminUsers.slice(userIndex + 1)]

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "admin_user",
    resourceId: id,
    details: `Updated admin user: ${updatedUser.name} (${updatedUser.email})`,
  })

  return updatedUser
}

export function deleteAdminUser(id: string, actingUserId: string, actingUserName: string): void {
  const user = getAdminUserById(id)

  if (!user) {
    throw new Error("User not found")
  }

  // Remove user from the list
  adminUsers = adminUsers.filter((user) => user.id !== id)

  // Remove password from the map
  delete passwordMap[user.email]

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "delete",
    resource: "admin_user",
    resourceId: id,
    details: `Deleted admin user: ${user.name} (${user.email})`,
  })
}

export function updateAdminUserPassword(
  id: string,
  newPassword: string,
  actingUserId: string,
  actingUserName: string,
): void {
  const user = getAdminUserById(id)

  if (!user) {
    throw new Error("User not found")
  }

  // Update password in the map
  passwordMap[user.email] = newPassword

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "admin_user_password",
    resourceId: id,
    details: `Updated password for admin user: ${user.name} (${user.email})`,
  })
}

export function verifyAdminCredentials(email: string, password: string): AdminUser | null {
  const user = getAdminUserByEmail(email)

  if (!user || passwordMap[email] !== password) {
    return null
  }

  return user
}

export function updateLastLogin(id: string): void {
  const userIndex = adminUsers.findIndex((user) => user.id === id)

  if (userIndex !== -1) {
    const updatedUser = {
      ...adminUsers[userIndex],
      lastLogin: new Date().toISOString(),
    }

    adminUsers = [...adminUsers.slice(0, userIndex), updatedUser, ...adminUsers.slice(userIndex + 1)]
  }
}

export function toggleTwoFactorAuth(
  id: string,
  enabled: boolean,
  actingUserId: string,
  actingUserName: string,
): AdminUser {
  const userIndex = adminUsers.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Update user
  const updatedUser = {
    ...adminUsers[userIndex],
    twoFactorEnabled: enabled,
  }

  adminUsers = [...adminUsers.slice(0, userIndex), updatedUser, ...adminUsers.slice(userIndex + 1)]

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "admin_user_2fa",
    resourceId: id,
    details: `${enabled ? "Enabled" : "Disabled"} two-factor authentication for admin user: ${updatedUser.name} (${updatedUser.email})`,
  })

  return updatedUser
}

// Role permissions map
export const rolePermissions: Record<AdminRole, string[]> = {
  super_admin: ["*"], // All permissions
  admin: [
    "view:dashboard",
    "view:products",
    "edit:products",
    "delete:products",
    "create:products",
    "view:orders",
    "edit:orders",
    "view:customers",
    "edit:customers",
    "view:analytics",
    "view:settings",
    "edit:settings",
  ],
  editor: [
    "view:dashboard",
    "view:products",
    "edit:products",
    "create:products",
    "view:orders",
    "edit:orders",
    "view:customers",
    "view:analytics",
  ],
  viewer: ["view:dashboard", "view:products", "view:orders", "view:customers", "view:analytics"],
}

export function hasPermission(user: AdminUser, permission: string): boolean {
  const userPermissions = rolePermissions[user.role]

  // Super admin has all permissions
  if (userPermissions.includes("*")) {
    return true
  }

  return userPermissions.includes(permission)
}
