import { motion } from 'framer-motion'
import { useHistoryStore } from '../store/historyStore'
import type { HistoryType } from '@/types'

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'currency', label: 'Currency' },
] as const

export function HistoryFilters() {
  const { searchQuery, filterType, setSearchQuery, setFilterType } = useHistoryStore()

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm pointer-events-none">
          🔍
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search history..."
          className="
            w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
            glass border border-[var(--border-color)]
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            focus:border-[var(--accent)] outline-none transition-all
          "
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex gap-2">
        {FILTER_TABS.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterType(tab.id as HistoryType | 'all')}
            className={`
              flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150
              ${filterType === tab.id
                ? 'bg-[var(--accent)] text-white shadow-[0_0_12px_var(--accent-glow)]'
                : 'glass text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
