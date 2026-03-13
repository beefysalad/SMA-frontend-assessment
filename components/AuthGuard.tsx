"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import Spinner from "@/components/ui/spinner"

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
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
    if (hydrated && !isAuthenticated) {
      router.push("/signin")
    }
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-6 w-6 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
