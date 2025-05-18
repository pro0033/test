import Link from "next/link"
import { Home, Heart, ShoppingCart, User } from "lucide-react"

interface BottomNavProps {
  active: "home" | "favorites" | "cart" | "profile"
}

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 bottom-nav z-40">
      <div className="flex justify-around items-center">
        <Link
          href="/"
          className={`flex flex-col items-center touch-target ${active === "home" ? "text-sky-500 dark:text-sky-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/favorites"
          className={`flex flex-col items-center touch-target ${active === "favorites" ? "text-sky-500 dark:text-sky-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          <Heart size={24} />
          <span className="text-xs">Wishlist</span>
        </Link>
        <Link
          href="/cart"
          className={`flex flex-col items-center touch-target ${active === "cart" ? "text-sky-500 dark:text-sky-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          <ShoppingCart size={24} />
          <span className="text-xs">Cart</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center touch-target ${active === "profile" ? "text-sky-500 dark:text-sky-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
