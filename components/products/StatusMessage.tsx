type StatusMessageProps = {
  variant: "loading" | "error"
  message: string
  className?: string
}

export default function StatusMessage({
  variant,
  message,
  className,
}: StatusMessageProps) {
  const textClass =
    variant === "error" ? "text-destructive" : "text-muted-foreground"

  return <p className={`text-sm ${textClass} ${className || ""}`}>{message}</p>
}
