import type { HTMLAttributes, ReactNode } from 'react'

interface NeonCardProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; accent?: 'pink' | 'amber' | 'violet' }

export function NeonCard({ children, className = '', accent = 'pink', ...props }: NeonCardProps) {
  return <div className={`neon-card neon-card--${accent} ${className}`} {...props}><span className="neon-card__corner neon-card__corner--top" /><span className="neon-card__corner neon-card__corner--bottom" />{children}</div>
}
