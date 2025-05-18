"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, Star, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/data"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/components/ui/use-toast"
import { SkeletonProductDetails } from "@/components/skeleton-product-details"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const foundProduct = products.find((p) => p.id === Number.parseInt(params.id)) || products[0]
      setProduct(foundProduct)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [params.id])

  if (isLoading) {
    return <SkeletonProductDetails />
  }

  const inWishlist = isInWishlist(product.id)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist",
        duration: 2000,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist",
        duration: 2000,
      })
    }
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart`,
      duration: 2000,
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-target">
            <ArrowLeft size={24} className="dark:text-gray-200" />
          </Link>
          <h1 className="font-bold text-lg truncate max-w-[60%] dark:text-white">{product.name}</h1>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-target">
              <Share2 size={20} className="dark:text-gray-200" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
              onClick={handleWishlistToggle}
            >
              <Heart
                size={20}
                className={inWishlist ? "text-rose-500 fill-rose-500" : "text-gray-500 dark:text-gray-300"}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Product Images */}
        <div className="relative h-72 sm:h-96">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold dark:text-white">{product.name}</h2>
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">${product.price.toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                }
              />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({product.reviews} reviews)</span>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex">
              <button
                className={`py-2 px-4 text-sm font-medium touch-target ${
                  activeTab === "description"
                    ? "border-b-2 border-sky-500 text-sky-600 dark:text-sky-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium touch-target ${
                  activeTab === "specification"
                    ? "border-b-2 border-sky-500 text-sky-600 dark:text-sky-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("specification")}
              >
                Specification
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-6">
            {activeTab === "description" ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p>
                  <strong>Material:</strong> {product.material}
                </p>
                <p>
                  <strong>Weight:</strong> {product.weight}
                </p>
                <p>
                  <strong>Dimensions:</strong> {product.dimensions}
                </p>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium dark:text-white">Quantity:</span>
            <div className="flex items-center border rounded-md dark:border-gray-600">
              <button onClick={decrementQuantity} className="px-3 py-1 border-r dark:border-gray-600 touch-target">
                <Minus size={16} className="dark:text-gray-300" />
              </button>
              <span className="px-4 py-1 dark:text-white">{quantity}</span>
              <button onClick={incrementQuantity} className="px-3 py-1 border-l dark:border-gray-600 touch-target">
                <Plus size={16} className="dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full gap-2 h-12" onClick={handleAddToCart}>
            <ShoppingCart size={18} />
            Add to Cart
          </Button>
        </div>
      </main>
    </div>
  )
}
