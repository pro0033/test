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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, AlertCircle, X } from "lucide-react"
import { getAllActiveSessions, terminateSession, terminateAllUserSessions } from "@/lib/admin-sessions"
import type { AdminSession } from "@/lib/types"

export default function AdminSessionsPage() {
  const { user, hasPermission, sessionId } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [totalSessions, setTotalSessions] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [ipFilter, setIpFilter] = useState("")
  const [sessionToTerminate, setSessionToTerminate] = useState<AdminSession | null>(null)
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false)
  const [isTerminateAllDialogOpen, setIsTerminateAllDialogOpen] = useState(false)
  const [userIdForTerminateAll, setUserIdForTerminateAll] = useState<string | null>(null)
  const [isTerminating, setIsTerminating] = useState(false)

  useEffect(() => {
    // Check if user has permission to view this page
    if (user && !hasPermission("view:sessions")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      })
      router.push("/admin")
      return
    }

    loadSessions()
  }, [user, hasPermission, router, page])

  const loadSessions = () => {
    setIsLoading(true)
    try {
      // Apply filters
      const filters: Record<string, string> = {}

      if (ipFilter) {
        filters.ipAddress = ipFilter
      }

      const { sessions: sessionData, total } = getAllActiveSessions(
        Object.keys(filters).length > 0 ? filters : undefined,
        { page, limit },
      )

      setSessions(sessionData)
      setTotalSessions(total)
    } catch (error) {
      console.error("Error loading sessions:", error)
      toast({
        title: "Error",
        description: "Failed to load active sessions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1) // Reset to first page when searching
    loadSessions()
  }

  const handleTerminateSession = (session: AdminSession) => {
    setSessionToTerminate(session)
    setIsTerminateDialogOpen(true)
  }

  const confirmTerminateSession = async () => {
    if (!sessionToTerminate || !user) return

    setIsTerminating(true)
    try {
      terminateSession(sessionToTerminate.id, user.id, user.name)

      toast({
        title: "Session Terminated",
        description: "The session has been terminated successfully.",
      })

      setIsTerminateDialogOpen(false)
      loadSessions() // Reload sessions after termination

      // If the user terminated their own session, log them out
      if (sessionToTerminate.id === sessionId) {
        setTimeout(() => {
          window.location.href = "/admin/login"
        }, 1500)
      }
    } catch (error) {
      console.error("Error terminating session:", error)
      toast({
        title: "Error",
        description: "Failed to terminate session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTerminating(false)
    }
  }

  const handleTerminateAllUserSessions = (userId: string) => {
    setUserIdForTerminateAll(userId)
    setIsTerminateAllDialogOpen(true)
  }

  const confirmTerminateAllUserSessions = async () => {
    if (!userIdForTerminateAll || !user) return

    setIsTerminating(true)
    try {
      terminateAllUserSessions(userIdForTerminateAll, user.id, user.name, sessionId)

      toast({
        title: "Sessions Terminated",
        description: "All sessions for this user have been terminated successfully.",
      })

      setIsTerminateAllDialogOpen(false)
      loadSessions() // Reload sessions after termination
    } catch (error) {
      console.error("Error terminating sessions:", error)
      toast({
        title: "Error",
        description: "Failed to terminate sessions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTerminating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const isCurrentSession = (session: AdminSession) => {
    return session.id === sessionId
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Active Sessions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Session Management</CardTitle>
          <CardDescription>View and manage active admin user sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter by IP address..."
                value={ipFilter}
                onChange={(e) => setIpFilter(e.target.value)}
                className="pl-9 dark:bg-gray-800 dark:border-gray-700"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="outline" onClick={handleSearch} className="dark:border-gray-700">
              Filter
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
            <>
              <div className="rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700 dark:bg-gray-800">
                      <TableHead className="dark:text-gray-400">User</TableHead>
                      <TableHead className="dark:text-gray-400">IP Address</TableHead>
                      <TableHead className="dark:text-gray-400">Browser</TableHead>
                      <TableHead className="dark:text-gray-400">Created</TableHead>
                      <TableHead className="dark:text-gray-400">Last Active</TableHead>
                      <TableHead className="dark:text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 dark:text-gray-400">
                          No active sessions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sessions.map((session) => (
                        <TableRow key={session.id} className="dark:border-gray-700">
                          <TableCell className="font-medium dark:text-white">
                            {session.userId}
                            {isCurrentSession(session) && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                Current
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{session.ipAddress}</TableCell>
                          <TableCell className="dark:text-gray-300">{session.userAgent.split(" ")[0]}</TableCell>
                          <TableCell className="dark:text-gray-300">{formatDate(session.createdAt)}</TableCell>
                          <TableCell className="dark:text-gray-300">{formatDate(session.lastActive)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {hasPermission("terminate:sessions") && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTerminateAllUserSessions(session.userId)}
                                    className="dark:border-gray-700"
                                  >
                                    All User Sessions
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleTerminateSession(session)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalSessions > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {sessions.length} of {totalSessions} active sessions
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || isLoading}
                      className="dark:border-gray-700 dark:text-white"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page * limit >= totalSessions || isLoading}
                      className="dark:border-gray-700 dark:text-white"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Terminate Session Dialog */}
      <Dialog open={isTerminateDialogOpen} onOpenChange={setIsTerminateDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Confirm Session Termination</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to terminate this session?
              {isCurrentSession(sessionToTerminate!) && " This is your current session and you will be logged out."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {sessionToTerminate && (
              <div className="flex items-center p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  You are about to terminate a session for user ID: <strong>{sessionToTerminate.userId}</strong>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTerminateDialogOpen(false)}
              className="dark:border-gray-600 dark:text-white"
              disabled={isTerminating}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmTerminateSession} disabled={isTerminating}>
              {isTerminating ? "Terminating..." : "Terminate Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate All User Sessions Dialog */}
      <Dialog open={isTerminateAllDialogOpen} onOpenChange={setIsTerminateAllDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Confirm Multiple Session Termination</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to terminate all sessions for this user?
              {userIdForTerminateAll === user?.id && " This includes your current session and you will be logged out."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {userIdForTerminateAll && (
              <div className="flex items-center p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  You are about to terminate all sessions for user ID: <strong>{userIdForTerminateAll}</strong>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTerminateAllDialogOpen(false)}
              className="dark:border-gray-600 dark:text-white"
              disabled={isTerminating}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmTerminateAllUserSessions} disabled={isTerminating}>
              {isTerminating ? "Terminating..." : "Terminate All Sessions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
