"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomNav from "@/components/bottom-nav"

// Mock order details
const orderDetails = {
  id: "ORD-12345",
  date: "May 15, 2025",
  total: 1632.39,
  status: "Delivered",
  deliveryDate: "May 18, 2025",
  trackingNumber: "TRK-9876543210",
  shippingAddress: {
    name: "John Doe",
    street: "123 Main St, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
  },
  paymentMethod: "Credit Card ending in 3456",
  items: [
    {
      id: 1,
      name: "PEUGEOT - LR01",
      price: 1999.99,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "SMITH - Trade Road Helmet",
      price: 120.0,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    },
  ],
  subtotal: 2119.99,
  discount: 636.0,
  tax: 148.4,
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const [activeTab, setActiveTab] = useState("details")

  // In a real app, you would fetch the order details based on the ID
  const order = orderDetails

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Link href="/profile/orders" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft size={24} className="dark:text-gray-200" />
          </Link>
          <h1 className="font-bold text-lg dark:text-white">Order {orderId}</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Order Status */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold dark:text-white">Order Status</h2>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : order.status === "Shipped"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Order Tracking */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>

          <div className="relative z-10 flex mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <CheckCircle size={16} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium dark:text-white">Order Placed</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">May 15, 2025</p>
            </div>
          </div>

          <div className="relative z-10 flex mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <Package size={16} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium dark:text-white">Order Processed</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">May 16, 2025</p>
            </div>
          </div>

          <div className="relative z-10 flex mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <Truck size={16} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium dark:text-white">Shipped</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">May 17, 2025</p>
            </div>
          </div>

          <div className="relative z-10 flex">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <CheckCircle size={16} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium dark:text-white">Delivered</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">May 18, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "details"
                ? "border-b-2 border-sky-500 text-sky-600 dark:text-sky-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "items"
                ? "border-b-2 border-sky-500 text-sky-600 dark:text-sky-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("items")}
          >
            Items
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {activeTab === "details" ? (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-2 dark:text-white">Shipping Information</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-2 dark:text-white">Payment Method</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{order.paymentMethod}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-2 dark:text-white">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="dark:text-gray-200">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="text-green-600 dark:text-green-400">-${order.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="dark:text-gray-200">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t dark:border-gray-700">
                  <span className="dark:text-white">Total:</span>
                  <span className="text-sky-600 dark:text-sky-400">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex">
                <div className="w-1/4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1">
                  <h3 className="font-medium text-sm dark:text-white">{item.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Qty: {item.quantity}</p>
                    <p className="text-sky-600 dark:text-sky-400 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Button
                asChild
                variant="outline"
                className="w-full dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <Link href="/">Buy Again</Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="profile" />
    </div>
  )
}
