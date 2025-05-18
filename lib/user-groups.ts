import type { UserGroup } from "@/lib/types"
import { logAdminActivity } from "@/lib/admin-logger"

// Sample user groups with different permission levels
let userGroups: UserGroup[] = [
  {
    id: "1",
    name: "Content Editors",
    description: "Can edit and publish content",
    permissions: ["view:products", "edit:products", "view:orders", "view:customers", "view:analytics"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Order Managers",
    description: "Can manage orders and customer data",
    permissions: ["view:orders", "edit:orders", "view:customers", "edit:customers", "view:products"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Analytics Viewers",
    description: "Can view analytics and reports",
    permissions: ["view:analytics", "view:orders", "view:products", "view:customers"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Super Admins",
    description: "Full access to all features",
    permissions: ["view:all", "edit:all", "delete:all", "manage:users", "manage:settings"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Sample user-to-group mappings
const userGroupMappings: Record<string, string[]> = {
  "1": ["1", "3"], // User 1 belongs to Content Editors and Analytics Viewers
  "2": ["2"], // User 2 belongs to Order Managers
  "3": ["1", "2", "3"], // User 3 belongs to multiple groups
  "4": ["4"], // User 4 is a Super Admin
}

// Get all user groups
export const getAllUserGroups = () => {
  return userGroups
}

// Get a specific user group by ID
export const getUserGroup = (id: string) => {
  return userGroups.find((group) => group.id === id)
}

// Create a new user group
export const createUserGroup = (group: Omit<UserGroup, "id" | "createdAt" | "updatedAt">) => {
  const newGroup: UserGroup = {
    ...group,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  userGroups = [...userGroups, newGroup]
  logAdminActivity({
    action: "create",
    resource: "userGroup",
    resourceId: newGroup.id,
    details: `Created user group: ${newGroup.name}`,
  })

  return newGroup
}

// Update an existing user group
export const updateUserGroup = (id: string, updates: Partial<Omit<UserGroup, "id" | "createdAt" | "updatedAt">>) => {
  const index = userGroups.findIndex((group) => group.id === id)

  if (index === -1) {
    return null
  }

  const updatedGroup = {
    ...userGroups[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  userGroups = [...userGroups.slice(0, index), updatedGroup, ...userGroups.slice(index + 1)]

  logAdminActivity({
    action: "update",
    resource: "userGroup",
    resourceId: id,
    details: `Updated user group: ${updatedGroup.name}`,
  })

  return updatedGroup
}

// Delete a user group
export const deleteUserGroup = (id: string) => {
  const group = getUserGroup(id)

  if (!group) {
    return false
  }

  userGroups = userGroups.filter((group) => group.id !== id)

  logAdminActivity({
    action: "delete",
    resource: "userGroup",
    resourceId: id,
    details: `Deleted user group: ${group.name}`,
  })

  return true
}

// Get the groups a user belongs to
export const getUserGroups = (userId: string): string[] => {
  return userGroupMappings[userId] || []
}

// Get combined permissions from a user ID or multiple user groups
export const getUserPermissionsFromGroups = (userIdOrGroupIds: string | string[]): string[] => {
  const permissions = new Set<string>()

  // If userIdOrGroupIds is a string (userId), get the groups for that user
  if (typeof userIdOrGroupIds === "string") {
    const groupIds = userGroupMappings[userIdOrGroupIds] || []

    groupIds.forEach((groupId) => {
      const group = getUserGroup(groupId)
      if (group) {
        group.permissions.forEach((permission) => {
          permissions.add(permission)
        })
      }
    })
  }
  // If userIdOrGroupIds is an array (groupIds), process each group
  else if (Array.isArray(userIdOrGroupIds)) {
    userIdOrGroupIds.forEach((groupId) => {
      const group = getUserGroup(groupId)
      if (group) {
        group.permissions.forEach((permission) => {
          permissions.add(permission)
        })
      }
    })
  }

  return Array.from(permissions)
}
