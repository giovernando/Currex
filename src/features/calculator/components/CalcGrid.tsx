import { CalcButton, type CalcButtonVariant } from './CalcButton'
import { useCalculatorStore } from '../store/calculatorStore'
import { useHistoryStore } from '@/features/history/store/historyStore'

interface ButtonDef {
  label: string
  variant: CalcButtonVariant
  action: string
  wide?: boolean
}

const BUTTONS: ButtonDef[] = [
  { label: 'AC',  variant: 'special',   action: 'clear' },
  { label: '+/-', variant: 'special',   action: 'negate' },
  { label: '%',   variant: 'special',   action: 'percent' },
  { label: '÷',   variant: 'operator',  action: 'op:÷' },

  { label: '7',   variant: 'number',    action: 'd:7' },
  { label: '8',   variant: 'number',    action: 'd:8' },
  { label: '9',   variant: 'number',    action: 'd:9' },
  { label: '×',   variant: 'operator',  action: 'op:×' },

  { label: '4',   variant: 'number',    action: 'd:4' },
  { label: '5',   variant: 'number',    action: 'd:5' },
  { label: '6',   variant: 'number',    action: 'd:6' },
  { label: '-',   variant: 'operator',  action: 'op:-' },

  { label: '1',   variant: 'number',    action: 'd:1' },
  { label: '2',   variant: 'number',    action: 'd:2' },
  { label: '3',   variant: 'number',    action: 'd:3' },
  { label: '+',   variant: 'operator',  action: 'op:+' },

  { label: '0',   variant: 'zero',      action: 'd:0',   wide: true },
  { label: '.',   variant: 'number',    action: 'decimal' },
  { label: '=',   variant: 'equals',    action: 'equals' },
]

interface CalcGridProps {
  onResult?: (expression: string) => void
}

export function CalcGrid({ onResult }: CalcGridProps) {
  const store = useCalculatorStore()
  const addEntry = useHistoryStore((s) => s.addEntry)

  const handleAction = (action: string) => {
    if (action.startsWith('d:')) {
      store.inputDigit(action.slice(2))
    } else if (action.startsWith('op:')) {
      store.inputOperator(action.slice(3))
    } else if (action === 'equals') {
      const entry = store.calculate()
      if (entry) {
        const parts = entry.split(' = ')
        addEntry({ type: 'calculator', expression: parts[0], result: parts[1] || '' })
        onResult?.(entry)
      }
    } else if (action === 'clear') {
      store.clear()
    } else if (action === 'negate') {
      store.negate()
    } else if (action === 'percent') {
      store.percentage()
    } else if (action === 'decimal') {
      store.inputDecimal()
    } else if (action === 'backspace') {
      store.backspace()
    }
  }

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {BUTTONS.map((btn) => (
        <CalcButton
          key={btn.label + btn.action}
          label={btn.label}
          variant={btn.variant}
          wide={btn.wide}
          onClick={() => handleAction(btn.action)}
        />
      ))}
    </div>
  )
}
