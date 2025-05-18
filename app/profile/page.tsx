"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronRight, LogOut, Settings, ShoppingBag, Star, User, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomNav from "@/components/bottom-nav"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (mounted) {
      setTheme(theme === "dark" ? "light" : "dark")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft size={24} className="dark:text-gray-200" />
          </Link>
          <h1 className="font-bold text-lg dark:text-white">My Profile</h1>
          <Link href="/settings" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={20} className="dark:text-gray-200" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 flex items-center">
          <div className="relative h-16 w-16 mr-4">
            <Image src="/placeholder-user.jpg" alt="User profile" fill className="rounded-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-lg dark:text-white">John Doe</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">john.doe@example.com</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Edit
          </Button>
        </div>

        {/* Account Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
          <h3 className="font-medium p-4 border-b dark:border-gray-700 dark:text-white">Account</h3>

          <Link
            href="/profile/personal-info"
            className="flex items-center justify-between p-4 border-b dark:border-gray-700"
          >
            <div className="flex items-center">
              <User size={20} className="text-gray-500 dark:text-gray-400 mr-3" />
              <span className="dark:text-gray-200">Personal Information</span>
            </div>
            <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
          </Link>

          <Link href="/profile/orders" className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center">
              <ShoppingBag size={20} className="text-gray-500 dark:text-gray-400 mr-3" />
              <span className="dark:text-gray-200">My Orders</span>
            </div>
            <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
          </Link>

          <Link href="/profile/reviews" className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center">
              <Star size={20} className="text-gray-500 dark:text-gray-400 mr-3" />
              <span className="dark:text-gray-200">My Reviews</span>
            </div>
            <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
          </Link>

          <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center">
              {mounted && theme === "dark" ? (
                <Sun size={20} className="text-gray-500 dark:text-gray-400 mr-3" />
              ) : (
                <Moon size={20} className="text-gray-500 dark:text-gray-400 mr-3" />
              )}
              <span className="dark:text-gray-200">
                {mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </span>
            </div>
            <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full relative">
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${mounted && theme === "dark" ? "translate-x-5 bg-sky-500" : "bg-white"}`}
              ></div>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-rose-500 border-rose-200 dark:border-rose-900 dark:text-rose-400"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="profile" />
    </div>
  )
}
