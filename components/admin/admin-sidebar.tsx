"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  FileText,
} from "lucide-react"
import { useAdminAuth } from "@/components/admin/admin-auth-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { logout, user, hasPermission } = useAdminAuth()

  // Memoize toggle function to prevent recreation on each render
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  // Define nav items based on user permissions
  const getNavItems = () => {
    const items = [
      {
        title: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard size={20} />,
        permission: "view:dashboard",
      },
      {
        title: "Products",
        href: "/admin/products",
        icon: <Package size={20} />,
        permission: "view:products",
      },
      {
        title: "Orders",
        href: "/admin/orders",
        icon: <ShoppingCart size={20} />,
        permission: "view:orders",
      },
      {
        title: "Customers",
        href: "/admin/customers",
        icon: <Users size={20} />,
        permission: "view:customers",
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: <BarChart3 size={20} />,
        permission: "view:analytics",
      },
    ]

    // Add admin-only items
    if (user && (user.role === "super_admin" || user.role === "admin")) {
      items.push(
        {
          title: "Admin Users",
          href: "/admin/users",
          icon: <Shield size={20} />,
          permission: "view:admin_users",
        },
        {
          title: "Activity Logs",
          href: "/admin/activity-logs",
          icon: <FileText size={20} />,
          permission: "view:activity_logs",
        },
      )
    }

    items.push({
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />,
      permission: "view:settings",
    })

    // Filter items based on permissions
    return items.filter((item) => !user || hasPermission(item.permission))
  }

  const navItems = getNavItems()

  return (
    <div
      className={cn(
        "h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        {!collapsed && <h1 className="font-bold text-xl dark:text-white">Admin Panel</h1>}
        <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="ml-auto dark:text-gray-400">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mx-2",
                  pathname === item.href && "bg-gray-100 dark:bg-gray-700 font-medium text-sky-600 dark:text-sky-400",
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t dark:border-gray-700">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
            collapsed && "justify-center",
          )}
          onClick={logout}
        >
          <LogOut size={20} className="mr-3" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
