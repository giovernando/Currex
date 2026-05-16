import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CalcState } from '@/types'
import { safeEvaluate, formatNumber, scientificOps } from '../utils/evaluate'

interface CalculatorStore extends CalcState {
  // Actions
  inputDigit: (digit: string) => void
  inputDecimal: () => void
  inputOperator: (op: string) => void
  calculate: () => string | null
  clear: () => void
  backspace: () => void
  negate: () => void
  percentage: () => void
  applyScientific: (fn: string) => void
  toggleScientific: () => void
  toggleSound: () => void
  setDisplay: (value: string) => void
}

const INITIAL_STATE: CalcState = {
  display: '0',
  expression: '',
  previousValue: '',
  operator: null,
  waitingForOperand: false,
  isResult: false,
  isScientificMode: false,
  isSoundOn: false,
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      inputDigit: (digit) => {
        const { display, waitingForOperand, isResult } = get()
        if (waitingForOperand || isResult) {
          set({ display: digit, waitingForOperand: false, isResult: false })
        } else {
          if (display === '0' && digit !== '.') {
            set({ display: digit })
          } else if (display.length < 15) {
            set({ display: display + digit })
          }
        }
      },

      inputDecimal: () => {
        const { display, waitingForOperand } = get()
        if (waitingForOperand) {
          set({ display: '0.', waitingForOperand: false })
          return
        }
        if (!display.includes('.')) {
          set({ display: display + '.' })
        }
      },

      inputOperator: (op) => {
        const { display, operator, previousValue, waitingForOperand } = get()
        const currentVal = display

        if (waitingForOperand) {
          // Just change the operator
          set({ operator: op as CalcState['operator'], expression: previousValue + ' ' + op })
          return
        }

        // Chain operations
        if (operator && previousValue) {
          const expr = `${previousValue} ${operator} ${currentVal}`
          const { value, error } = safeEvaluate(expr)
          if (!error) {
            const result = formatNumber(value)
            set({
              display: result,
              expression: result + ' ' + op,
              previousValue: result,
              operator: op as CalcState['operator'],
              waitingForOperand: true,
              isResult: false,
            })
            return
          }
        }

        set({
          expression: currentVal + ' ' + op,
          previousValue: currentVal,
          operator: op as CalcState['operator'],
          waitingForOperand: true,
          isResult: false,
        })
      },

      calculate: () => {
        const { display, previousValue, operator } = get()
        if (!operator || !previousValue) return null

        const expr = `${previousValue} ${operator} ${display}`
        const { value, error } = safeEvaluate(expr)

        if (error) {
          set({ display: 'Error', expression: '', previousValue: '', operator: null, waitingForOperand: false, isResult: true })
          return null
        }

        const result = formatNumber(value)
        const fullExpression = `${previousValue} ${operator} ${display} =`

        set({
          display: result,
          expression: fullExpression,
          previousValue: '',
          operator: null,
          waitingForOperand: false,
          isResult: true,
        })

        return `${previousValue} ${operator} ${display} = ${result}`
      },

      clear: () => set({ ...INITIAL_STATE, isScientificMode: get().isScientificMode, isSoundOn: get().isSoundOn }),

      backspace: () => {
        const { display, isResult } = get()
        if (isResult || display === 'Error') {
          set({ display: '0', isResult: false })
          return
        }
        const newDisplay = display.length > 1 ? display.slice(0, -1) : '0'
        set({ display: newDisplay })
      },

      negate: () => {
        const { display } = get()
        if (display === '0' || display === 'Error') return
        const value = parseFloat(display) * -1
        set({ display: formatNumber(value) })
      },

      percentage: () => {
        const { display, previousValue, operator } = get()
        const current = parseFloat(display)
        if (isNaN(current)) return
        let result: number
        if (previousValue && operator) {
          result = (parseFloat(previousValue) * current) / 100
        } else {
          result = current / 100
        }
        set({ display: formatNumber(result), isResult: false })
      },

      applyScientific: (fn) => {
        const { display } = get()
        const current = parseFloat(display)
        if (isNaN(current)) return
        const op = scientificOps[fn]
        if (!op) return
        try {
          const result = op(current)
          set({ display: formatNumber(result), isResult: true, expression: `${fn}(${display})` })
        } catch {
          set({ display: 'Error' })
        }
      },

      toggleScientific: () => set((s) => ({ isScientificMode: !s.isScientificMode })),
      toggleSound: () => set((s) => ({ isSoundOn: !s.isSoundOn })),
      setDisplay: (value) => set({ display: value }),
    }),
    {
      name: 'calcpro-calculator',
      partialize: (state) => ({
        isScientificMode: state.isScientificMode,
        isSoundOn: state.isSoundOn,
      }),
    }
  )
)
