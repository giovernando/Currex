import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { useHistoryStore } from '../store/historyStore'
import type { HistoryEntry } from '@/types'
import { getCurrencyFlag } from '@/features/currency/constants/currencies'

interface HistoryCardProps {
  entry: HistoryEntry
  index: number
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function HistoryCard({ entry, index }: HistoryCardProps) {
  const deleteEntry = useHistoryStore((s) => s.deleteEntry)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${entry.expression} = ${entry.result}`).catch(() => {})
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      className="
        glass rounded-xl border border-[var(--border-color)] p-3.5
        hover:border-[var(--border-color-strong)] transition-all duration-150
        group relative overflow-hidden
      "
    >
      {/* Accent glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--accent-glow)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge type={entry.type} />
            {entry.type === 'currency' && entry.meta && (
              <span className="text-xs text-[var(--text-muted)]">
                {getCurrencyFlag(entry.meta.fromCurrency || '')} → {getCurrencyFlag(entry.meta.toCurrency || '')}
              </span>
            )}
          </div>
          <div className="text-[var(--text-muted)] text-xs font-mono truncate mb-0.5">
            {entry.expression}
          </div>
          <div className="text-[var(--text-primary)] font-mono font-semibold text-base">
            {entry.result}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[10px] text-[var(--text-muted)]">{formatTime(entry.timestamp)}</span>
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              title="Copy result"
              className="w-6 h-6 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center text-xs transition-all"
            >
              ⧉
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => deleteEntry(entry.id)}
              title="Delete"
              className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs transition-all"
            >
              ✕
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
