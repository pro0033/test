"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, Search, ShoppingBag, Home, Heart, ShoppingCart, User, X, ChevronDown, FilterX } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProductCard from "@/components/product-card"
import CategoryIcon from "@/components/category-icon"
import { products } from "@/lib/data"
import Image from "next/image"
import type { Product } from "@/types"
import { MobileThemeToggle } from "@/components/mobile-theme-toggle"
import { SkeletonProductCard } from "@/components/skeleton-product-card"
import { SkeletonCategoryIcon } from "@/components/skeleton-category-icon"
import { SkeletonBanner } from "@/components/skeleton-banner"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 4
  const [isLoading, setIsLoading] = useState(true)

  // Define categories with mapping to product categories
  const categories = [
    { name: "Bikes", icon: "briefcase", productCategory: "Bikes" },
    { name: "Accessories", icon: "glasses", productCategory: "Accessories" },
    { name: "Clothing", icon: "shirt", productCategory: "Clothing" },
    { name: "Shoes", icon: "footprints", productCategory: "Shoes" },
    { name: "Watches", icon: "watch", productCategory: "Watches" },
    { name: "Hats", icon: "hat", productCategory: "Hats" },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Add these state variables at the top of the component
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIconCategory, setSelectedIconCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState("all")
  const [productsData, setProductsData] = useState<Product[]>([])

  // Simulate loading data
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setProductsData(products)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedIconCategory, priceRange])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    // Filter products based on search query
    const results = productsData.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results)
    setIsSearching(false)
  }

  const handleCategoryIconClick = (category: string) => {
    if (selectedIconCategory === category) {
      // If clicking the already selected category, deselect it
      setSelectedIconCategory(null)
    } else {
      // Otherwise select the new category and reset the dropdown category filter
      setSelectedIconCategory(category)
      setSelectedCategory("all")
    }
  }

  const clearAllFilters = () => {
    setSelectedCategory("all")
    setSelectedIconCategory(null)
    setPriceRange("all")
  }

  // Update the currentProducts calculation to filter by category and price
  const filteredProducts = productsData.filter((product) => {
    // Icon Category filter (takes precedence)
    if (selectedIconCategory && product.category !== selectedIconCategory) {
      return false
    }

    // Dropdown Category filter (only if no icon category is selected)
    if (!selectedIconCategory && selectedCategory !== "all" && product.category !== selectedCategory) {
      return false
    }

    // Price filter
    if (priceRange === "under-100" && product.price >= 100) {
      return false
    } else if (priceRange === "100-500" && (product.price < 100 || product.price > 500)) {
      return false
    } else if (priceRange === "500-1000" && (product.price < 500 || product.price > 1000)) {
      return false
    } else if (priceRange === "over-1000" && product.price <= 1000) {
      return false
    }

    return true
  })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  // Check if any filters are active
  const isFiltering = selectedIconCategory !== null || selectedCategory !== "all" || priceRange !== "all"

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu size={24} className="dark:text-gray-200" />
          </button>
          <div className="flex items-center gap-2">
            <MobileThemeToggle />
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Search size={24} className="dark:text-gray-200" />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 animate-in fade-in slide-in-from-top duration-300">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 pr-10 dark:bg-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={handleSearch}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSearchResults([])
                    }}
                    className="absolute right-3 top-3"
                  >
                    <X size={18} className="text-gray-400 dark:text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {searchQuery && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {isSearching ? (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-2 rounded-lg">
                        <Skeleton className="h-12 w-12 rounded mr-3" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => setShowSearch(false)}
                      >
                        <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden mr-3">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm dark:text-gray-200">{product.name}</h3>
                          <p className="text-sky-600 dark:text-sky-400 text-xs">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500 dark:text-gray-400">No products found</div>
                )}
              </div>
            )}
          </div>
        )}

        {showMenu && (
          <div className="absolute top-16 left-0 w-3/4 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg p-4 z-50 animate-in slide-in-from-left duration-300">
            <div className="space-y-4">
              <Link
                href="/"
                className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-md"
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-md"
              >
                Categories
              </Link>
              <Link
                href="/deals"
                className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-md"
              >
                Deals
              </Link>
              <Link
                href="/profile"
                className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-md"
              >
                My Account
              </Link>
              <Link
                href="/orders"
                className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-md"
              >
                Orders
              </Link>
              <Link
                href="/wishlist"
                className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-md"
              >
                Wishlist
              </Link>
              <Link
                href="/settings"
                className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 rounded-md"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* User Greeting */}
        <div className="mb-4">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </>
          ) : (
            <>
              <div className="flex items-center">
                <h2 className="text-lg font-bold dark:text-white">Hello John 👋</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Let&apos;s start shopping!</p>
            </>
          )}
        </div>

        {/* Promo Banner */}
        {isLoading ? (
          <SkeletonBanner />
        ) : (
          <div className="bg-orange-500 dark:bg-orange-600 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-white font-medium">20% off during the weekends</h3>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-orange-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-orange-400 dark:hover:bg-gray-700"
              >
                GET NOW
              </Button>
            </div>
            <div className="flex items-center justify-center bg-orange-400 dark:bg-orange-500 rounded-full p-3">
              <ShoppingBag className="text-white h-8 w-8" />
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <>
                <h3 className="text-lg font-bold dark:text-white">Categories</h3>
                {selectedIconCategory && (
                  <button
                    onClick={() => setSelectedIconCategory(null)}
                    className="text-sm text-sky-600 dark:text-sky-400 font-medium flex items-center"
                  >
                    Clear
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => <SkeletonCategoryIcon key={index} />)
              : categories.map((category, index) => (
                  <CategoryIcon
                    key={index}
                    name={category.name}
                    icon={category.icon}
                    isSelected={selectedIconCategory === category.productCategory}
                    onClick={() => handleCategoryIconClick(category.productCategory)}
                  />
                ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            {isLoading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <>
                <h3 className="text-lg font-bold dark:text-white">
                  {selectedIconCategory ? `${selectedIconCategory}` : "All Products"}
                </h3>
                <div className="flex items-center gap-2">
                  {isFiltering && (
                    <button
                      onClick={clearAllFilters}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      aria-label="Clear all filters"
                    >
                      <FilterX size={18} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-sky-600 dark:text-sky-400 font-medium flex items-center"
                  >
                    Filter
                    <ChevronDown size={16} className={`ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </>
            )}
          </div>

          {showFilters && !isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4 animate-in fade-in slide-in-from-top duration-300">
              <h4 className="font-medium mb-3 dark:text-white">Categories</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all"
                    name="category"
                    value="all"
                    checked={selectedCategory === "all"}
                    onChange={() => setSelectedCategory("all")}
                    className="mr-2"
                    disabled={selectedIconCategory !== null}
                  />
                  <label
                    htmlFor="all"
                    className={`dark:text-gray-200 ${selectedIconCategory !== null ? "opacity-50" : ""}`}
                  >
                    All Products
                  </label>
                </div>
                {["Bikes", "Accessories", "Clothing", "Shoes"].map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="mr-2"
                      disabled={selectedIconCategory !== null}
                    />
                    <label
                      htmlFor={category}
                      className={`dark:text-gray-200 ${selectedIconCategory !== null ? "opacity-50" : ""}`}
                    >
                      {category}
                    </label>
                  </div>
                ))}
                {selectedIconCategory && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    Category filter is disabled while a category icon is selected
                  </p>
                )}
              </div>

              <h4 className="font-medium mt-4 mb-3 dark:text-white">Price Range</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-all"
                    name="price"
                    value="all"
                    checked={priceRange === "all"}
                    onChange={() => setPriceRange("all")}
                    className="mr-2"
                  />
                  <label htmlFor="price-all" className="dark:text-gray-200">
                    All Prices
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-under-100"
                    name="price"
                    value="under-100"
                    checked={priceRange === "under-100"}
                    onChange={() => setPriceRange("under-100")}
                    className="mr-2"
                  />
                  <label htmlFor="price-under-100" className="dark:text-gray-200">
                    Under $100
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-100-500"
                    name="price"
                    value="100-500"
                    checked={priceRange === "100-500"}
                    onChange={() => setPriceRange("100-500")}
                    className="mr-2"
                  />
                  <label htmlFor="price-100-500" className="dark:text-gray-200">
                    $100 - $500
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-500-1000"
                    name="price"
                    value="500-1000"
                    checked={priceRange === "500-1000"}
                    onChange={() => setPriceRange("500-1000")}
                    className="mr-2"
                  />
                  <label htmlFor="price-500-1000" className="dark:text-gray-200">
                    $500 - $1000
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="price-over-1000"
                    name="price"
                    value="over-1000"
                    checked={priceRange === "over-1000"}
                    onChange={() => setPriceRange("over-1000")}
                    className="mr-2"
                  />
                  <label htmlFor="price-over-1000" className="dark:text-gray-200">
                    Over $1000
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="flex-1 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Reset
                </Button>
                <Button size="sm" onClick={() => setShowFilters(false)} className="flex-1">
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <FilterX size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium dark:text-white mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your filters to find what you're looking for.
              </p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex justify-center items-center gap-2 my-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 p-0 ${
                  currentPage !== i + 1 ? "dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700" : ""
                }`}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Next
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 bottom-nav">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center text-sky-500 dark:text-sky-400">
            <Home size={24} />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/favorites" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <Heart size={24} />
            <span className="text-xs">Wishlist</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <ShoppingCart size={24} />
            <span className="text-xs">Cart</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <User size={24} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
