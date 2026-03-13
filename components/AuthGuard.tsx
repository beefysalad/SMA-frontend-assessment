"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

type AuthGuardProps = {
  children: React.ReactNode
  redirectTo: string
  requireAuth: boolean
}

export default function AuthGuard({
  children,
  redirectTo,
  requireAuth,
}: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  React.useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo)
    }
    if (!requireAuth && isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, redirectTo, requireAuth, router])

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
