import { motion } from 'framer-motion'
import { getCurrencyFlag } from '../constants/currencies'
import { POPULAR_CURRENCIES } from '@/constants/app'

interface QuickCurrenciesProps {
  selected: string
  onSelect: (code: string) => void
  recentCurrencies?: string[]
}

export function QuickCurrencies({ selected, onSelect, recentCurrencies }: QuickCurrenciesProps) {
  const list = recentCurrencies?.length ? recentCurrencies.slice(0, 8) : [...POPULAR_CURRENCIES].slice(0, 8)

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1">
        Quick Select
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((code) => (
          <motion.button
            key={code}
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelect(code)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-2xl
              text-xs font-bold transition-all duration-300 border
              ${selected === code
                ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--violet)] text-white border-transparent shadow-lg shadow-[var(--accent-glow)]'
                : 'glass border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] hover:shadow-md'
              }
            `}
          >
            <span className="text-base leading-none">{getCurrencyFlag(code)}</span>
            <span>{code}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
