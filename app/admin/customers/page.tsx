"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, MoreHorizontal, Eye, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

interface Customer {
  id: string
  name: string
  email: string
  joinedDate: string
  ordersCount: number
  totalSpent: number
}

// Mock customers data
const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: "May 15, 2025",
    ordersCount: 5,
    totalSpent: 1250.75,
  },
  {
    id: "cust-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    joinedDate: "May 14, 2025",
    ordersCount: 3,
    totalSpent: 450.25,
  },
  {
    id: "cust-3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    joinedDate: "May 13, 2025",
    ordersCount: 1,
    totalSpent: 120.0,
  },
  {
    id: "cust-4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    joinedDate: "May 12, 2025",
    ordersCount: 2,
    totalSpent: 350.5,
  },
  {
    id: "cust-5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    joinedDate: "May 11, 2025",
    ordersCount: 4,
    totalSpent: 780.3,
  },
  {
    id: "cust-6",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    joinedDate: "May 10, 2025",
    ordersCount: 2,
    totalSpent: 320.45,
  },
  {
    id: "cust-7",
    name: "David Miller",
    email: "david.miller@example.com",
    joinedDate: "May 9, 2025",
    ordersCount: 6,
    totalSpent: 1560.8,
  },
  {
    id: "cust-8",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    joinedDate: "May 8, 2025",
    ordersCount: 3,
    totalSpent: 670.25,
  },
]

export default function AdminCustomersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setCustomers(mockCustomers)
      setFilteredCustomers(mockCustomers)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter customers based on search query
    if (searchQuery) {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchQuery, customers])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Customers</h1>
        <Button>Add Customer</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:border-gray-700">
                <Filter className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Name: A to Z</DropdownMenuItem>
              <DropdownMenuItem>Name: Z to A</DropdownMenuItem>
              <DropdownMenuItem>Date Joined: Newest First</DropdownMenuItem>
              <DropdownMenuItem>Date Joined: Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Total Spent: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Total Spent: Low to High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Joined</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Orders</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Total Spent</th>
                <th className="text-right py-4 px-6 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-4 px-6">
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-8" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                      </td>
                    </tr>
                  ))
                : filteredCustomers.length > 0 &&
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b dark:border-gray-700">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium dark:text-white">{customer.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{customer.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{customer.joinedDate}</td>
                      <td className="py-4 px-6 dark:text-white">{customer.ordersCount}</td>
                      <td className="py-4 px-6 dark:text-white">${customer.totalSpent.toFixed(2)}</td>
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
                              <Link href={`/admin/customers/${customer.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
              {!isLoading && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
