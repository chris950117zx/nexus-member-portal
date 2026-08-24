import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; tone?: 'pink' | 'amber' | 'violet' }
export function GlowButton({ children, tone = 'pink', className = '', ...props }: GlowButtonProps) { return <button className={`glow-button glow-button--${tone} ${className}`} {...props}>{children}</button> }
