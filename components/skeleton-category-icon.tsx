import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCategoryIcon() {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[60px]">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}
