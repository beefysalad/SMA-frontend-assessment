import { api } from "@/lib/api"

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthResponse = {
  message: string
  user: AuthUser
  token?: string
}

export type SignUpResponse = {
  message: string
  user: AuthUser
  token?: string
}

export async function login(email: string, password: string) {
  const response = await api.post<AuthResponse>("/auth/sign-in", {
    email,
    password,
  })
  return response.data
}

export async function signUp(name: string, email: string, password: string) {
  const response = await api.post<SignUpResponse>("/auth/sign-up", {
    name,
    email,
    password,
  })
  return response.data
}

export async function logout() {
  const response = await api.post<{ message: string }>("/auth/logout")
  return response.data
}

export async function updateProfile(payload: {
  name?: string
  password?: string
}) {
  const response = await api.put<AuthResponse>("/auth/profile", payload)
  return response.data
}
