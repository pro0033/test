"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/components/admin/admin-auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  UserPlus,
  Search,
  MoreVertical,
  Edit,
  Trash,
  Key,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateAdminUserPassword,
  toggleTwoFactorAuth,
} from "@/lib/admin-users"
import type { AdminUser, AdminRole } from "@/lib/types"

export default function AdminUsersPage() {
  const { user, hasPermission } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<AdminRole | "all">("all")

  // New user form state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "editor" as AdminRole,
    password: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Edit user state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "editor" as AdminRole,
  })

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  })

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)

  // 2FA dialog state
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)
  const [userFor2FA, setUserFor2FA] = useState<AdminUser | null>(null)

  useEffect(() => {
    // Check if user has permission to view this page
    if (user && !hasPermission("view:admin_users")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      })
      router.push("/admin")
      return
    }

    loadUsers()
  }, [user, hasPermission, router])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const filters: { role?: AdminRole; search?: string } = {}

      if (selectedRole !== "all") {
        filters.role = selectedRole
      }

      if (searchQuery) {
        filters.search = searchQuery
      }

      const { users } = getAdminUsers(filters)
      setUsers(users)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    loadUsers()
  }

  const handleCreateUser = () => {
    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "editor",
      password: "",
      confirmPassword: "",
      twoFactorEnabled: false,
    })
    setFormErrors({})
    setIsCreateDialogOpen(true)
  }

  const validateCreateForm = () => {
    const errors: Record<string, string> = {}

    if (!newUser.name.trim()) {
      errors.name = "Name is required"
    }

    if (!newUser.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = "Email is invalid"
    }

    if (!newUser.password) {
      errors.password = "Password is required"
    } else if (newUser.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (newUser.password !== newUser.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateSubmit = () => {
    if (!validateCreateForm()) {
      return
    }

    try {
      if (!user) return

      createAdminUser(
        {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          twoFactorEnabled: newUser.twoFactorEnabled,
        },
        newUser.password,
        user.id,
        user.name,
      )

      toast({
        title: "User Created",
        description: `${newUser.name} has been created successfully.`,
      })

      setIsCreateDialogOpen(false)
      loadUsers()
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditUser = (selectedUser: AdminUser) => {
    setEditingUser(selectedUser)
    setEditForm({
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
    })
    setFormErrors({})
    setIsEditDialogOpen(true)
  }

  const validateEditForm = () => {
    const errors: Record<string, string> = {}

    if (!editForm.name.trim()) {
      errors.name = "Name is required"
    }

    if (!editForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = "Email is invalid"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleEditSubmit = () => {
    if (!validateEditForm() || !editingUser || !user) {
      return
    }

    try {
      updateAdminUser(
        editingUser.id,
        {
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
        },
        user.id,
        user.name,
      )

      toast({
        title: "User Updated",
        description: `${editForm.name} has been updated successfully.`,
      })

      setIsEditDialogOpen(false)
      loadUsers()
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = (selectedUser: AdminUser) => {
    setEditingUser(selectedUser)
    setPasswordForm({
      password: "",
      confirmPassword: "",
    })
    setFormErrors({})
    setIsPasswordDialogOpen(true)
  }

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {}

    if (!passwordForm.password) {
      errors.password = "Password is required"
    } else if (passwordForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePasswordSubmit = () => {
    if (!validatePasswordForm() || !editingUser || !user) {
      return
    }

    try {
      updateAdminUserPassword(editingUser.id, passwordForm.password, user.id, user.name)

      toast({
        title: "Password Updated",
        description: `Password for ${editingUser.name} has been updated successfully.`,
      })

      setIsPasswordDialogOpen(false)
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = (selectedUser: AdminUser) => {
    setUserToDelete(selectedUser)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (!userToDelete || !user) {
      return
    }

    try {
      deleteAdminUser(userToDelete.id, user.id, user.name)

      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been deleted successfully.`,
      })

      setIsDeleteDialogOpen(false)
      loadUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleManage2FA = (selectedUser: AdminUser) => {
    setUserFor2FA(selectedUser)
    setIs2FADialogOpen(true)
  }

  const handleToggle2FA = (enabled: boolean) => {
    if (!userFor2FA || !user) {
      return
    }

    try {
      toggleTwoFactorAuth(userFor2FA.id, enabled, user.id, user.name)

      toast({
        title: "2FA Settings Updated",
        description: `Two-factor authentication has been ${enabled ? "enabled" : "disabled"} for ${userFor2FA.name}.`,
      })

      setIs2FADialogOpen(false)
      loadUsers()
    } catch (error) {
      console.error("Error updating 2FA settings:", error)
      toast({
        title: "Error",
        description: "Failed to update 2FA settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeClass = (role: AdminRole) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "editor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "viewer":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const canManageUser = (targetUser: AdminUser) => {
    if (!user) return false

    // Super admins can manage anyone except other super admins
    if (user.role === "super_admin") {
      return targetUser.id !== user.id // Can't manage self
    }

    // Admins can manage editors and viewers
    if (user.role === "admin") {
      return ["editor", "viewer"].includes(targetUser.role) && targetUser.id !== user.id
    }

    // Others can't manage users
    return false
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Admin Users</h1>
        {hasPermission("create:admin_users") && (
          <Button onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">User Management</CardTitle>
          <CardDescription>Manage admin users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole | "all")}
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <Button variant="outline" onClick={handleSearch}>
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700 dark:bg-gray-800">
                    <TableHead className="dark:text-gray-400">Name</TableHead>
                    <TableHead className="dark:text-gray-400">Email</TableHead>
                    <TableHead className="dark:text-gray-400">Role</TableHead>
                    <TableHead className="dark:text-gray-400">2FA</TableHead>
                    <TableHead className="dark:text-gray-400">Last Login</TableHead>
                    <TableHead className="dark:text-gray-400">Created</TableHead>
                    <TableHead className="dark:text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 dark:text-gray-400">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((adminUser) => (
                      <TableRow key={adminUser.id} className="dark:border-gray-700">
                        <TableCell className="font-medium dark:text-white">{adminUser.name}</TableCell>
                        <TableCell className="dark:text-gray-300">{adminUser.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(adminUser.role)}`}
                          >
                            {adminUser.role.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          {adminUser.twoFactorEnabled ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{formatDate(adminUser.lastLogin)}</TableCell>
                        <TableCell className="dark:text-gray-300">{formatDate(adminUser.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          {canManageUser(adminUser) ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                                <DropdownMenuLabel className="dark:text-gray-300">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="dark:bg-gray-700" />
                                {hasPermission("edit:admin_users") && (
                                  <DropdownMenuItem
                                    onClick={() => handleEditUser(adminUser)}
                                    className="dark:text-gray-300 dark:focus:bg-gray-700"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("edit:admin_users") && (
                                  <DropdownMenuItem
                                    onClick={() => handleChangePassword(adminUser)}
                                    className="dark:text-gray-300 dark:focus:bg-gray-700"
                                  >
                                    <Key className="mr-2 h-4 w-4" />
                                    Change Password
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("edit:admin_users") && (
                                  <DropdownMenuItem
                                    onClick={() => handleManage2FA(adminUser)}
                                    className="dark:text-gray-300 dark:focus:bg-gray-700"
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Manage 2FA
                                  </DropdownMenuItem>
                                )}
                                {hasPermission("delete:admin_users") && (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(adminUser)}
                                    className="text-red-600 dark:text-red-400 dark:focus:bg-gray-700"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400">No actions</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Create New Admin User</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Add a new user to the admin panel with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-white">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.name && <p className="text-sm text-red-500 dark:text-red-400">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.email && <p className="text-sm text-red-500 dark:text-red-400">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="dark:text-white">
                Role
              </Label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {user?.role === "super_admin" && <option value="admin">Admin</option>}
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.password && <p className="text-sm text-red-500 dark:text-red-400">{formErrors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500 dark:text-red-400">{formErrors.confirmPassword}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="twoFactor"
                checked={newUser.twoFactorEnabled}
                onCheckedChange={(checked) => setNewUser({ ...newUser, twoFactorEnabled: checked })}
              />
              <Label htmlFor="twoFactor" className="dark:text-white">
                Enable Two-Factor Authentication
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="dark:border-gray-600 dark:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit User</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="dark:text-white">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.name && <p className="text-sm text-red-500 dark:text-red-400">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="dark:text-white">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.email && <p className="text-sm text-red-500 dark:text-red-400">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="dark:text-white">
                Role
              </Label>
              <select
                id="edit-role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as AdminRole })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {user?.role === "super_admin" && <option value="admin">Admin</option>}
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="dark:border-gray-600 dark:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Change Password</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {editingUser && `Set a new password for ${editingUser.name}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="dark:text-white">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.password && <p className="text-sm text-red-500 dark:text-red-400">{formErrors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password" className="dark:text-white">
                Confirm New Password
              </Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500 dark:text-red-400">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
              className="dark:border-gray-600 dark:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {userToDelete && (
              <div className="flex items-center p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  You are about to delete <strong>{userToDelete.name}</strong> ({userToDelete.email}).
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="dark:border-gray-600 dark:text-white"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Management Dialog */}
      <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Two-Factor Authentication</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {userFor2FA && `Manage two-factor authentication for ${userFor2FA.name}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {userFor2FA && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userFor2FA.twoFactorEnabled
                        ? "Currently enabled for this user"
                        : "Currently disabled for this user"}
                    </p>
                  </div>
                  <Switch
                    checked={userFor2FA.twoFactorEnabled}
                    onCheckedChange={(checked) => handleToggle2FA(checked)}
                  />
                </div>

                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Note:</strong> In a real application, enabling 2FA would generate a QR code for the user to
                    scan with an authenticator app.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIs2FADialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
