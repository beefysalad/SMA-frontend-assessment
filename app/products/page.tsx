"use client"

import ActionPill, {
  getActionPillClass,
} from "@/components/products/ActionPill"
import Card from "@/components/products/Card"
import DeleteProductModal from "@/components/products/DeleteProductModal"
import PageHeader from "@/components/products/PageHeader"
import StatusMessage from "@/components/products/StatusMessage"
import {
  useDeleteProductMutation,
  useProductsQuery,
} from "@/hooks/useProductQueries"
import useDebounce from "@/hooks/useDebounce"
import type { Product } from "@/lib/services/products"
import { useAuthStore } from "@/store/authStore"
import { useState } from "react"

export default function ProductsPage() {
  const authStore = useAuthStore()

  const deleteMutation = useDeleteProductMutation()

  const [page, setPage] = useState<number>(1)
  const LIMIT = 10
  const [search, setSearch] = useState<string>("")
  const debouncedSearch = useDebounce(search, 350)
  const [sortBy, setSortBy] = useState<"createdAt" | "price" | "name">(
    "createdAt"
  )
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handleSortByChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortBy(event.target.value as "createdAt" | "price" | "name")
    setPage(1)
  }

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortOrder(event.target.value as "asc" | "desc")
    setPage(1)
  }

  const productsQuery = useProductsQuery(
    {
      page,
      limit: LIMIT,
      search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      sortBy,
      sortOrder,
    },
    authStore.isAuthenticated
  )
  const products = productsQuery.data?.data || []
  const totalPages = productsQuery.data?.totalPages || 1

  return (
    <main className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <PageHeader
          title="Products"
          subtitle="Manage, sort, and review your catalog."
          actions={
            <a
              href="/products/new"
              className="inline-flex h-10 items-center rounded-xl border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
            >
              Add product
            </a>
          }
        />

        <Card className="mt-6 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[220px] flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={handleSortByChange}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </Card>

        {deleteTarget && (
          <DeleteProductModal
            product={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={(id) => {
              deleteMutation.mutate(id, {
                onSuccess: () => setDeleteTarget(null),
              })
            }}
          />
        )}

        <Card className="mt-6 overflow-hidden">
          <div className="border-b border-border px-5 py-4 text-sm font-semibold">
            Product list
          </div>
          {productsQuery.isLoading && (
            <div className="px-5 py-8">
              <StatusMessage variant="loading" message="Loading products..." />
            </div>
          )}
          {productsQuery.isError && (
            <div className="px-5 py-8">
              <StatusMessage
                variant="error"
                message="Failed to load products."
              />
            </div>
          )}
          {!productsQuery.isLoading && productsQuery.data && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Description</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border transition hover:bg-muted/30"
                    >
                      <td className="px-5 py-4 font-medium">{product.name}</td>
                      <td className="px-5 py-4">
                        PHP {Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {product.description || "-"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a href={`/products/${product.id}`}>
                            <span className={getActionPillClass()}>View</span>
                          </a>
                          <a href={`/products/${product.id}/edit`}>
                            <span className={getActionPillClass()}>Edit</span>
                          </a>
                          <ActionPill
                            type="button"
                            variant="danger"
                            onClick={() => {
                              setDeleteTarget(product)
                            }}
                          >
                            Delete
                          </ActionPill>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="px-5 py-8 text-sm text-muted-foreground">
                  No products yet.
                </div>
              )}
            </div>
          )}
        </Card>

        {productsQuery.data && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Page {productsQuery.data.page} of {productsQuery.data.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || productsQuery.isFetching}
                className="h-9 rounded-xl border border-border px-3 text-sm transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page >= totalPages || productsQuery.isFetching}
                className="h-9 rounded-xl border border-border px-3 text-sm transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
