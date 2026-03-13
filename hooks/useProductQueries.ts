import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  seedProducts,
  updateProduct,
  type PaginatedProducts,
  type Product,
} from "@/lib/services/products"

export function useProductsQuery(
  params: {
    page: number
    limit: number
    search?: string
    sortBy?: "createdAt" | "price" | "name"
    sortOrder?: "asc" | "desc"
  },
  enabled: boolean
) {
  return useQuery<PaginatedProducts, Error>({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    enabled,
    placeholderData: (previous) => previous,
  })
}

export function useProductQuery(id: number, enabled: boolean) {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled,
  })
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: { name?: string; price?: number; description?: string | null }
    }) => updateProduct(id, data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
    },
  })
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useSeedProductsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (count: number) => seedProducts(count),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
