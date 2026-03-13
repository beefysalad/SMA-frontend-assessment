import { z } from "zod"

export const profileSchema = z
  .object({
    name: z.string().optional(),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const name = data.name?.trim()
    const password = data.password?.trim()

    if (!name && !password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide a name or password",
        path: ["root"],
      })
    }

    if (password && password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 6 characters",
        path: ["password"],
      })
    }

    if (name !== undefined && name.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required",
        path: ["name"],
      })
    }
  })

export type ProfileFormValues = z.infer<typeof profileSchema>
