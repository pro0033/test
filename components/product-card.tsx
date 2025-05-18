"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import type { Product } from "@/types"
import { useWishlist } from "@/components/wishlist-provider"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
        <div className="relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-40 object-cover"
          />
          <button
            className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm"
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className={inWishlist ? "text-rose-500 fill-rose-500" : "text-gray-400 dark:text-gray-300"}
            />
          </button>
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-sm line-clamp-1 dark:text-white">{product.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 flex-1">{product.description}</p>
          <p className="text-sky-600 dark:text-sky-400 font-bold mt-2">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  )
}
