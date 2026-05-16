import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrencyFlag } from '../constants/currencies'

interface CurrencySelectorProps {
  value: string
  currencies: Record<string, string>
  onChange: (code: string) => void
  label: string
  id: string
}

export function CurrencySelector({ value, currencies, onChange, label, id }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    if (isOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const currencyList = Object.entries(currencies)
  const filtered = search
    ? currencyList.filter(
        ([code, name]) =>
          code.toLowerCase().includes(search.toLowerCase()) ||
          name.toLowerCase().includes(search.toLowerCase())
      )
    : currencyList

  const handleSelect = (code: string) => {
    onChange(code)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div ref={ref} className="relative flex-1">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1.5 ml-1">
        {label}
      </label>
      <motion.button
        id={id}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01, borderColor: 'var(--accent)' }}
        onClick={() => setIsOpen((o) => !o)}
        className={`
          w-full flex items-center gap-3 px-4 py-3.5
          glass rounded-2xl border border-[var(--border-color)]
          transition-all duration-200
          text-[var(--text-primary)] font-medium text-sm
          ${isOpen ? 'border-[var(--accent)] ring-2 ring-[var(--accent-subtle)]' : ''}
        `}
      >
        <span className="text-2xl">{getCurrencyFlag(value)}</span>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="font-bold text-base leading-tight">{value}</span>
          <span className="text-[10px] text-[var(--text-muted)] truncate w-full text-left font-medium">
            {currencies[value] || ''}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--text-muted)] text-xs"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              absolute top-full mt-3 left-0 right-0 z-50
              glass-premium rounded-3xl border border-[var(--border-color-strong)]
              shadow-2xl overflow-hidden backdrop-blur-3xl
            "
          >
            <div className="p-3 border-b border-[var(--border-color)] bg-white/5">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search currencies..."
                  className="
                    w-full bg-white/5 text-sm text-[var(--text-primary)]
                    placeholder:text-[var(--text-muted)] outline-none
                    pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border-color)]
                    focus:border-[var(--accent)] transition-all
                  "
                />
              </div>
            </div>
            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-sm text-[var(--text-muted)] text-center font-medium">
                  No currencies found
                </div>
              ) : (
                filtered.map(([code, name]) => (
                  <motion.button
                    key={code}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    onClick={() => handleSelect(code)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 text-left
                      transition-all text-sm group
                      ${code === value ? 'bg-[var(--accent-subtle)]' : ''}
                    `}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{getCurrencyFlag(code)}</span>
                    <div className="flex flex-col flex-1">
                      <span className={`font-bold ${code === value ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                        {code}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-medium truncate max-w-[150px]">
                        {name}
                      </span>
                    </div>
                    {code === value && (
                      <span className="text-[var(--accent)]">
                        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
