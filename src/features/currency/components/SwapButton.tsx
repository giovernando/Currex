import { motion } from 'framer-motion'

interface SwapButtonProps {
  onClick: () => void
}

export function SwapButton({ onClick }: SwapButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.85, rotate: 180 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      aria-label="Swap currencies"
      className="
        flex-shrink-0 w-10 h-10 rounded-xl mt-6
        flex items-center justify-center
        glass border border-[var(--border-color)]
        text-[var(--accent)] hover:border-[var(--accent)]
        hover:bg-[var(--accent-subtle)] transition-all duration-200
        shadow-[0_0_12px_var(--accent-glow)]
      "
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M7 16V4m0 0L3 8m4-4l4 4" />
        <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </motion.button>
  )
}
