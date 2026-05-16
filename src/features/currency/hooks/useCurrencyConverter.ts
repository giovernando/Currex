import { useState, useEffect, useCallback, useRef } from 'react'
import { convertCurrency, fetchCurrencies } from '../services/frankfurterApi'
import type { ConversionResult } from '@/types'
import { POPULAR_CURRENCIES, STORAGE_KEYS } from '@/constants/app'

export function useCurrencyConverter() {
  const [amount, setAmount] = useState('1')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('IDR')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [currencies, setCurrencies] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentCurrencies, setRecentCurrencies] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_CURRENCIES)
      return stored ? JSON.parse(stored) : [...POPULAR_CURRENCIES]
    } catch {
      return [...POPULAR_CURRENCIES]
    }
  })

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load currencies list once
  useEffect(() => {
    fetchCurrencies()
      .then(setCurrencies)
      .catch(() => setError('Failed to load currencies'))
  }, [])

  // Debounced conversion
  const convert = useCallback(() => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setResult(null)
      return
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await convertCurrency(numAmount, fromCurrency, toCurrency)
        setResult(res)
      } catch (e) {
        setError((e as Error).message)
        setResult(null)
      } finally {
        setIsLoading(false)
      }
    }, 400)
  }, [amount, fromCurrency, toCurrency])

  useEffect(() => {
    convert()
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [convert])

  const swap = useCallback(() => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }, [fromCurrency, toCurrency])

  const addRecentCurrency = useCallback((code: string) => {
    setRecentCurrencies((prev) => {
      const filtered = prev.filter((c) => c !== code)
      const updated = [code, ...filtered].slice(0, 12)
      try {
        localStorage.setItem(STORAGE_KEYS.RECENT_CURRENCIES, JSON.stringify(updated))
      } catch { /* ignore */ }
      return updated
    })
  }, [])

  const handleFromCurrency = useCallback((code: string) => {
    setFromCurrency(code)
    addRecentCurrency(code)
  }, [addRecentCurrency])

  const handleToCurrency = useCallback((code: string) => {
    setToCurrency(code)
    addRecentCurrency(code)
  }, [addRecentCurrency])

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency: handleFromCurrency,
    toCurrency,
    setToCurrency: handleToCurrency,
    result,
    currencies,
    isLoading,
    error,
    swap,
    recentCurrencies,
  }
}
