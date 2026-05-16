// ========================
// Calculator Types
// ========================
export type CalcOperator = '+' | '-' | '×' | '÷' | '%'

export interface CalcState {
  display: string
  expression: string
  previousValue: string
  operator: CalcOperator | null
  waitingForOperand: boolean
  isResult: boolean
  isScientificMode: boolean
  isSoundOn: boolean
}

// ========================
// History Types
// ========================
export type HistoryType = 'calculator' | 'currency'

export interface HistoryEntry {
  id: string
  type: HistoryType
  expression: string
  result: string
  timestamp: number
  meta?: {
    fromCurrency?: string
    toCurrency?: string
    rate?: number
  }
}

// ========================
// Currency Types
// ========================
export interface Currency {
  code: string
  name: string
  flag: string
}

export interface CurrencyRate {
  base: string
  date: string
  rates: Record<string, number>
}

export interface CurrencyCache {
  base: string
  rates: Record<string, number>
  timestamp: number
  date: string
}

export interface ConversionResult {
  fromAmount: number
  toAmount: number
  fromCurrency: string
  toCurrency: string
  rate: number
  date: string
}

// ========================
// Theme Types
// ========================
export type Theme = 'dark' | 'light'

// ========================
// PWA Types
// ========================
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  prompt(): Promise<void>
}
