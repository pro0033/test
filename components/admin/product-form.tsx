"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save, Trash2, ArrowLeft, ImageIcon } from "lucide-react"
import type { Product } from "@/lib/types"
import { createProduct, updateProduct, getProductCategories } from "@/lib/products"
import { useAdminAuth } from "@/components/admin/admin-auth-provider"

interface ProductFormProps {
  product?: Product
  isEditing?: boolean
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  // Form state
  const [formData, setFormData] = useState<Omit<Product, "id" | "createdAt" | "updatedAt">>({
    name: "",
    price: 0,
    description: "",
    category: "",
    image: "/placeholder.svg?height=200&width=200",
    stock: 0,
    rating: 0,
    reviews: 0,
    featured: false,
    colors: [],
    sizes: [],
  })

  // Color and size inputs
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")

  // Load product data if editing
  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        stock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured,
        colors: [...product.colors],
        sizes: [...product.sizes],
      })
    }

    // Load categories
    const loadCategories = async () => {
      try {
        const cats = await getProductCategories()
        setCategories(cats)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    loadCategories()
  }, [product, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle numeric inputs
    if (["price", "stock", "rating", "reviews"].includes(name)) {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      featured: checked,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor],
      })
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== color),
    })
  }

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize],
      })
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== size),
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server or cloud storage
      // For this example, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        image: imageUrl,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (isEditing && product) {
        // Update existing product
        await updateProduct(product.id, formData, user.id)
        toast({
          title: "Product Updated",
          description: `${formData.name} has been updated successfully`,
        })
      } else {
        // Create new product
        await createProduct(formData, user.id)
        toast({
          title: "Product Created",
          description: `${formData.name} has been added to the catalog`,
        })
      }

      // Navigate back to products list
      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} product. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this product?")) {
                    // Handle delete logic
                    router.push("/admin/products")
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the essential details for this product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={handleSelectChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured" checked={formData.featured} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Add additional information about the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={handleInputChange}
                      placeholder="0.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviews">Number of Reviews</Label>
                    <Input
                      id="reviews"
                      name="reviews"
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="relative w-full h-40 mb-4">
                        <div
                          className="w-full h-full bg-center bg-cover rounded-md"
                          style={{ backgroundImage: `url(${formData.image})` }}
                        />
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>

                    <div className="border rounded-md p-4">
                      <Label htmlFor="image-url">Or enter image URL</Label>
                      <Input
                        id="image-url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>Add available colors and sizes for this product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Available Colors</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.colors.map((color) => (
                      <Badge key={color} variant="outline" className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }} />
                        {color}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeColor(color)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add a color (e.g., red, #FF0000)"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addColor}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.sizes.map((size) => (
                      <Badge key={size} variant="outline" className="flex items-center gap-1">
                        {size}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeSize(size)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Add a size (e.g., S, M, L, XL)"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addSize}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  )
}
