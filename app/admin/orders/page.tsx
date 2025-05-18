"use client"

import type React from "react"

import { useState, useEffect, useCallback, memo } from "react"
import Link from "next/link"
import { Search, Filter, MoreHorizontal, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

interface Order {
  id: string
  customer: string
  email: string
  date: string
  total: number
  status: OrderStatus
  items: number
  paymentMethod: string
}

// Reduced mock data for better performance
const mockOrders: Order[] = [
  {
    id: "ORD-12345",
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "May 15, 2025",
    total: 1632.39,
    status: "completed",
    items: 3,
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-12344",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    date: "May 14, 2025",
    total: 299.99,
    status: "processing",
    items: 1,
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-12343",
    customer: "Robert Johnson",
    email: "robert.johnson@example.com",
    date: "May 13, 2025",
    total: 120.0,
    status: "pending",
    items: 2,
    paymentMethod: "Apple Pay",
  },
  {
    id: "ORD-12342",
    customer: "Emily Davis",
    email: "emily.davis@example.com",
    date: "May 12, 2025",
    total: 999.99,
    status: "completed",
    items: 1,
    paymentMethod: "Credit Card",
  },
]

// Memoized order row component
const OrderRow = memo(
  ({ order, getStatusColor }: { order: Order; getStatusColor: (status: OrderStatus) => string }) => (
    <tr key={order.id} className="border-b dark:border-gray-700">
      <td className="py-4 px-6 dark:text-white">{order.id}</td>
      <td className="py-4 px-6">
        <div>
          <p className="font-medium dark:text-white">{order.customer}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{order.email}</p>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{order.date}</td>
      <td className="py-4 px-6 dark:text-white">${order.total.toFixed(2)}</td>
      <td className="py-4 px-6">
        <Badge className={getStatusColor(order.status)} variant="outline">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </td>
      <td className="py-4 px-6 text-right">
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

export default function AdminOrdersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    // Simulate data loading with shorter timeout
    const timer = setTimeout(() => {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Memoize search handler to prevent recreation on each render
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  // Filter orders when search query or active tab changes
  useEffect(() => {
    if (!orders.length) return

    let filtered = orders

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab)
    }

    setFilteredOrders(filtered)
  }, [searchQuery, activeTab, orders])

  const getStatusColor = useCallback((status: OrderStatus) => {
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
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Orders</h1>
        <Button variant="outline" className="dark:border-gray-700">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:border-gray-700">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Date: Newest First</DropdownMenuItem>
              <DropdownMenuItem>Date: Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Total: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Total: Low to High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="p-4 border-b dark:border-gray-700">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0">
            <OrdersTable orders={filteredOrders} isLoading={isLoading} getStatusColor={getStatusColor} />
          </TabsContent>
          <TabsContent value="pending" className="p-0">
            <OrdersTable orders={filteredOrders} isLoading={isLoading} getStatusColor={getStatusColor} />
          </TabsContent>
          <TabsContent value="processing" className="p-0">
            <OrdersTable orders={filteredOrders} isLoading={isLoading} getStatusColor={getStatusColor} />
          </TabsContent>
          <TabsContent value="completed" className="p-0">
            <OrdersTable orders={filteredOrders} isLoading={isLoading} getStatusColor={getStatusColor} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface OrdersTableProps {
  orders: Order[]
  isLoading: boolean
  getStatusColor: (status: OrderStatus) => string
}

function OrdersTable({ orders, isLoading, getStatusColor }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
            <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Customer</th>
            <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Date</th>
            <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Total</th>
            <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Status</th>
            <th className="text-right py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton className="h-6 w-20" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </td>
                </tr>
              ))
            : orders.length > 0 &&
              orders.map((order) => <OrderRow key={order.id} order={order} getStatusColor={getStatusColor} />)}
          {!isLoading && orders.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
