import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonProductCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      <div className="relative">
        <Skeleton className="w-full h-40" />
        <div className="absolute top-2 right-2 p-1.5">
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-5 w-1/3 mt-auto" />
      </div>
    </div>
  )
}
