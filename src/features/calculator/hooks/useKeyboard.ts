import { useEffect } from 'react'
import { useCalculatorStore } from '../store/calculatorStore'

const KEY_MAP: Record<string, string> = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '.': '.', ',': '.',
  '+': '+', '-': '-', '*': '×', '/': '÷',
  'Enter': '=', '=': '=',
  'Backspace': 'backspace',
  'Escape': 'AC', 'Delete': 'AC',
  '%': '%',
}

export function useKeyboard(isActive = true) {
  const store = useCalculatorStore()

  useEffect(() => {
    if (!isActive) return

    const handler = (e: KeyboardEvent) => {
      // Don't intercept if focus is on an input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      const action = KEY_MAP[e.key]
      if (!action) return

      e.preventDefault()

      if (action === 'AC') {
        store.clear()
      } else if (action === 'backspace') {
        store.backspace()
      } else if (action === '=') {
        store.calculate()
      } else if (['+', '-', '×', '÷'].includes(action)) {
        store.inputOperator(action)
      } else if (action === '%') {
        store.percentage()
      } else if (action === '.') {
        store.inputDecimal()
      } else {
        store.inputDigit(action)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isActive, store])
}
