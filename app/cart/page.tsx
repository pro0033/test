"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomNav from "@/components/bottom-nav"
import { Skeleton } from "@/components/ui/skeleton"

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "PEUGEOT - LR01",
      price: 1999.99,
      image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
    },
    {
      id: 2,
      name: "PILOT - CHROMOLY 520",
      price: 999.99,
      image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
    },
    {
      id: 3,
      name: "SMITH - Trade",
      price: 120,
      image: "/placeholder.svg?height=100&width=100",
      quantity: 1,
    },
  ])

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const incrementQuantity = (id: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decrementQuantity = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)),
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal * 0.3 // 30% discount
  const total = subtotal - discount

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-bold text-lg">My Shopping Cart</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Cart Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center p-4 border-b dark:border-gray-700 last:border-b-0">
                  <Skeleton className="h-16 w-16 rounded-lg mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
              ))
            : cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-4 border-b dark:border-gray-700 last:border-b-0">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mr-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm dark:text-white">{item.name}</h3>
                    <p className="text-sky-600 dark:text-sky-400 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center border rounded-md dark:border-gray-600">
                    <button onClick={() => decrementQuantity(item.id)} className="px-2 py-1">
                      <Minus size={14} className="dark:text-gray-300" />
                    </button>
                    <span className="px-2 py-1 text-sm dark:text-white">{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item.id)} className="px-2 py-1">
                      <Plus size={14} className="dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* Promo Code */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
          {isLoading ? (
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium dark:text-white">Add Promo Code</span>
              <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between pt-2 border-t dark:border-gray-700">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold mb-3 dark:text-white">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Fee:</span>
                  <span className="dark:text-white">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Discount (30%):</span>
                  <span className="text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t dark:border-gray-700">
                  <span className="dark:text-white">Total:</span>
                  <span className="text-sky-600 dark:text-sky-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Button */}
        {isLoading ? <Skeleton className="h-10 w-full" /> : <Button className="w-full">Proceed to Checkout</Button>}
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="cart" />
    </div>
  )
}
