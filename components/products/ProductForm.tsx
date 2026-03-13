"use client"

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductFormValues } from "@/lib/schemas/product"
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/hooks/useProductQueries"
import type { Product } from "@/lib/services/products"
import Spinner from "@/components/ui/spinner"

type ProductFormProps = {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const isEdit = Boolean(product)
  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const getMessage = (message: unknown) =>
    typeof message === "string" ? message : undefined

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price ?? 0,
      description: product?.description || "",
    },
  })

  const onSubmit = (values: ProductFormValues) => {
    setSubmitError(null)
    if (isEdit && product) {
      updateMutation.mutate(
        { id: product.id, data: values },
        {
          onSuccess: () => onSuccess(),
          onError: () => setSubmitError("Failed to update product."),
        }
      )
      return
    }

    createMutation.mutate(values, {
      onSuccess: () => onSuccess(),
      onError: () => setSubmitError("Failed to create product."),
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
        />
        {errors.name?.message && (
          <p className="text-xs text-foreground font-medium">
            {getMessage(errors.name.message)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="price">
          Price
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
        />
        {errors.price?.message && (
          <p className="text-xs text-foreground font-medium">
            {getMessage(errors.price.message)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      {submitError && (
        <p className="text-sm text-foreground font-medium">{submitError}</p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="h-10 rounded-lg border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isEdit ? (
            updateMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4 border-background/40 border-t-background" />
                Saving...
              </span>
            ) : (
              "Save"
            )
          ) : createMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4 border-background/40 border-t-background" />
              Creating...
            </span>
          ) : (
            "Create"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
