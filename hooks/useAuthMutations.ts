import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import {
  login as loginRequest,
  signUp as signUpRequest,
  logout as logoutRequest,
  updateProfile as updateProfileRequest,
} from "@/lib/services/auth"

type ErrorResponse = { message?: string }

export function useSignInMutation() {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      loginRequest(payload.email, payload.password),
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (payload: { name: string; email: string; password: string }) =>
      signUpRequest(payload.name, payload.email, payload.password),
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: () => logoutRequest(),
  })
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: (payload: { name?: string; password?: string }) =>
      updateProfileRequest(payload),
  })
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ErrorResponse>
  return (
    axiosError.response?.data?.message ||
    (error instanceof Error ? error.message : fallback)
  )
}
