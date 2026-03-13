import { cn } from "@/lib/utils"

type SpinnerProps = {
  className?: string
}

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-foreground",
        className
      )}
      aria-label="Loading"
      role="status"
    />
  )
}
