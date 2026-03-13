"use client"

import { useParams } from "next/navigation"
import StatusMessage from "@/components/products/StatusMessage"
import { useAuthStore } from "@/store/authStore"
import { useProductQuery } from "@/hooks/useProductQueries"

export default function ProductDetailPage() {
  const { id } = useParams()
  const authStore = useAuthStore()
  const productId = Number(id)

  const productQuery = useProductQuery(
    Number.isFinite(productId) ? productId : 0,
    authStore.isAuthenticated && Number.isFinite(productId)
  )

  return (
    <main className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Catalog
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Product details</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review the latest information for this product.
            </p>
          </div>
          <a
            href="/products"
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
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-base font-medium">
                  {productQuery.data.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-base font-medium">
                  PHP {Number(productQuery.data.price).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm text-muted-foreground">
                  {productQuery.data.description || "-"}
                </p>
              </div>
              <a
                href={`/products/${productQuery.data.id}/edit`}
                className="mt-2 inline-flex h-10 items-center rounded-xl border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                Edit product
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
