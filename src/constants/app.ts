export const APP_NAME = 'CalcPro'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Modern PWA Calculator with Currency Converter'

export const FRANKFURTER_API = import.meta.env.DEV ? '/api/currency' : (import.meta.env.VITE_FRANKFURTER_API || 'https://api.frankfurter.app')

export const STORAGE_KEYS = {
  THEME: 'calcpro-theme',
  HISTORY: 'calcpro-history',
  CURRENCY_CACHE: 'calcpro-currency-cache',
  RECENT_CURRENCIES: 'calcpro-recent-currencies',
  SOUND: 'calcpro-sound',
} as const

export const HISTORY_MAX_ITEMS = 200

export const CURRENCY_CACHE_TTL = 60 * 60 * 1000 // 1 hour in ms

export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'IDR', 'GBP', 'JPY', 'CNY', 'SGD', 'AUD', 'CAD', 'CHF', 'KRW', 'MYR',
] as const

export const TABS = [
  { id: 'calculator', label: 'Calculator', icon: 'calc' },
  { id: 'converter', label: 'Converter', icon: 'swap' },
  { id: 'history', label: 'History', icon: 'clock' },
] as const

export type TabId = typeof TABS[number]['id']
