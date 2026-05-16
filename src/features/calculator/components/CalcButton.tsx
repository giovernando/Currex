import { motion } from 'framer-motion'
import { useRef } from 'react'

export type CalcButtonVariant = 'number' | 'operator' | 'special' | 'equals' | 'zero'

interface CalcButtonProps {
  label: string
  variant?: CalcButtonVariant
  onClick: () => void
  wide?: boolean
  className?: string
}

const variantConfig: Record<CalcButtonVariant, { bg: string; text: string; hover: string }> = {
  number: {
    bg: 'bg-[var(--color-num)]',
    text: 'text-[var(--text-primary)]',
    hover: 'hover:bg-[var(--color-num-hover)]',
  },
  operator: {
    bg: 'bg-[var(--color-operator)]',
    text: 'text-[var(--accent)]',
    hover: 'hover:bg-[var(--color-operator-hover)]',
  },
  special: {
    bg: 'bg-[var(--color-special)]',
    text: 'text-[var(--text-secondary)]',
    hover: 'hover:bg-[var(--color-special-hover)]',
  },
  equals: {
    bg: '',
    text: 'text-white',
    hover: '',
  },
  zero: {
    bg: 'bg-[var(--color-num)]',
    text: 'text-[var(--text-primary)]',
    hover: 'hover:bg-[var(--color-num-hover)]',
  },
}

export function CalcButton({ label, variant = 'number', onClick, wide = false, className = '' }: CalcButtonProps) {
  const isEquals = variant === 'equals'
  const cfg = variantConfig[variant]
  const rippleRef = useRef<HTMLSpanElement>(null)

  const handleClick = () => {
    onClick()
    // Ripple effect
    if (rippleRef.current) {
      rippleRef.current.classList.remove('animate-ripple')
      void rippleRef.current.offsetWidth
      rippleRef.current.classList.add('animate-ripple')
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.90 }}
      whileHover={{ scale: 1.04 }}
      onClick={handleClick}
      className={`
        btn-base no-select relative overflow-hidden
        ${wide ? 'col-span-2' : ''}
        rounded-2xl font-medium text-xl
        min-h-[70px] flex items-center justify-center
        transition-all duration-150
        ${cfg.bg} ${cfg.text} ${cfg.hover}
        ${isEquals ? 'text-white shadow-[0_0_20px_var(--accent-glow)]' : ''}
        ${className}
      `}
      style={
        isEquals
          ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }
          : undefined
      }
      aria-label={label}
    >
      <span className="relative z-10">{label}</span>

      {/* Ripple overlay */}
      <span
        ref={rippleRef}
        className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 pointer-events-none"
        style={{ transition: 'opacity 0.3s ease' }}
      />
    </motion.button>
  )
}
