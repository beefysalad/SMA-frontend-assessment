import { z } from "zod"

const priceSchema = z.number().positive("Price must be greater than 0")

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: priceSchema,
  description: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
