import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/", "/signin", "/signup"]

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname)
}

function isProtectedRoute(pathname: string) {
  return pathname.startsWith("/products") || pathname.startsWith("/profile")
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value
  const isAuthed = Boolean(token)

  if (!isAuthed && isProtectedRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }

  if (isAuthed && isPublicRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/products"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
}
