import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser } from "@/lib/services/auth"

type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  setToken: (token: string | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
