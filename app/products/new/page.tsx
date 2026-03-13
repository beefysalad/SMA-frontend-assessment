"use client"

import ProductForm from "@/components/products/ProductForm"

export default function ProductCreatePage() {
  return (
    <main className="py-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Add product</h1>
          <a
            href="/products"
            className="text-sm underline-offset-4 hover:underline"
          >
            Back
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <ProductForm
            onCancel={() => (window.location.href = "/products")}
            onSuccess={() => (window.location.href = "/products")}
          />
        </div>
      </div>
    </main>
  )
}
