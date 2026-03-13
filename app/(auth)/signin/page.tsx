"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/authStore"
import {
  useSignInMutation,
  getAuthErrorMessage,
} from "@/hooks/useAuthMutations"
import { signInSchema, type SignInFormValues } from "@/lib/schemas/auth"
import Spinner from "@/components/ui/spinner"

export default function SignInPage() {
  const authStore = useAuthStore()
  const router = useRouter()
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
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signInMutation = useSignInMutation()

  const onSubmit = (values: SignInFormValues) => {
    setSubmitError(null)
    setSuccessMessage(null)
    signInMutation.mutate(values, {
      onSuccess: (data) => {
        authStore.setUser(data.user)
        authStore.setToken(data.token || null)
        setSuccessMessage("Signed in successfully.")
        setSubmitError(null)
        router.push("/products")
      },
      onError: (error) => {
        setSubmitError(getAuthErrorMessage(error, "Sign in failed."))
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
            <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Access your catalog and manage products securely.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
              disabled={signInMutation.isPending}
              className="h-11 w-full rounded-xl border border-foreground bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signInMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4 border-background/40 border-t-background" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
