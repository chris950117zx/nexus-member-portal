import type { LucideIcon } from 'lucide-react'

interface PageHeadingProps { eyebrow: string; title: string; highlight?: string; description: string; icon: LucideIcon }
export function PageHeading({ eyebrow, title, highlight, description, icon: Icon }: PageHeadingProps) {
  return <div className="page-intro"><div><div className="eyebrow"><Icon size={13} /> {eyebrow}</div><h2>{title} {highlight && <em>{highlight}</em>}</h2><p>{description}</p></div><div className="secure-label">LOCAL SIMULATION <span>NO REAL FUNDS</span></div></div>
}
