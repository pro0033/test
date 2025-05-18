import type { Product } from "@/lib/types"
import { products as initialProducts } from "@/lib/data"
import { logAdminActivity } from "@/lib/admin-logger"

// In a real app, this would be stored in a database
let products: Product[] = [...initialProducts].map((product, index) => ({
  ...product,
  stock: Math.floor(Math.random() * 100),
  sku: `SKU-${product.id.toString().padStart(6, "0")}`,
  status: Math.random() > 0.3 ? "in_stock" : Math.random() > 0.5 ? "out_of_stock" : "discontinued",
  featured: index < 3,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
}))

export function getProducts(
  filters?: {
    search?: string
    category?: string
    status?: string
    featured?: boolean
    minPrice?: number
    maxPrice?: number
  },
  sort?: {
    field: keyof Product
    direction: "asc" | "desc"
  },
  pagination?: {
    page: number
    limit: number
  },
): { products: Product[]; total: number } {
  let filteredProducts = [...products]

  // Apply filters
  if (filters) {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.brand?.toLowerCase().includes(search) ||
          product.sku?.toLowerCase().includes(search),
      )
    }

    if (filters.category && filters.category !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.category === filters.category)
    }

    if (filters.status && filters.status !== "all") {
      filteredProducts = filteredProducts.filter((product) => product.status === filters.status)
    }

    if (filters.featured !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.featured === filters.featured)
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price <= filters.maxPrice!)
    }
  }

  // Apply sorting
  if (sort) {
    filteredProducts.sort((a, b) => {
      const aValue = a[sort.field]
      const bValue = b[sort.field]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sort.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }

  // Get total before pagination
  const total = filteredProducts.length

  // Apply pagination
  if (pagination) {
    const { page, limit } = pagination
    const start = (page - 1) * limit
    const end = start + limit
    filteredProducts = filteredProducts.slice(start, end)
  }

  return { products: filteredProducts, total }
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id)
}

export function createProduct(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  actingUserId: string,
  actingUserName: string,
): Product {
  // Generate a new ID
  const newId = Math.max(...products.map((p) => p.id)) + 1

  const newProduct: Product = {
    ...productData,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Add to products array
  products = [...products, newProduct]

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "create",
    resource: "product",
    resourceId: newId.toString(),
    details: `Created new product: ${newProduct.name}`,
  })

  return newProduct
}

export function updateProduct(
  id: number,
  productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
  actingUserId: string,
  actingUserName: string,
): Product {
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex === -1) {
    throw new Error("Product not found")
  }

  // Update product
  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    updatedAt: new Date().toISOString(),
  }

  products = [...products.slice(0, productIndex), updatedProduct, ...products.slice(productIndex + 1)]

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "update",
    resource: "product",
    resourceId: id.toString(),
    details: `Updated product: ${updatedProduct.name}`,
  })

  return updatedProduct
}

export function deleteProduct(id: number, actingUserId: string, actingUserName: string): void {
  const product = getProductById(id)

  if (!product) {
    throw new Error("Product not found")
  }

  // Remove product from the array
  products = products.filter((product) => product.id !== id)

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "delete",
    resource: "product",
    resourceId: id.toString(),
    details: `Deleted product: ${product.name}`,
  })
}

export function getProductCategories(): string[] {
  return Array.from(new Set(products.map((product) => product.category)))
}

export function getProductBrands(): string[] {
  return Array.from(new Set(products.map((product) => product.brand || "")))
}

// Add the missing bulkDeleteProducts function
export function bulkDeleteProducts(productIds: number[], actingUserId: string, actingUserName: string): void {
  // Get products before deletion for logging
  const productsToDelete = products.filter((product) => productIds.includes(product.id))

  // Remove products from the array
  products = products.filter((product) => !productIds.includes(product.id))

  // Log the activity
  logAdminActivity({
    userId: actingUserId,
    userName: actingUserName,
    action: "delete",
    resource: "products",
    resourceId: productIds.join(","),
    details: `Bulk deleted ${productsToDelete.length} products`,
  })
}
