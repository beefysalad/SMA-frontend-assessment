import type { ButtonHTMLAttributes } from "react"

type ActionPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "danger"
}

export function getActionPillClass(variant: "default" | "danger" = "default") {
  const base =
    "rounded-full border px-3 py-1 text-xs font-semibold transition"
  const styles =
    variant === "danger"
      ? "border-foreground/30 bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
      : "border-border bg-background text-foreground/80 hover:border-foreground/30 hover:text-foreground"
  return `${base} ${styles}`
}

export default function ActionPill({
  variant = "default",
  className,
  ...props
}: ActionPillProps) {
  const classes = getActionPillClass(variant)
  return <button className={`${classes} ${className || ""}`} {...props} />
}
