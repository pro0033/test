"use client"

import { useState, memo } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Reduced data set for better performance
const mockSalesData = [
  { name: "Jan", revenue: 4000, orders: 240 },
  { name: "Feb", revenue: 3000, orders: 198 },
  { name: "Mar", revenue: 5000, orders: 320 },
  { name: "Apr", revenue: 2780, orders: 190 },
  { name: "May", revenue: 1890, orders: 140 },
  { name: "Jun", revenue: 2390, orders: 175 },
]

// Memoize the chart components to prevent unnecessary re-renders
const MemoizedLineChart = memo(({ data }: { data: typeof mockSalesData }) => (
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
        formatter={(value: number) => [`$${value}`, "Revenue"]}
      />
      <Legend />
      <Line type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={2} activeDot={{ r: 8 }} name="Revenue" />
    </LineChart>
  </ResponsiveContainer>
))
MemoizedLineChart.displayName = "MemoizedLineChart"

const MemoizedBarChart = memo(({ data }: { data: typeof mockSalesData }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
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
      />
      <Legend />
      <Bar dataKey="orders" fill="#0EA5E9" name="Orders" />
    </BarChart>
  </ResponsiveContainer>
))
MemoizedBarChart.displayName = "MemoizedBarChart"

export function AdminSalesChart() {
  const [period, setPeriod] = useState("month")

  // Filter data based on selected period - simplified for performance
  const getFilteredData = () => {
    if (period === "week") {
      return mockSalesData.slice(-3)
    } else if (period === "month") {
      return mockSalesData
    }
    return mockSalesData
  }

  const filteredData = getFilteredData()

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="revenue" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPeriod("week")}
                className={`px-3 py-1 text-sm rounded-md ${
                  period === "week"
                    ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-3 py-1 text-sm rounded-md ${
                  period === "month"
                    ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setPeriod("year")}
                className={`px-3 py-1 text-sm rounded-md ${
                  period === "year"
                    ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Year
              </button>
            </div>
          </div>

          <TabsContent value="revenue" className="mt-4">
            <div className="h-[300px]">
              <MemoizedLineChart data={filteredData} />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <div className="h-[300px]">
              <MemoizedBarChart data={filteredData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminSalesChart
