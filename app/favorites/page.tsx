"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import BottomNav from "@/components/bottom-nav"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function FavoritesPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId)
    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your wishlist",
      duration: 2000,
    })
  }

  const handleAddToCart = (productId: number) => {
    // In a real app, this would add to cart
    toast({
      title: "Added to cart",
      description: "The item has been added to your cart",
      duration: 2000,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ArrowLeft size={24} className="dark:text-gray-200" />
          </Link>
          <h1 className="font-bold text-lg dark:text-white">My Wishlist</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex">
                <Skeleton className="w-1/3 h-32" />
                <div className="p-3 flex-1 flex flex-col">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="mt-auto flex items-center justify-between">
                    <Skeleton className="h-6 w-16" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex">
                <div className="w-1/3 relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-medium text-sm dark:text-white">{product.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-sky-600 dark:text-sky-400 font-bold">${product.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        <Heart size={16} className="text-rose-500 fill-rose-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Heart size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-bold mb-2 dark:text-white">Your wishlist is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Save items you love to your wishlist and they'll appear here
            </p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav active="favorites" />
    </div>
  )
}
