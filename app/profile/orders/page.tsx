"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import BottomNav from "@/components/bottom-nav"

// Mock order data
const orders = [
  {
    id: "ORD-12345",
    date: "May 15, 2025",
    total: 1632.39,
    status: "Delivered",
    items: 3,
  },
  {
    id: "ORD-12344",
    date: "April 28, 2025",
    total: 299.99,
    status: "Shipped",
    items: 1,
  },
  {
    id: "ORD-12343",
    date: "April 10, 2025",
    total: 120.0,
    status: "Processing",
    items: 2,
  },
  {
    id: "ORD-12342",
    date: "March 22, 2025",
    total: 999.99,
    status: "Delivered",
    items: 1,
  },
]

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-bold text-lg">My Orders</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/profile/orders/${order.id}`}>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{order.id}</h3>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  <p>Order Date: {order.date}</p>
                  <p>
                    {order.items} {order.items === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="profile" />
    </div>
  )
}
