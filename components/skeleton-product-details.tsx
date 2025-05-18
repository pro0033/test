import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonProductDetails() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Product Image Skeleton */}
        <Skeleton className="h-72 sm:h-96 w-full" />

        {/* Product Info Skeleton */}
        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-7 w-1/4" />
          </div>

          <div className="flex items-center gap-1 mb-4">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16 ml-1" />
          </div>

          {/* Tabs Skeleton */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex">
              <Skeleton className="h-10 w-24 mr-4" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Quantity Skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-5 w-20" />
            <div className="flex items-center border rounded-md dark:border-gray-600">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <Skeleton className="h-12 w-full" />
        </div>
      </main>
    </div>
  )
}
