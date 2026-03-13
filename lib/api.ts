import axios from "axios"
import { useAuthStore } from "@/store/authStore"

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api }
