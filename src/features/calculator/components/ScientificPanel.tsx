import { motion, AnimatePresence } from 'framer-motion'
import { useCalculatorStore } from '../store/calculatorStore'

const SCI_BUTTONS = [
  { label: 'sin', fn: 'sin' },
  { label: 'cos', fn: 'cos' },
  { label: 'tan', fn: 'tan' },
  { label: 'log', fn: 'log' },
  { label: 'ln',  fn: 'ln' },
  { label: '√',   fn: '√' },
  { label: 'x²',  fn: 'x²' },
  { label: 'x³',  fn: 'x³' },
  { label: '1/x', fn: '1/x' },
  { label: '|x|', fn: '|x|' },
  { label: 'π',   fn: 'pi' },
  { label: 'e',   fn: 'e' },
]

interface ScientificPanelProps {
  isOpen: boolean
}

export function ScientificPanel({ isOpen }: ScientificPanelProps) {
  const { applyScientific } = useCalculatorStore()

  const handleSci = (fn: string) => {
    if (fn === 'pi') {
      // Replace display with π value
      useCalculatorStore.getState().setDisplay(String(Math.PI))
    } else if (fn === 'e') {
      useCalculatorStore.getState().setDisplay(String(Math.E))
    } else {
      applyScientific(fn)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-6 gap-1.5 px-4 pb-2">
            {SCI_BUTTONS.map((btn) => (
              <motion.button
                key={btn.fn}
                whileTap={{ scale: 0.88 }}
                onClick={() => handleSci(btn.fn)}
                className="
                  btn-base no-select rounded-xl text-xs font-medium
                  min-h-[40px] flex items-center justify-center
                  bg-[var(--color-special)] text-[var(--text-secondary)]
                  hover:bg-[var(--color-special-hover)] hover:text-[var(--accent)]
                  transition-all duration-150
                "
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
