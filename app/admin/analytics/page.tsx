"use client"

import { useState, useEffect, memo } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Reduced data for better performance
const salesByCategory = [
  { name: "Bikes", value: 45 },
  { name: "Accessories", value: 25 },
  { name: "Clothing", value: 15 },
  { name: "Shoes", value: 10 },
]

// Reduced data for monthly sales
const monthlySales = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 2390 },
]

// Reduced data for customer acquisition
const customerAcquisition = [
  { name: "Jan", new: 120, returning: 80 },
  { name: "Feb", new: 100, returning: 70 },
  { name: "Mar", new: 140, returning: 90 },
  { name: "Apr", new: 110, returning: 85 },
  { name: "May", new: 90, returning: 75 },
  { name: "Jun", new: 105, returning: 80 },
]

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

// Memoized chart components
const MemoizedPieChart = memo(({ data }: { data: typeof salesByCategory }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number) => [`${value}%`, "Percentage"]}
        contentStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "0.5rem",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
))
MemoizedPieChart.displayName = "MemoizedPieChart"

const MemoizedLineChart = memo(({ data }: { data: typeof monthlySales }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
      <XAxis dataKey="name" stroke="#6B7280" />
      <YAxis stroke="#6B7280" />
      <Tooltip
        contentStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "0.5rem",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        formatter={(value: number) => [`$${value}`, "Sales"]}
      />
      <Legend />
      <Line type="monotone" dataKey="sales" stroke="#0EA5E9" strokeWidth={2} activeDot={{ r: 8 }} name="Sales" />
    </LineChart>
  </ResponsiveContainer>
))
MemoizedLineChart.displayName = "MemoizedLineChart"

const MemoizedBarChart = memo(({ data }: { data: typeof customerAcquisition }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
      <XAxis dataKey="name" stroke="#6B7280" />
      <YAxis stroke="#6B7280" />
      <Tooltip
        contentStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "0.5rem",
          border: "none",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      />
      <Legend />
      <Bar dataKey="new" fill="#0EA5E9" name="New Customers" />
      <Bar dataKey="returning" fill="#10B981" name="Returning Customers" />
    </BarChart>
  </ResponsiveContainer>
))
MemoizedBarChart.displayName = "MemoizedBarChart"

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    // Simulate data loading with shorter timeout
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Analytics</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant={period === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("week")}
            className={period !== "week" ? "dark:border-gray-700" : ""}
          >
            Week
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("month")}
            className={period !== "month" ? "dark:border-gray-700" : ""}
          >
            Month
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <MemoizedLineChart data={monthlySales} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="dark:text-white">Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <MemoizedPieChart data={salesByCategory} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Customer Acquisition</CardTitle>
          <CardDescription>New vs. returning customers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <Tabs defaultValue="chart">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chart">
                <div className="h-[300px]">
                  <MemoizedBarChart data={customerAcquisition} />
                </div>
              </TabsContent>

              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Month</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          New Customers
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Returning Customers
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerAcquisition.map((data) => (
                        <tr key={data.name} className="border-b dark:border-gray-700">
                          <td className="py-3 px-4 dark:text-white">{data.name}</td>
                          <td className="py-3 px-4 dark:text-white">{data.new}</td>
                          <td className="py-3 px-4 dark:text-white">{data.returning}</td>
                          <td className="py-3 px-4 dark:text-white">{data.new + data.returning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
