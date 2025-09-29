import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Import database and bcryptjs only when needed (not in edge runtime)
        const { db } = await import("./lib/db")
        const { compare } = await import("bcryptjs")

        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  }
} satisfies NextAuthConfig
