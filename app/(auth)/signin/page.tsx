"use client"

import { useState } from "react"
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

export default function SignInPage() {
  const authStore = useAuthStore()
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
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
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
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
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm transition outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              {successMessage && (
                <p className="text-sm text-foreground">{successMessage}</p>
              )}
              <button
                type="submit"
                disabled={signInMutation.isPending}
                className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signInMutation.isPending ? "Signing in..." : "Sign in"}
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
