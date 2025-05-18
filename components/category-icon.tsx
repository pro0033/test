"use client"

import { Watch, Shirt, Briefcase, Footprints, Glasses, HardHat } from "lucide-react"

interface CategoryIconProps {
  name: string
  icon: string
  isSelected?: boolean
  onClick?: () => void
}

export default function CategoryIcon({ name, icon, isSelected = false, onClick }: CategoryIconProps) {
  const getIcon = () => {
    switch (icon) {
      case "watch":
        return <Watch size={24} />
      case "shirt":
        return <Shirt size={24} />
      case "briefcase":
        return <Briefcase size={24} />
      case "footprints":
        return <Footprints size={24} />
      case "glasses":
        return <Glasses size={24} />
      case "hat":
        return <HardHat size={24} />
      default:
        return <Shirt size={24} />
    }
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[60px] touch-target">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          isSelected ? "bg-sky-100 dark:bg-sky-900" : "bg-gray-100 dark:bg-gray-700"
        }`}
      >
        <span className={`${isSelected ? "text-sky-600 dark:text-sky-400" : "text-gray-700 dark:text-gray-200"}`}>
          {getIcon()}
        </span>
      </div>
      <span
        className={`text-xs text-center ${
          isSelected ? "font-medium text-sky-600 dark:text-sky-400" : "text-gray-700 dark:text-gray-200"
        }`}
      >
        {name}
      </span>
    </button>
  )
}
