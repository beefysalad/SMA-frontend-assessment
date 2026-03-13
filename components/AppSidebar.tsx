"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  PackageIcon,
  PlusCircleIcon,
  UserCircleIcon,
  DatabaseIcon,
  LogOutIcon,
  ChevronDownIcon,
} from "lucide-react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/authStore"
import { useLogoutMutation, getAuthErrorMessage } from "@/hooks/useAuthMutations"

const navItems = [
  {
    href: "/products",
    label: "Products",
    icon: PackageIcon,
    isActive: (pathname: string) =>
      pathname === "/products" ||
      (pathname.startsWith("/products/") &&
        !pathname.startsWith("/products/new") &&
        !pathname.startsWith("/products/seed")),
  },
  {
    href: "/products/new",
    label: "Add product",
    icon: PlusCircleIcon,
    isActive: (pathname: string) => pathname.startsWith("/products/new"),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserCircleIcon,
    isActive: (pathname: string) => pathname.startsWith("/profile"),
  },
  {
    href: "/products/seed",
    label: "Seed products",
    icon: DatabaseIcon,
    isActive: (pathname: string) => pathname.startsWith("/products/seed"),
  },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const authStore = useAuthStore()
  const user = authStore.user
  const logoutMutation = useLogoutMutation()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            PS
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold">Product Studio</p>
            <p className="text-xs text-sidebar-foreground/70">Assessment</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive(pathname)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={user?.name || user?.email || "Account"}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {initials}
                  </span>
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setLogoutError(null)
                    logoutMutation.mutate(undefined, {
                      onSuccess: () => {
                        authStore.clearUser()
                        window.location.href = "/signin"
                      },
                      onError: (error) => {
                        setLogoutError(
                          getAuthErrorMessage(error, "Logout failed.")
                        )
                      },
                    })
                  }}
                  disabled={logoutMutation.isPending}
                >
                  <LogOutIcon className="mr-2 size-4" />
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        {logoutError && (
          <p className="px-2 pb-2 text-xs text-destructive">{logoutError}</p>
        )}
      </SidebarFooter>
    </>
  )
}
