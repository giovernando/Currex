import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glass?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', glass = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl overflow-hidden relative
        ${glass ? 'glass shadow-[var(--shadow-card)]' : 'bg-[var(--bg-surface)]'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
