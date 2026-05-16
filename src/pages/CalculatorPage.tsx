import { motion } from 'framer-motion'
import { CalculatorDisplay } from '@/features/calculator/components/CalculatorDisplay'
import { CalcGrid } from '@/features/calculator/components/CalcGrid'
import { ScientificPanel } from '@/features/calculator/components/ScientificPanel'
import { useCalculatorStore } from '@/features/calculator/store/calculatorStore'
import { useKeyboard } from '@/features/calculator/hooks/useKeyboard'
import { Card } from '@/components/ui/Card'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export function CalculatorPage() {
  const { display, expression, isScientificMode, isSoundOn, toggleScientific, toggleSound, backspace } = useCalculatorStore()

  useKeyboard(true)

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="h-full flex flex-col"
    >
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleScientific}
              className={`
                text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all
                ${isScientificMode
                  ? 'bg-[var(--accent)] text-white shadow-[0_0_10px_var(--accent-glow)]'
                  : 'glass text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              fn
            </motion.button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sound toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleSound}
              className="text-sm px-2 py-1.5 rounded-lg glass text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
              title="Toggle sound"
            >
              {isSoundOn ? '🔊' : '🔇'}
            </motion.button>

            {/* Backspace */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={backspace}
              className="text-sm px-2.5 py-1.5 rounded-lg glass text-[var(--text-muted)] hover:text-red-400 transition-all"
              aria-label="Backspace"
            >
              ⌫
            </motion.button>
          </div>
        </div>

        {/* Scientific Panel */}
        <ScientificPanel isOpen={isScientificMode} />

        {/* Display */}
        <CalculatorDisplay display={display} expression={expression} />

        {/* Divider */}
        <div className="h-px bg-[var(--border-color)] mx-4" />

        {/* Grid */}
        <CalcGrid />
      </Card>
    </motion.div>
  )
}
