import { create } from 'zustand'
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval'
import type { HistoryEntry, HistoryType } from '@/types'
import { STORAGE_KEYS, HISTORY_MAX_ITEMS } from '@/constants/app'
import { nanoid } from '@/lib/nanoid'

interface HistoryStore {
  entries: HistoryEntry[]
  searchQuery: string
  filterType: HistoryType | 'all'
  isLoaded: boolean

  // Actions
  loadHistory: () => Promise<void>
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  clearAll: () => Promise<void>
  setSearchQuery: (query: string) => void
  setFilterType: (type: HistoryType | 'all') => void
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  entries: [],
  searchQuery: '',
  filterType: 'all',
  isLoaded: false,

  loadHistory: async () => {
    try {
      const stored = await idbGet<HistoryEntry[]>(STORAGE_KEYS.HISTORY)
      set({ entries: stored || [], isLoaded: true })
    } catch {
      // Fallback to localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.HISTORY)
        set({ entries: raw ? JSON.parse(raw) : [], isLoaded: true })
      } catch {
        set({ entries: [], isLoaded: true })
      }
    }
  },

  addEntry: async (entry) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: nanoid(),
      timestamp: Date.now(),
    }
    const { entries } = get()
    const updated = [newEntry, ...entries].slice(0, HISTORY_MAX_ITEMS)
    set({ entries: updated })
    try {
      await idbSet(STORAGE_KEYS.HISTORY, updated)
    } catch {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated))
    }
  },

  deleteEntry: async (id) => {
    const updated = get().entries.filter((e) => e.id !== id)
    set({ entries: updated })
    try {
      await idbSet(STORAGE_KEYS.HISTORY, updated)
    } catch {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated))
    }
  },

  clearAll: async () => {
    set({ entries: [] })
    try {
      await idbDel(STORAGE_KEYS.HISTORY)
    } catch {
      localStorage.removeItem(STORAGE_KEYS.HISTORY)
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterType: (type) => set({ filterType: type }),
}))

// Selector helper — use this in components to avoid inline fn reference issues
export function selectFilteredEntries(entries: HistoryEntry[], searchQuery: string, filterType: HistoryType | 'all'): HistoryEntry[] {
  return entries.filter((e) => {
    const matchesType = filterType === 'all' || e.type === filterType
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      e.expression.toLowerCase().includes(q) ||
      e.result.toLowerCase().includes(q)
    return matchesType && matchesSearch
  })
}

