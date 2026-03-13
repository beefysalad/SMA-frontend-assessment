import { api } from "@/lib/api"

export type Product = {
  id: number
  name: string
  price: number
  description?: string | null
  createdAt: string
  updatedAt: string
}

export type PaginatedProducts = {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function getProducts(params: {
  page: number
  limit: number
  search?: string
  sortBy?: "createdAt" | "price" | "name"
  sortOrder?: "asc" | "desc"
}) {
  const response = await api.get<PaginatedProducts>("/products", {
    params,
  })
  return response.data
}

export async function getProductById(id: number) {
  const response = await api.get<Product>(`/products/${id}`)
  return response.data
}

export async function createProduct(data: {
  name: string
  price: number
  description?: string | null
}) {
  const response = await api.post<Product>("/products", data)
  return response.data
}

export async function updateProduct(
  id: number,
  data: {
    name?: string
    price?: number
    description?: string | null
  }
) {
  const response = await api.put<Product>(`/products/${id}`, data)
  return response.data
}

export async function deleteProduct(id: number) {
  const response = await api.delete<{ message: string }>(
    `/products/${id}`
  )
  return response.data
}

export async function seedProducts(count = 100) {
  const response = await api.post<{ message: string }>(`/products/seed`, {
    count,
  })
  return response.data
}
