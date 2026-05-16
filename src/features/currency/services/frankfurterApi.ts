import { FRANKFURTER_API, CURRENCY_CACHE_TTL, STORAGE_KEYS } from '@/constants/app'
import type { CurrencyCache, ConversionResult } from '@/types'

// ========================
// API Types
// ========================
interface FrankfurterLatest {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

interface FrankfurterCurrencies {
  [code: string]: string
}

// ========================
// Cache helpers
// ========================
function getCachedRates(base: string): CurrencyCache | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CURRENCY_CACHE}-${base}`)
    if (!raw) return null
    const cache: CurrencyCache = JSON.parse(raw)
    if (Date.now() - cache.timestamp > CURRENCY_CACHE_TTL) return null
    return cache
  } catch {
    return null
  }
}

function setCachedRates(base: string, data: CurrencyCache) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.CURRENCY_CACHE}-${base}`, JSON.stringify(data))
  } catch { /* storage full – skip */ }
}

// ========================
// API calls
// ========================
export async function fetchCurrencies(): Promise<Record<string, string>> {
  const res = await fetch(`${FRANKFURTER_API}/currencies`)
  if (!res.ok) throw new Error(`Failed to fetch currencies: ${res.status}`)
  const data: FrankfurterCurrencies = await res.json()
  return data
}

export async function fetchRates(base: string): Promise<CurrencyCache> {
  const cached = getCachedRates(base)
  if (cached) return cached

  const res = await fetch(`${FRANKFURTER_API}/latest?from=${base}`)
  if (!res.ok) throw new Error(`Failed to fetch rates: ${res.status}`)
  const data: FrankfurterLatest = await res.json()

  const cache: CurrencyCache = {
    base: data.base,
    rates: data.rates,
    timestamp: Date.now(),
    date: data.date,
  }
  setCachedRates(base, cache)
  return cache
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<ConversionResult> {
  if (from === to) {
    return { fromAmount: amount, toAmount: amount, fromCurrency: from, toCurrency: to, rate: 1, date: new Date().toISOString().split('T')[0] }
  }

  const cache = await fetchRates(from)
  const rate = cache.rates[to]
  if (rate === undefined) throw new Error(`Rate not found for ${to}`)

  return {
    fromAmount: amount,
    toAmount: parseFloat((amount * rate).toFixed(6)),
    fromCurrency: from,
    toCurrency: to,
    rate,
    date: cache.date,
  }
}
