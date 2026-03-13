import type { ReactNode } from "react"
import SidebarNav from "@/components/SidebarNav"

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-60 md:flex-col md:border-r md:border-border md:bg-card">
        <div className="flex h-full flex-col p-4">
          <div className="text-sm font-semibold">Product Studio</div>
          <SidebarNav />
          <div className="mt-auto pt-6 text-xs text-muted-foreground">
            Manage catalog and pricing.
          </div>
        </div>
      </aside>
      <div className="md:pl-60">
        <div className="mx-auto flex min-h-screen max-w-6xl px-6 py-8">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}
