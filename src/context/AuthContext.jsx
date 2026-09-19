import { createContext, useContext, useMemo, useState } from "react"
import { readStore, writeStore } from "../lib/storage"

const AuthContext = createContext(null)

/**
 * Mock admin auth for the demo.
 * Replace login / logout / session reads with Supabase Auth later:
 *
 *   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
 *   await supabase.auth.signOut()
 *   const { data: { session } } = await supabase.auth.getSession()
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStore("adminSession", null))
  const [loading] = useState(false)

  const login = async (email, password) => {
    const trimmed = String(email || "").trim()
    if (!trimmed || !password) {
      const error = new Error("INVALID_CREDENTIALS")
      error.code = "INVALID_CREDENTIALS"
      throw error
    }

    const next = {
      provider: "mock",
      accessToken: `mock-${Date.now()}`,
      user: {
        id: "demo-admin",
        email: trimmed,
        name: "MUENHUI Admin",
        role: "admin",
      },
    }
    writeStore("adminSession", next)
    setSession(next)
    return next
  }

  const logout = async () => {
    writeStore("adminSession", null)
    setSession(null)
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAuthenticated: Boolean(session?.user),
      loading,
      login,
      logout,
    }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
