import { AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { HistoryCard } from './HistoryCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { useHistoryStore, selectFilteredEntries } from '../store/historyStore'

export function HistoryList() {
  const entries = useHistoryStore((s) => s.entries)
  const searchQuery = useHistoryStore((s) => s.searchQuery)
  const filterType = useHistoryStore((s) => s.filterType)

  const filteredEntries = useMemo(
    () => selectFilteredEntries(entries, searchQuery, filterType),
    [entries, searchQuery, filterType]
  )

  if (filteredEntries.length === 0) {
    return (
      <EmptyState
        icon="🕐"
        title="No history yet"
        description="Your calculations and conversions will appear here"
      />
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {filteredEntries.map((entry, i) => (
          <HistoryCard key={entry.id} entry={entry} index={i} />
        ))}
      </AnimatePresence>
    </div>
  )
}

