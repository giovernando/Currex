import { motion } from 'framer-motion'
import { Spinner } from '@/components/ui/Spinner'
import { formatRate, getCurrencyFlag } from '../constants/currencies'
import type { ConversionResult } from '@/types'

interface RateInfoProps {
  result: ConversionResult | null
  isLoading: boolean
  error: string | null
}

export function RateInfo({ result, isLoading, error }: RateInfoProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Spinner size="sm" />
        <span className="ml-2 text-sm text-[var(--text-muted)]">Fetching rate...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 py-4 px-1">
        <span className="text-red-400 text-sm">⚠ {error}</span>
      </div>
    )
  }

  if (!result) return null

  const formattedRate = formatRate(result.rate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 pt-2"
    >
      {/* Result amount */}
      <div className="glass-premium rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[var(--accent)] opacity-10 blur-3xl rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--text-muted)]">
              Converted Amount
            </span>
            <span className="text-2xl">{getCurrencyFlag(result.toCurrency)}</span>
          </div>
          
          <div className="flex flex-col">
            <motion.div 
              key={result.toAmount}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold tracking-tighter text-gradient-premium break-all"
            >
              {result.toAmount.toLocaleString('en-US', { 
                maximumFractionDigits: result.toAmount > 100 ? 2 : 4 
              })}
            </motion.div>
            <div className="text-lg font-semibold text-[var(--text-secondary)] mt-1">
              {result.toCurrency}
            </div>
          </div>
        </div>
      </div>

      {/* Rate info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-tight font-bold mb-0.5">
            Exchange Rate
          </div>
          <div className="text-sm font-medium text-[var(--text-primary)]">
            1 {result.fromCurrency} = {' '}
            <span className="text-[var(--accent)] font-bold">{formattedRate}</span> {result.toCurrency}
          </div>
        </div>
        <div className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-1 rounded-lg border border-[var(--border-color)]">
          {result.date}
        </div>
      </div>
    </motion.div>
  )
}
