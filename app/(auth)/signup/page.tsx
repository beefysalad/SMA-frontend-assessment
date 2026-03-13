"use client"

import {
  getAuthErrorMessage,
  useSignUpMutation,
} from "@/hooks/useAuthMutations"
import { signUpSchema, type SignUpFormValues } from "@/lib/schemas/auth"
import { useAuthStore } from "@/store/authStore"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Spinner from "@/components/ui/spinner"

export default function SignUpPage() {
  const router = useRouter()
  const authStore = useAuthStore()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsubscribe = useAuthStore.persist?.onFinishHydration?.(() => {
      setHydrated(true)
    })
    return () => {
      unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    if (hydrated && authStore.isAuthenticated) {
      router.replace("/products")
    }
  }, [hydrated, authStore.isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const signUpMutation = useSignUpMutation()

  const onSubmit = (values: SignUpFormValues) => {
    setSubmitError(null)
    setSuccessMessage(null)
    signUpMutation.mutate(values, {
      onSuccess: (data) => {
        setSuccessMessage(data.message || "Account created successfully.")
        setSubmitError(null)
        router.push("/signin")
      },
      onError: (error) => {
        setSubmitError(getAuthErrorMessage(error, "Sign up failed."))
      },
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Product Management
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
            <p className="text-sm text-muted-foreground">
              Create an account to start managing your catalog.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Patrick Ryan Mandal"
                {...register("name")}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
              {errors.name && (
                <p className="text-xs text-foreground font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="patrick@test.com"
                {...register("email")}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
              {errors.email && (
                <p className="text-xs text-foreground font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                {...register("password")}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              />
              {errors.password && (
                <p className="text-xs text-foreground font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            {submitError && (
              <p className="text-sm text-foreground font-medium">
                {submitError}
              </p>
            )}
            {successMessage && (
              <p className="text-sm text-foreground">{successMessage}</p>
            )}
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className="h-11 w-full rounded-xl border border-foreground bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signUpMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4 border-background/40 border-t-background" />
                  Creating...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
