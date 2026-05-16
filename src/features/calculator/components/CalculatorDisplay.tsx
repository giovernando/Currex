import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CalculatorDisplayProps {
  display: string
  expression: string
}

function getDisplayFontSize(length: number): string {
  if (length <= 6) return 'text-6xl'
  if (length <= 9) return 'text-5xl'
  if (length <= 12) return 'text-4xl'
  return 'text-3xl'
}

export function CalculatorDisplay({ display, expression }: CalculatorDisplayProps) {
  const [prevDisplay, setPrevDisplay] = useState(display)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (display !== prevDisplay) {
      setAnimKey((k) => k + 1)
      setPrevDisplay(display)
    }
  }, [display, prevDisplay])

  const isError = display === 'Error'
  const fontSize = getDisplayFontSize(display.length)

  return (
    <div className="px-5 pt-5 pb-3 flex flex-col items-end select-none min-h-[120px] justify-end relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--accent-glow)]/10 pointer-events-none" />

      {/* Expression preview */}
      <AnimatePresence mode="wait">
        {expression && (
          <motion.div
            key={expression}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[var(--text-muted)] text-sm font-mono mb-1 truncate max-w-full"
          >
            {expression}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`
            display-number font-light leading-none tracking-tight
            ${fontSize}
            ${isError ? 'text-red-400' : 'text-[var(--text-primary)]'}
          `}
        >
          {display}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
