"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { useLogoutMutation, getAuthErrorMessage } from "@/hooks/useAuthMutations"

const items = [
  { href: "/products", label: "Products" },
  { href: "/products/new", label: "Add product" },
  { href: "/profile", label: "Profile" },
  { href: "/products/seed", label: "Seed products" },
]

export default function SidebarNav() {
  const pathname = usePathname()
  const authStore = useAuthStore()
  const logoutMutation = useLogoutMutation()
  const [logoutError, setLogoutError] = useState<string | null>(null)

  return (
    <div className="mt-6 flex h-full flex-col text-sm">
      <nav className="space-y-1">
        {items.map((item) => {
          const active =
            item.href === "/products"
              ? pathname === "/products"
              : pathname.startsWith(item.href)

          return (
            <a
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 transition ${
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={() => {
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
          }}
          className="w-full rounded-lg border border-border px-3 py-2 text-left text-muted-foreground transition hover:bg-muted hover:text-foreground"
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Signing out..." : "Sign out"}
        </button>

        {logoutError && (
          <p className="text-xs text-destructive">{logoutError}</p>
        )}
      </div>
    </div>
  )
}
