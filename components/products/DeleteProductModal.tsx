"use client"

import type { Product } from "@/lib/services/products"

type DeleteProductModalProps = {
  product: Product
  onCancel: () => void
  onConfirm: (id: number) => void
}

export default function DeleteProductModal({
  product,
  onCancel,
  onConfirm,
}: DeleteProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-lg">
        <h2 className="text-base font-semibold">Delete product</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">
            {product.name}?
          </span>{" "}
          This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(product.id)}
            className="h-9 rounded-lg bg-destructive px-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
