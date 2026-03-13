import { z } from "zod"

export { z }

export function formatZodErrors(error: z.ZodError) {
  return error.issues.reduce<Record<string, string>>((acc, issue) => {
    const path = issue.path.length ? issue.path.join(".") : "root"
    acc[path] = issue.message
    return acc
  }, {})
}
