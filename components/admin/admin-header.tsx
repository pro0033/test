"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminAuth } from "@/components/admin/admin-auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const { theme, setTheme } = useTheme()
  const { user } = useAdminAuth()

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? (
                <Sun size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-medium mr-2">
            {user?.name.charAt(0)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
