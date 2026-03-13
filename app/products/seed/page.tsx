"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSeedProductsMutation } from "@/hooks/useProductQueries"

const seedSchema = z.object({
  count: z.number().min(1, "Minimum is 1").max(5000, "Maximum is 5000"),
})

type SeedFormValues = z.infer<typeof seedSchema>

export default function ProductSeedPage() {
  const seedMutation = useSeedProductsMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeedFormValues>({
    resolver: zodResolver(seedSchema),
    defaultValues: {
      count: 100,
    },
  })

  return (
    <main className="py-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Seed products</h1>
          <a
            href="/products"
            className="text-sm underline-offset-4 hover:underline"
          >
            Back
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Create dummy products for testing. Max 5000 per request. For the
            full 50,000 seed run: `cd backend` then `npm run seed`.
          </p>

          <form
            className="mt-4 flex flex-wrap items-center gap-3"
            onSubmit={handleSubmit((values) => {
              setSubmitError(null)
              seedMutation.mutate(values.count, {
                onError: () => setSubmitError("Failed to seed products."),
              })
            })}
          >
            <input
              type="text"
              inputMode="numeric"
              {...register("count", { valueAsNumber: true })}
              className="h-9 w-28 rounded-xl border border-border bg-background px-3 text-sm"
            />
            <button
              type="submit"
              className="h-9 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
              disabled={seedMutation.isPending}
            >
              {seedMutation.isPending ? "Seeding..." : "Seed"}
            </button>
          </form>

          {errors.count?.message && (
            <p className="mt-2 text-sm text-destructive">
              {errors.count.message}
            </p>
          )}
          {submitError && (
            <p className="mt-2 text-sm text-destructive">{submitError}</p>
          )}

          {seedMutation.isSuccess && (
            <p className="mt-3 text-sm text-foreground">
              {seedMutation.data.message}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
