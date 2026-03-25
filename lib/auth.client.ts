import { createAuthClient } from "better-auth/react"

// Les requêtes auth passent par le proxy Next.js (/api/auth/*)
// ce qui évite les problèmes de cookies cross-origin.
const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: { credentials: "include" },
})

export const { useSession, signIn, signUp, signOut, getSession } = authClient
