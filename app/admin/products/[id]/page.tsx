import { ProductForm } from "@/components/admin/product-form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <ProductForm productId={params.id} />
    </div>
  )
}
