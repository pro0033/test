import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonBanner() {
  return (
    <div className="rounded-lg p-4 mb-6 flex items-center justify-between bg-white dark:bg-gray-800">
      <div className="space-y-2 w-2/3">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-14 w-14 rounded-full" />
    </div>
  )
}
