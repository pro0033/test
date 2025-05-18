"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/components/admin/admin-auth-provider"
import { ProductForm } from "@/components/admin/product-form"
import { useToast } from "@/components/ui/use-toast"
import { createProduct } from "@/lib/products"
import type { Product } from "@/lib/types"

export default function NewProductPage() {
  const { user, hasPermission } = useAdminAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has permission to create products
  if (!hasPermission("create:products")) {
    return (
      <div className="p-6 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
        <h1 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Access Denied</h1>
        <p className="text-red-600 dark:text-red-300">You don't have permission to create products.</p>
      </div>
    )
  }

  const handleSubmit = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      const newProduct = createProduct(productData, user.id, user.name)

      toast({
        title: "Product Created",
        description: `${newProduct.name} has been created successfully.`,
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <ProductForm isNew={true} />
    </div>
  )
}
