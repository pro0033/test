"use client"

import Link from "next/link"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Order Placed Successfully!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your purchase. Your order #12345 has been confirmed.
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-full mb-6">
          <h2 className="font-medium mb-2 dark:text-white">Order Details</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order #12345</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Estimated delivery: May 24-26, 2025</p>
        </div>
        <div className="space-y-4 w-full">
          <Button asChild className="w-full">
            <Link href="/profile/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Order
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
