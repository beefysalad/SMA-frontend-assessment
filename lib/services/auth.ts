import { api } from "@/lib/api"

export type AuthUser = {
  id: string
  email: string
}

export type AuthResponse = {
  message: string
  user: AuthUser
}

export type SignUpResponse = {
  message: string
  user: AuthUser
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
