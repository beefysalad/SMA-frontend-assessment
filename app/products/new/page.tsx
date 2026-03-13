"use client"

import ProductForm from "@/components/products/ProductForm"

export default function ProductCreatePage() {
  return (
    <main className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Catalog
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Add product</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Capture the core details for a new item.
            </p>
          </div>
          <a
            href="/products"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Back
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <ProductForm
            onCancel={() => (window.location.href = "/products")}
            onSuccess={() => (window.location.href = "/products")}
          />
        </div>
      </div>
    </main>
  )
}
