import { createAuthClient } from "better-auth/react"

const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3002"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
        baseURL: apiBaseUrl
})

export const {useSession, signIn, signUp, signOut } = authClient