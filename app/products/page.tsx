"use client"

import * as React from "react"
import AuthGuard from "@/components/AuthGuard"
import { useAuthStore } from "@/store/authStore"
import { useLogoutMutation, getAuthErrorMessage } from "@/hooks/useAuthMutations"

export default function ProductsPage() {
  const authStore = useAuthStore()
  const logoutMutation = useLogoutMutation()
  const [logoutError, setLogoutError] = React.useState<string | null>(null)

  const handleLogout = () => {
    setLogoutError(null)
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        authStore.clearUser()
        window.location.href = "/signin"
      },
      onError: (error) => {
        setLogoutError(getAuthErrorMessage(error, "Logout failed."))
      },
    })
  }

  return (
    <AuthGuard requireAuth redirectTo="/signin">
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Products</h1>
            <button
              type="button"
              onClick={handleLogout}
              className="h-9 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Signing out..." : "Sign out"}
            </button>
          </div>
          {logoutError && (
            <p className="mt-2 text-sm text-destructive">{logoutError}</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Product list UI will go here next.
          </p>
        </div>
      </main>
    </AuthGuard>
  )
}
