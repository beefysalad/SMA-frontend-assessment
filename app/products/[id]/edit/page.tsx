"use client"

import { useParams } from "next/navigation"
import ProductForm from "@/components/products/ProductForm"
import StatusMessage from "@/components/products/StatusMessage"
import { useProductQuery } from "@/hooks/useProductQueries"

export default function ProductEditPage() {
  const { id } = useParams()
  const productId = Number(id)
  const canFetch = Number.isFinite(productId)
  const productQuery = useProductQuery(productId, canFetch)

  return (
    <main className="py-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Edit product</h1>
          <a
            href={`/products/${productId}`}
            className="text-sm underline-offset-4 hover:underline"
          >
            Back
          </a>
        </div>

        {productQuery.isLoading && (
          <StatusMessage
            variant="loading"
            message="Loading product..."
            className="mt-4"
          />
        )}
        {productQuery.isError && (
          <StatusMessage
            variant="error"
            message="Failed to load product."
            className="mt-4"
          />
        )}

        {productQuery.data && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <ProductForm
              product={productQuery.data}
              onCancel={() => (window.location.href = `/products/${productId}`)}
              onSuccess={() => (window.location.href = `/products/${productId}`)}
            />
          </div>
        )}
      </div>
    </main>
  )
}
