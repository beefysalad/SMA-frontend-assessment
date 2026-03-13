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
    <main className="py-4">
      <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Product details</h1>
            <a
              href="/products"
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
              <div className="space-y-3">
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
                  className="mt-2 inline-flex h-9 items-center rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
                >
                  Edit
                </a>
              </div>
            </div>
          )}
      </div>
    </main>
  )
}
