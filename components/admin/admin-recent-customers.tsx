"use client"

import { useState, memo } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Customer {
  id: string
  name: string
  email: string
  joinedDate: Date
  ordersCount: number
  totalSpent: number
}

// Reduced mock data for better performance
const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: new Date(2025, 4, 15),
    ordersCount: 5,
    totalSpent: 1250.75,
  },
  {
    id: "cust-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    joinedDate: new Date(2025, 4, 14),
    ordersCount: 3,
    totalSpent: 450.25,
  },
  {
    id: "cust-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    joinedDate: new Date(2025, 4, 13),
    ordersCount: 1,
    totalSpent: 120.0,
  },
]

// Memoized customer item component
const CustomerItem = memo(({ customer }: { customer: Customer }) => (
  <Link
    key={customer.id}
    href={`/admin/customers/${customer.id}`}
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400 font-medium">
      {customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium truncate dark:text-white">{customer.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Joined {formatDistanceToNow(customer.joinedDate, { addSuffix: true })}
      </p>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium dark:text-white">${customer.totalSpent.toFixed(2)}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{customer.ordersCount} orders</p>
    </div>
  </Link>
))
CustomerItem.displayName = "CustomerItem"

export function AdminRecentCustomers() {
  const [customers] = useState<Customer[]>(mockCustomers)

  // Get only the 3 most recent customers
  const recentCustomers = [...customers].sort((a, b) => b.joinedDate.getTime() - a.joinedDate.getTime()).slice(0, 3)

  return (
    <div className="space-y-4">
      {recentCustomers.map((customer) => (
        <CustomerItem key={customer.id} customer={customer} />
      ))}
    </div>
  )
}
