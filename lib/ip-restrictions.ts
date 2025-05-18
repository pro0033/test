import { logAdminActivity } from "@/lib/admin-logger"

// In a real app, this would be stored in a database
let globalAllowedIPs: string[] = []
let globalMode: "allowlist" | "denylist" = "allowlist"

export function getGlobalIPRestrictions(): { ips: string[]; mode: "allowlist" | "denylist" } {
  return {
    ips: [...globalAllowedIPs],
    mode: globalMode,
  }
}

export function updateGlobalIPRestrictions(
  ips: string[],
  mode: "allowlist" | "denylist",
  actingUserId: string,
  actingUserName: string,
): void {
  globalAllowedIPs = [...ips]
  globalMode = mode

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "ip_restrictions",
    details: `Updated global IP restrictions to ${mode} mode with ${ips.length} IPs`,
  })
}

export function addIPToGlobalRestrictions(
  ip: string,
  actingUserId: string,
  actingUserName: string,
): { ips: string[]; mode: "allowlist" | "denylist" } {
  if (!globalAllowedIPs.includes(ip)) {
    globalAllowedIPs = [...globalAllowedIPs, ip]

    // Log the activity
    logAdminActivity({
      userId: actingUserId,
      userName: actingUserName,
      action: "update",
      resource: "ip_restrictions",
      details: `Added IP ${ip} to global ${globalMode}`,
    })
  }

  return {
    ips: [...globalAllowedIPs],
    mode: globalMode,
  }
}

export function removeIPFromGlobalRestrictions(
  ip: string,
  actingUserId: string,
  actingUserName: string,
): { ips: string[]; mode: "allowlist" | "denylist" } {
  globalAllowedIPs = globalAllowedIPs.filter((allowedIP) => allowedIP !== ip)

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "ip_restrictions",
    details: `Removed IP ${ip} from global ${globalMode}`,
  })

  return {
    ips: [...globalAllowedIPs],
    mode: globalMode,
  }
}

export function updateUserIPRestrictions(
  userId: string,
  ips: string[],
  actingUserId: string,
  actingUserName: string,
): string[] {
  // In a real app, this would update the user's allowed IPs in the database

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "user_ip_restrictions",
    resourceId: userId,
    details: `Updated IP restrictions for user with ${ips.length} IPs`,
  })

  return [...ips]
}

export function isIPAllowed(ip: string, userAllowedIPs?: string[]): boolean {
  // If no restrictions are set, allow all
  if (globalAllowedIPs.length === 0 && (!userAllowedIPs || userAllowedIPs.length === 0)) {
    return true
  }

  // Check global restrictions
  if (globalMode === "allowlist") {
    if (globalAllowedIPs.length > 0 && !globalAllowedIPs.includes(ip)) {
      return false
    }
  } else {
    // Denylist mode
    if (globalAllowedIPs.includes(ip)) {
      return false
    }
  }

  // Check user-specific restrictions
  if (userAllowedIPs && userAllowedIPs.length > 0) {
    return userAllowedIPs.includes(ip)
  }

  return true
}

// Helper function to validate IP format
export function isValidIP(ip: string): boolean {
  // Basic IPv4 validation
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const match = ip.match(ipv4Regex)

  if (!match) {
    return false
  }

  // Check each octet is between 0 and 255
  for (let i = 1; i <= 4; i++) {
    const octet = Number.parseInt(match[i], 10)
    if (octet < 0 || octet > 255) {
      return false
    }
  }

  return true
}

// Helper function to validate CIDR notation
export function isValidCIDR(cidr: string): boolean {
  const parts = cidr.split("/")
  if (parts.length !== 2) {
    return false
  }

  const ip = parts[0]
  const prefix = Number.parseInt(parts[1], 10)

  return isValidIP(ip) && prefix >= 0 && prefix <= 32
}
