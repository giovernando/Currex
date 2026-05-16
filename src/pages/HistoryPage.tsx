import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { HistoryList } from '@/features/history/components/HistoryList'
import { HistoryFilters } from '@/features/history/components/HistoryFilters'
import { useHistoryStore } from '@/features/history/store/historyStore'
import { Card } from '@/components/ui/Card'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export function HistoryPage() {
  const { loadHistory, isLoaded, entries, clearAll } = useHistoryStore()

  useEffect(() => {
    if (!isLoaded) loadHistory()
  }, [isLoaded, loadHistory])

  const count = entries.length

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="h-full flex flex-col gap-4"
    >
      <Card className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">History</h2>
            <p className="text-xs text-[var(--text-muted)]">
              {count} {count === 1 ? 'entry' : 'entries'}
            </p>
          </div>
          {count > 0 && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={clearAll}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
            >
              Clear all
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <HistoryFilters />

        {/* List */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 -mr-1">
          {!isLoaded ? (
            <div className="flex items-center justify-center py-12 text-[var(--text-muted)] text-sm">
              Loading...
            </div>
          ) : (
            <HistoryList />
          )}
        </div>
      </Card>
    </motion.div>
  )
}
