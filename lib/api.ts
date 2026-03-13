import axios from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export { api }
