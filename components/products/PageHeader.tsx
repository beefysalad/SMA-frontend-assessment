import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  actions?: ReactNode
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
