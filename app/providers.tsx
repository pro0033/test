"use client"

import type React from "react"
import { AuthProvider } from "@/components/auth-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { PaymentProvider } from "@/components/payment-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <WishlistProvider>
          <PaymentProvider>{children}</PaymentProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
