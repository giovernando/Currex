import { useCallback, useEffect, useRef, useState } from "react";

export type CurrencyCode =
  | "IDR" | "USD" | "EUR" | "JPY" | "GBP"
  | "SGD" | "MYR" | "KRW" | "AUD" | "CNY";

export interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  flag: string;
  symbol: string;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: "IDR", name: "Indonesian Rupiah",   flag: "🇮🇩", symbol: "Rp" },
  { code: "USD", name: "US Dollar",           flag: "🇺🇸", symbol: "$"  },
  { code: "EUR", name: "Euro",                flag: "🇪🇺", symbol: "€"  },
  { code: "JPY", name: "Japanese Yen",        flag: "🇯🇵", symbol: "¥"  },
  { code: "GBP", name: "British Pound",       flag: "🇬🇧", symbol: "£"  },
  { code: "SGD", name: "Singapore Dollar",    flag: "🇸🇬", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit",   flag: "🇲🇾", symbol: "RM" },
  { code: "KRW", name: "South Korean Won",    flag: "🇰🇷", symbol: "₩"  },
  { code: "AUD", name: "Australian Dollar",   flag: "🇦🇺", symbol: "A$" },
  { code: "CNY", name: "Chinese Yuan",        flag: "🇨🇳", symbol: "¥"  },
];

const normalizeApiBase = (value?: string) => {
  const base = value?.replace(/\/$/, "") || "https://api.frankfurter.dev/v1";

  // frankfurter.app now redirects to frankfurter.dev/v1. Some browsers block
  // cross-origin redirected API calls, so use the final endpoint directly.
  if (base === "https://api.frankfurter.app") return "https://api.frankfurter.dev/v1";
  if (base === "https://api.frankfurter.dev") return "https://api.frankfurter.dev/v1";

  return base;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_EXCHANGE_API as string | undefined);

interface RateCacheEntry {
  rate: number;
  fetchedAt: number;
  date: string;
}

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const cache = new Map<string, RateCacheEntry>();

const cacheKey = (from: CurrencyCode, to: CurrencyCode) => `${from}->${to}`;

async function fetchRate(from: CurrencyCode, to: CurrencyCode): Promise<RateCacheEntry> {
  if (from === to) {
    return { rate: 1, fetchedAt: Date.now(), date: new Date().toISOString().slice(0, 10) };
  }

  const url = `${API_BASE}/latest?from=${from}&to=${to}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Failed to fetch rate (${res.status})`);

    const data = await res.json();
    const rate = data?.rates?.[to];
    if (typeof rate !== "number") throw new Error("Rate unavailable for this pair");

    return { rate, fetchedAt: Date.now(), date: data.date ?? new Date().toISOString().slice(0, 10) };
  } catch (error) {
    throw new Error(
      error instanceof Error && error.message.includes("Rate unavailable")
        ? error.message
        : "Koneksi kurs gagal. Coba refresh atau periksa koneksi internet."
    );
  }
}

export interface UseCurrencyConverter {
  amount: string;
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number | null;
  result: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  setAmount: (v: string) => void;
  setFrom: (c: CurrencyCode) => void;
  setTo: (c: CurrencyCode) => void;
  swap: () => void;
  refresh: () => void;
}

const STORAGE_KEY = "vrnan-currency-prefs";

interface Prefs { from: CurrencyCode; to: CurrencyCode; amount: string }

const loadPrefs = (): Prefs => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Prefs;
  } catch { /* ignore */ }
  return { from: "USD", to: "IDR", amount: "1" };
};

export const useCurrencyConverter = (): UseCurrencyConverter => {
  const init = useRef(loadPrefs()).current;
  const [amount, setAmount] = useState<string>(init.amount);
  const [from, setFrom] = useState<CurrencyCode>(init.from);
  const [to, setTo] = useState<CurrencyCode>(init.to);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // Persist prefs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ from, to, amount }));
    } catch { /* ignore */ }
  }, [from, to, amount]);

  // Fetch rate when pair changes
  useEffect(() => {
    let cancelled = false;
    const key = cacheKey(from, to);
    const cached = cache.get(key);
    const fresh = cached && Date.now() - cached.fetchedAt < CACHE_TTL && nonce === 0;

    if (fresh && cached) {
      setRate(cached.rate);
      setLastUpdated(cached.date);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    fetchRate(from, to)
      .then((entry) => {
        if (cancelled) return;
        cache.set(key, entry);
        setRate(entry.rate);
        setLastUpdated(entry.date);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load exchange rate");
        setRate(null);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [from, to, nonce]);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const refresh = useCallback(() => {
    cache.delete(cacheKey(from, to));
    setNonce((n) => n + 1);
  }, [from, to]);

  const numeric = parseFloat(amount.replace(",", "."));
  const result =
    rate !== null && !Number.isNaN(numeric) ? numeric * rate : null;

  return {
    amount, from, to, rate, result, loading, error, lastUpdated,
    setAmount, setFrom, setTo, swap, refresh,
  };
};
