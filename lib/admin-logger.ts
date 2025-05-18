import type { AdminActivityLog } from "@/lib/types"

// In a real app, this would be stored in a database
let activityLogs: AdminActivityLog[] = []

export function logAdminActivity(log: Omit<AdminActivityLog, "id" | "timestamp" | "ipAddress" | "userAgent">) {
  const newLog: AdminActivityLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    ipAddress: "127.0.0.1", // In a real app, you would get the actual IP
    userAgent: "Mozilla/5.0", // In a real app, you would get the actual user agent
  }

  activityLogs = [newLog, ...activityLogs].slice(0, 1000) // Keep only the last 1000 logs

  // In a real app, you would save this to a database
  console.log("Admin activity logged:", newLog)

  return newLog
}

// Add an alias for logAdminActivity to fix the error
export const logAdminAction = logAdminActivity

export function getAdminActivityLogs(
  filters?: {
    userId?: string
    action?: string
    resource?: string
    startDate?: string
    endDate?: string
  },
  pagination?: {
    page: number
    limit: number
  },
): { logs: AdminActivityLog[]; total: number } {
  let filteredLogs = [...activityLogs]

  // Apply filters
  if (filters) {
    if (filters.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
    }
    if (filters.action) {
      filteredLogs = filteredLogs.filter((log) => log.action === filters.action)
    }
    if (filters.resource) {
      filteredLogs = filteredLogs.filter((log) => log.resource === filters.resource)
    }
    if (filters.startDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate)
    }
    if (filters.endDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate)
    }
  }

  // Apply pagination
  const total = filteredLogs.length
  if (pagination) {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    filteredLogs = filteredLogs.slice(start, end)
  }

  return { logs: filteredLogs, total }
}

export function clearAdminActivityLogs() {
  activityLogs = []
}

export function exportLogsToCSV(filters?: {
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
}): string {
  const { logs } = getAdminActivityLogs(filters)

  // CSV header
  let csv = "ID,Timestamp,User ID,User Name,Action,Resource,Resource ID,Details,IP Address,User Agent\n"

  // Add rows
  logs.forEach((log) => {
    const row = [
      log.id,
      log.timestamp,
      log.userId,
      log.userName,
      log.action,
      log.resource,
      log.resourceId || "",
      log.details ? `"${log.details.replace(/"/g, '""')}"` : "",
      log.ipAddress || "",
      log.userAgent || "",
    ]
    csv += row.join(",") + "\n"
  })

  return csv
}

export function exportLogsToPDF(filters?: {
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
}): Blob {
  // In a real app, you would generate a PDF file
  // For this demo, we'll just return a mock Blob
  const { logs } = getAdminActivityLogs(filters)
  const content = JSON.stringify(logs, null, 2)
  return new Blob([content], { type: "application/pdf" })
}
