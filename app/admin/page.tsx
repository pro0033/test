"use client"

import { useState, useEffect, Suspense } from "react"
import { DollarSign, Package, ShoppingCart, TrendingUp, TrendingDown, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"
import { AdminRecentCustomers } from "@/components/admin/admin-recent-customers"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

// Dynamically import the chart component with no SSR to prevent hydration issues
const AdminSalesChart = dynamic(
  () => import("@/components/admin/admin-sales-chart").then((mod) => mod.AdminSalesChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Skeleton className="h-[250px] w-full" />
      </div>
    ),
  },
)

// Simple fallback component for Suspense
const LoadingFallback = () => <Skeleton className="h-40 w-full" />

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reduce loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="dark:border-gray-700 dark:text-white">
            Download Report
          </Button>
          <Button>New Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <div className="text-2xl font-bold dark:text-white">$45,231.89</div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-36 mt-1" />
            ) : (
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +20.1% from last month
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold dark:text-white">1,234</div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-36 mt-1" />
            ) : (
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <div className="text-2xl font-bold dark:text-white">512</div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-36 mt-1" />
            ) : (
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            )}
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold dark:text-white">3,567</div>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-36 mt-1" />
            ) : (
              <p className="text-xs text-red-500 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.5% from last month
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="dark:text-white">Sales Overview</CardTitle>
            <CardDescription>View your store's sales performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <Suspense fallback={<LoadingFallback />}>
                <AdminSalesChart />
              </Suspense>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Customers</CardTitle>
            <CardDescription>Latest customer registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Suspense fallback={<LoadingFallback />}>
                <AdminRecentCustomers />
              </Suspense>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <a href="/admin/customers">
                View All Customers
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-px w-full" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <Suspense fallback={<LoadingFallback />}>
                  <AdminRecentOrders />
                </Suspense>
              </TabsContent>
              <TabsContent value="pending">
                <Suspense fallback={<LoadingFallback />}>
                  <AdminRecentOrders status="pending" />
                </Suspense>
              </TabsContent>
              <TabsContent value="completed">
                <Suspense fallback={<LoadingFallback />}>
                  <AdminRecentOrders status="completed" />
                </Suspense>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" asChild>
            <a href="/admin/orders">
              View All Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
