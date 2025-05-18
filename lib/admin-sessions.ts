import { logAdminAction } from "./admin-logger"

// Session types
export interface AdminSession {
  id: string
  userId: string
  username: string
  userAgent: string
  ipAddress: string
  startTime: string
  lastActivity: string
  expiresAt: string
  isActive: boolean
}

// Mock database for admin sessions
const adminSessions: AdminSession[] = [
  {
    id: "1",
    userId: "admin1",
    username: "admin",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    ipAddress: "192.168.1.100",
    startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    lastActivity: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    isActive: true,
  },
  {
    id: "2",
    userId: "editor1",
    username: "editor",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    ipAddress: "192.168.1.101",
    startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    lastActivity: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    expiresAt: new Date(Date.now() + 1800000).toISOString(), // 30 minutes from now
    isActive: true,
  },
]

// Get all active sessions
export async function getActiveSessions() {
  // Clean up expired sessions first
  cleanupExpiredSessions()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return adminSessions.filter((s) => s.isActive)
}

// Get sessions for a specific user
export async function getUserSessions(userId: string) {
  // Clean up expired sessions first
  cleanupExpiredSessions()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return adminSessions.filter((s) => s.userId === userId)
}

// Create a new session
export async function createSession(
  userId: string,
  username: string,
  userAgent: string,
  ipAddress: string,
  durationInMinutes = 60,
): Promise<AdminSession> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + durationInMinutes * 60000)

  const newSession: AdminSession = {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    username,
    userAgent,
    ipAddress,
    startTime: now.toISOString(),
    lastActivity: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isActive: true,
  }

  adminSessions.push(newSession)

  // Log the action
  await logAdminAction({
    userId,
    action: "login",
    resource: "session",
    resourceId: newSession.id,
    details: `User logged in from ${ipAddress}`,
  })

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return newSession
}

// Update session activity
export async function updateSessionActivity(sessionId: string): Promise<AdminSession | null> {
  const sessionIndex = adminSessions.findIndex((s) => s.id === sessionId)

  if (sessionIndex === -1 || !adminSessions[sessionIndex].isActive) {
    return null
  }

  adminSessions[sessionIndex].lastActivity = new Date().toISOString()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return adminSessions[sessionIndex]
}

// Terminate a session
export async function terminateSession(sessionId: string, terminatedBy: string): Promise<AdminSession | null> {
  const sessionIndex = adminSessions.findIndex((s) => s.id === sessionId)

  if (sessionIndex === -1) {
    return null
  }

  const session = adminSessions[sessionIndex]
  session.isActive = false

  // Log the action
  await logAdminAction({
    userId: terminatedBy,
    action: "logout",
    resource: "session",
    resourceId: sessionId,
    details: `Session terminated for user ${session.username}`,
  })

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return session
}

// Terminate all sessions for a user
export async function terminateAllUserSessions(userId: string, terminatedBy: string): Promise<number> {
  const userSessions = adminSessions.filter((s) => s.userId === userId && s.isActive)

  for (const session of userSessions) {
    session.isActive = false

    // Log each termination
    await logAdminAction({
      userId: terminatedBy,
      action: "logout",
      resource: "session",
      resourceId: session.id,
      details: `Session terminated for user ${session.username}`,
    })
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return userSessions.length
}

// Terminate all sessions except the current one
export async function terminateOtherSessions(userId: string, currentSessionId: string): Promise<number> {
  const otherSessions = adminSessions.filter((s) => s.userId === userId && s.id !== currentSessionId && s.isActive)

  for (const session of otherSessions) {
    session.isActive = false

    // Log each termination
    await logAdminAction({
      userId,
      action: "logout",
      resource: "session",
      resourceId: session.id,
      details: `Session terminated by user from another session`,
    })
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return otherSessions.length
}

// Clean up expired sessions
function cleanupExpiredSessions() {
  const now = new Date()

  adminSessions.forEach((session) => {
    if (session.isActive && new Date(session.expiresAt) < now) {
      session.isActive = false
    }
  })
}

// Extend session duration
export async function extendSessionDuration(sessionId: string, additionalMinutes = 60): Promise<AdminSession | null> {
  const sessionIndex = adminSessions.findIndex((s) => s.id === sessionId)

  if (sessionIndex === -1 || !adminSessions[sessionIndex].isActive) {
    return null
  }

  const session = adminSessions[sessionIndex]
  const currentExpiry = new Date(session.expiresAt)
  const newExpiry = new Date(currentExpiry.getTime() + additionalMinutes * 60000)

  session.expiresAt = newExpiry.toISOString()
  session.lastActivity = new Date().toISOString()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return session
}

// Get session by ID
export async function getSessionById(sessionId: string): Promise<AdminSession | null> {
  // Clean up expired sessions first
  cleanupExpiredSessions()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const session = adminSessions.find((s) => s.id === sessionId)
  return session || null
}
