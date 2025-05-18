"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/components/admin/admin-auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Filter } from "lucide-react"
import { getAdminActivityLogs } from "@/lib/admin-logger"
import { ExportLogs } from "@/components/admin/export-logs"
import type { AdminActivityLog } from "@/lib/types"

export default function AdminActivityLogsPage() {
  const { user, hasPermission } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [logs, setLogs] = useState<AdminActivityLog[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  // Filters
  const [filters, setFilters] = useState({
    userId: "",
    action: "",
    resource: "",
    startDate: "",
    endDate: "",
  })

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Check if user has permission to view this page
    if (user && !hasPermission("view:activity_logs")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      })
      router.push("/admin")
      return
    }

    loadLogs()
  }, [user, hasPermission, router, page])

  const loadLogs = () => {
    setIsLoading(true)
    try {
      // Apply filters if they have values
      const activeFilters: Record<string, string> = {}

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          activeFilters[key] = value
        }
      })

      const { logs, total } = getAdminActivityLogs(Object.keys(activeFilters).length > 0 ? activeFilters : undefined, {
        page,
        limit,
      })

      setLogs(logs)
      setTotalLogs(total)
    } catch (error) {
      console.error("Error loading activity logs:", error)
      toast({
        title: "Error",
        description: "Failed to load activity logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const applyFilters = () => {
    setPage(1)
    loadLogs()
  }

  const resetFilters = () => {
    setFilters({
      userId: "",
      action: "",
      resource: "",
      startDate: "",
      endDate: "",
    })
    setPage(1)
    loadLogs()
  }

  const handleExport = (format: "csv" | "pdf", exportFilters: any) => {
    // This is handled by the ExportLogs component
    console.log(`Exporting logs as ${format} with filters:`, exportFilters)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "delete":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "login":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "logout":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "terminate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Activity Logs</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="dark:border-gray-700 dark:text-white"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <ExportLogs onExport={handleExport} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Admin Activity Logs</CardTitle>
          <CardDescription>Track all actions performed by admin users</CardDescription>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="mb-6 p-4 border rounded-md dark:border-gray-700 space-y-4">
              <h3 className="font-medium dark:text-white">Filter Logs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Action</label>
                  <select
                    value={filters.action}
                    onChange={(e) => handleFilterChange("action", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">All Actions</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="terminate">Terminate</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Resource</label>
                  <select
                    value={filters.resource}
                    onChange={(e) => handleFilterChange("resource", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">All Resources</option>
                    <option value="admin_user">Admin User</option>
                    <option value="admin_panel">Admin Panel</option>
                    <option value="product">Product</option>
                    <option value="admin_user_password">User Password</option>
                    <option value="admin_user_2fa">User 2FA</option>
                    <option value="session">Session</option>
                    <option value="sessions">Sessions</option>
                    <option value="user_group">User Group</option>
                    <option value="user_group_membership">Group Membership</option>
                    <option value="password_policy">Password Policy</option>
                    <option value="ip_restrictions">IP Restrictions</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">Start Date</label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-gray-300">End Date</label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={resetFilters} className="dark:border-gray-700 dark:text-white">
                  Reset
                </Button>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700 dark:bg-gray-800">
                      <TableHead className="dark:text-gray-400">Timestamp</TableHead>
                      <TableHead className="dark:text-gray-400">User</TableHead>
                      <TableHead className="dark:text-gray-400">Action</TableHead>
                      <TableHead className="dark:text-gray-400">Resource</TableHead>
                      <TableHead className="dark:text-gray-400">Details</TableHead>
                      <TableHead className="dark:text-gray-400">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 dark:text-gray-400">
                          <div className="flex flex-col items-center justify-center py-8">
                            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
                            <p>No activity logs found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Activity logs will appear here as admin users perform actions
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id} className="dark:border-gray-700">
                          <TableCell className="dark:text-gray-300">{formatDate(log.timestamp)}</TableCell>
                          <TableCell className="dark:text-white">{log.userName}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
                            >
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{log.resource.replace(/_/g, " ")}</TableCell>
                          <TableCell className="dark:text-gray-300 max-w-xs truncate">{log.details || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="dark:border-gray-700 dark:text-white"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {page} of {Math.ceil(totalLogs / limit)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page >= Math.ceil(totalLogs / limit)}
                  className="dark:border-gray-700 dark:text-white"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
