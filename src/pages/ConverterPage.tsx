import { motion } from 'framer-motion'
import { useCurrencyConverter } from '@/features/currency/hooks/useCurrencyConverter'
import { CurrencySelector } from '@/features/currency/components/CurrencySelector'
import { SwapButton } from '@/features/currency/components/SwapButton'
import { RateInfo } from '@/features/currency/components/RateInfo'
import { QuickCurrencies } from '@/features/currency/components/QuickCurrencies'
import { useHistoryStore } from '@/features/history/store/historyStore'
import { Card } from '@/components/ui/Card'
import { getCurrencyFlag } from '@/features/currency/constants/currencies'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export function ConverterPage() {
  const conv = useCurrencyConverter()
  const addEntry = useHistoryStore((s) => s.addEntry)

  const handleSave = () => {
    if (!conv.result) return
    addEntry({
      type: 'currency',
      expression: `${conv.result.fromAmount} ${conv.result.fromCurrency} → ${conv.result.toCurrency}`,
      result: `${conv.result.toAmount.toLocaleString()} ${conv.result.toCurrency}`,
      meta: {
        fromCurrency: conv.result.fromCurrency,
        toCurrency: conv.result.toCurrency,
        rate: conv.result.rate,
      },
    })
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="h-full flex flex-col gap-6 overflow-y-auto px-1 pb-6"
    >
      <div className="flex flex-col space-y-1 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Currency <span className="text-[var(--accent)]">Converter</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          Global exchange rates updated in real-time
        </p>
      </div>

      <Card className="p-6 space-y-6 glass-strong shadow-2xl relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--accent)] opacity-5 blur-[100px] rounded-full" />
        
        {/* Amount Section */}
        <div className="space-y-2 relative z-10">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">
            Input Amount
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform duration-200">
              {getCurrencyFlag(conv.fromCurrency)}
            </span>
            <input
              id="amount-input"
              type="number"
              value={conv.amount}
              onChange={(e) => conv.setAmount(e.target.value)}
              placeholder="0.00"
              min={0}
              className="
                w-full pl-14 pr-6 py-5 rounded-2xl text-3xl font-bold
                glass border border-[var(--border-color)]
                text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-subtle)] 
                outline-none transition-all duration-300
                [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
              "
            />
          </div>
        </div>

        {/* Currency Selection Section */}
        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <div className="w-full sm:flex-1">
            <CurrencySelector
              id="from-currency"
              label="From Currency"
              value={conv.fromCurrency}
              currencies={conv.currencies}
              onChange={conv.setFromCurrency}
            />
          </div>
          
          <div className="flex items-center justify-center pt-5 sm:pt-6">
            <SwapButton onClick={conv.swap} />
          </div>
          
          <div className="w-full sm:flex-1">
            <CurrencySelector
              id="to-currency"
              label="To Currency"
              value={conv.toCurrency}
              currencies={conv.currencies}
              onChange={conv.setToCurrency}
            />
          </div>
        </div>

        {/* Result & Info Section */}
        <div className="pt-2 relative z-10">
          <RateInfo result={conv.result} isLoading={conv.isLoading} error={conv.error} />
        </div>

        {/* Quick Currencies Section */}
        <div className="pt-2 relative z-10 border-t border-[var(--border-color)]">
          <QuickCurrencies
            selected={conv.toCurrency}
            onSelect={conv.setToCurrency}
            recentCurrencies={conv.recentCurrencies}
          />
        </div>

        {/* Action Button */}
        {conv.result && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01, boxShadow: '0 0 20px var(--accent-glow)' }}
            onClick={handleSave}
            className="
              w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest
              text-white bg-gradient-to-r from-[var(--accent)] to-[var(--violet)]
              shadow-lg shadow-[var(--accent-glow)]
              transition-all duration-300 relative z-10
            "
          >
            Add to History
          </motion.button>
        )}
      </Card>
      
      {/* Footer info */}
      <div className="text-center px-4">
        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Data provided by the European Central Bank. Rates are indicative and updated every business day. 
          Market conditions may vary.
        </p>
      </div>
    </motion.div>
  )
}
