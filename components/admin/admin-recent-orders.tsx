"use client"

import { useState, memo } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye } from "lucide-react"

type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

interface Order {
  id: string
  customer: string
  date: string
  total: number
  status: OrderStatus
  items: number
}

// Reduced mock data for better performance
const mockOrders: Order[] = [
  {
    id: "ORD-12345",
    customer: "John Doe",
    date: "May 15, 2025",
    total: 1632.39,
    status: "completed",
    items: 3,
  },
  {
    id: "ORD-12344",
    customer: "Jane Smith",
    date: "May 14, 2025",
    total: 299.99,
    status: "processing",
    items: 1,
  },
  {
    id: "ORD-12343",
    customer: "Robert Johnson",
    date: "May 13, 2025",
    total: 120.0,
    status: "pending",
    items: 2,
  },
  {
    id: "ORD-12342",
    customer: "Emily Davis",
    date: "May 12, 2025",
    total: 999.99,
    status: "completed",
    items: 1,
  },
]

interface AdminRecentOrdersProps {
  status?: OrderStatus
}

// Memoized order row component to prevent unnecessary re-renders
const OrderRow = memo(
  ({ order, getStatusColor }: { order: Order; getStatusColor: (status: OrderStatus) => string }) => (
    <tr key={order.id} className="border-b dark:border-gray-700">
      <td className="py-3 px-4 dark:text-white">{order.id}</td>
      <td className="py-3 px-4 dark:text-white">{order.customer}</td>
      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{order.date}</td>
      <td className="py-3 px-4 dark:text-white">${order.total.toFixed(2)}</td>
      <td className="py-3 px-4">
        <Badge className={getStatusColor(order.status)} variant="outline">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Mark as Processing</DropdownMenuItem>
            <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 dark:text-red-400">Cancel Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  ),
)
OrderRow.displayName = "OrderRow"

export function AdminRecentOrders({ status }: AdminRecentOrdersProps) {
  const [orders] = useState<Order[]>(mockOrders)

  // Filter orders by status if provided
  const filteredOrders = status ? orders.filter((order) => order.status === status) : orders

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Customer</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Total</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => <OrderRow key={order.id} order={order} getStatusColor={getStatusColor} />)
          ) : (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-400">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
