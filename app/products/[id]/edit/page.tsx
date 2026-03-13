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
    <main className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Catalog
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Edit product</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the details and keep your catalog current.
            </p>
          </div>
          <a
            href={`/products/${productId}`}
            className="text-sm font-medium underline-offset-4 hover:underline"
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
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
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
