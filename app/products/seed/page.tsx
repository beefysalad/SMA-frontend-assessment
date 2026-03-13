"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSeedProductsMutation } from "@/hooks/useProductQueries"
import Spinner from "@/components/ui/spinner"
import Link from "next/link"

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
    <main className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Catalog
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Seed products</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create dummy products for testing. Max 5000 per request.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Back
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            For the full 50,000 seed run: `cd backend` then `npm run seed`.
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
              className="h-10 w-28 rounded-xl border border-border bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
            />
            <button
              type="submit"
              className="h-10 rounded-xl border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
              disabled={seedMutation.isPending}
            >
              {seedMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4 border-background/40 border-t-background" />
                  Seeding...
                </span>
              ) : (
                "Seed"
              )}
            </button>
          </form>

          {errors.count?.message && (
            <p className="mt-2 text-sm font-medium text-foreground">
              {errors.count.message}
            </p>
          )}
          {submitError && (
            <p className="mt-2 text-sm font-medium text-foreground">
              {submitError}
            </p>
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
