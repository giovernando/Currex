import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import {
  CURRENCIES,
  useCurrencyConverter,
  type CurrencyCode,
} from "@/hooks/useCurrencyConverter";
import { useHaptics } from "@/hooks/useHaptics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDisplay } from "@/lib/formatNumber";

const formatCurrency = (value: number, code: CurrencyCode) => {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: code,
      maximumFractionDigits: code === "IDR" || code === "JPY" || code === "KRW" ? 0 : 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

interface CurrencyFieldProps {
  label: string;
  value: CurrencyCode;
  onChange: (v: CurrencyCode) => void;
  inputValue?: string;
  onInput?: (v: string) => void;
  readOnly?: boolean;
  displayValue?: string;
}

const CurrencyField = ({
  label, value, onChange, inputValue, onInput, readOnly, displayValue,
}: CurrencyFieldProps) => {
  const meta = CURRENCIES.find((c) => c.code === value)!;
  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 shadow-key">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <Select value={value} onValueChange={(v) => onChange(v as CurrencyCode)}>
          <SelectTrigger className="h-10 w-auto gap-2 bg-secondary border border-border rounded-sm text-sm font-bold uppercase tracking-widest px-3">
            <SelectValue>
              <span className="flex items-center gap-2">
                <span className="text-xl leading-none">{meta.flag}</span>
                {meta.code}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-xs text-muted-foreground">{c.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {readOnly ? (
        <div className="text-right text-3xl sm:text-4xl font-retro lcd-text break-all min-h-[3rem] bg-gradient-display scanlines p-2 rounded border-2 border-card shadow-inner leading-none flex items-center justify-end">
          {displayValue ?? "—"}
        </div>
      ) : (
        <div className="bg-gradient-display scanlines p-1 px-2 rounded border-2 border-card shadow-inner">
          <Input
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => onInput?.(e.target.value.replace(/[^0-9.,]/g, ""))}
            placeholder="0"
            className="text-right text-7xl sm:text-8xl font-retro lcd-text h-auto py-0 border-0 bg-transparent focus-visible:ring-0 px-0 shadow-none leading-none"
          />
        </div>
      )}
    </div>
  );
};

export const CurrencyConverter = () => {
  const haptic = useHaptics();
  const {
    amount, from, to, rate, result, loading, error, lastUpdated,
    setAmount, setFrom, setTo, swap, refresh,
  } = useCurrencyConverter();

  const onSwap = () => { haptic(15); swap(); };
  const onRefresh = () => { haptic(10); refresh(); };

  return (
    <div className="space-y-3">
      <CurrencyField
        label="Amount"
        value={from}
        onChange={(c) => { haptic(8); setFrom(c); }}
        inputValue={formatDisplay(amount)}
        onInput={(v) => {
          // Convert from id-ID (dot=thousand, comma=decimal) back to raw (dot=decimal)
          const raw = v.replace(/\./g, "").replace(",", ".");
          setAmount(raw);
        }}
      />

      <div className="flex justify-center -my-1.5 relative z-10">
        <motion.button
          type="button"
          onClick={onSwap}
          whileTap={{ scale: 0.85, rotate: 180 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="h-11 w-11 rounded-sm bg-gradient-primary text-primary-foreground shadow-key flex items-center justify-center border-2 border-border"
          aria-label="Swap currencies"
        >
          <ArrowDownUp className="h-4 w-4" />
        </motion.button>
      </div>

      <CurrencyField
        label="Converted to"
        value={to}
        onChange={(c) => { haptic(8); setTo(c); }}
        readOnly
        displayValue={
          loading
            ? "…"
            : result !== null
              ? formatCurrency(result, to)
              : "—"
        }
      />

      {/* Rate info */}
      <div className="flex items-center justify-between bg-card rounded-lg px-4 py-2.5 border-2 border-border shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-tight">
          <TrendingUp className={cn("h-3 w-3", error ? "text-destructive" : "text-primary")} />
          <AnimatePresence mode="wait">
            <motion.span
              key={`${from}-${to}-${rate}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-muted-foreground"
            >
              {error
                ? "Rate error"
                : rate !== null
                  ? `1 ${from} = ${rate.toLocaleString("id-ID", { maximumFractionDigits: 6 })} ${to}`
                  : "Loading..."}
            </motion.span>
          </AnimatePresence>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onRefresh}
          aria-label="Refresh rate"
          className="h-7 w-7 rounded-sm border border-border bg-secondary hover:bg-secondary/80"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive px-1">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </div>
      )}

      <p className="text-center text-[10px] text-muted-foreground/60">
        {lastUpdated ? `Rates as of ${lastUpdated}` : "Live exchange rates"} · Powered by Frankfurter
      </p>
    </div>
  );
};

export default CurrencyConverter;
