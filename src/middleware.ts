import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isAdminLogin = nextUrl.pathname === '/admin/login'

  // Allow API auth routes
  if (isApiAuthRoute) {
    return
  }

  // Handle admin routes
  if (isAdminRoute) {
    // If trying to access login page while logged in, redirect to dashboard
    if (isAdminLogin) {
      if (isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      }
      return
    }

    // If not logged in and trying to access admin pages, redirect to login
    if (!isLoggedIn) {
      return Response.redirect(new URL('/admin/login', nextUrl))
    }
  }
})

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
