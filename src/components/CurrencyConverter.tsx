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
    <div className="bg-card/60 border border-border/40 rounded-2xl p-4 backdrop-blur">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <Select value={value} onValueChange={(v) => onChange(v as CurrencyCode)}>
          <SelectTrigger className="h-8 w-auto gap-1.5 bg-secondary/60 border-border/40 rounded-full text-xs font-semibold">
            <SelectValue>
              <span className="flex items-center gap-1.5">
                <span className="text-base leading-none">{meta.flag}</span>
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
        <div className="text-right text-3xl sm:text-4xl font-display font-semibold text-display break-all min-h-[2.75rem]">
          {displayValue ?? "—"}
        </div>
      ) : (
        <Input
          inputMode="decimal"
          value={inputValue}
          onChange={(e) => onInput?.(e.target.value.replace(/[^0-9.,]/g, ""))}
          placeholder="0"
          className="text-right text-3xl sm:text-4xl font-display font-semibold h-auto py-1 border-0 bg-transparent focus-visible:ring-0 px-0 shadow-none"
        />
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
        inputValue={amount}
        onInput={setAmount}
      />

      <div className="flex justify-center -my-1.5 relative z-10">
        <motion.button
          type="button"
          onClick={onSwap}
          whileTap={{ scale: 0.85, rotate: 180 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          className="h-11 w-11 rounded-full bg-gradient-primary text-primary-foreground shadow-glow flex items-center justify-center border-4 border-background"
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
      <div className="flex items-center justify-between bg-secondary/30 rounded-xl px-4 py-2.5 border border-border/30">
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className={cn("h-3.5 w-3.5", error ? "text-destructive" : "text-accent")} />
          <AnimatePresence mode="wait">
            <motion.span
              key={`${from}-${to}-${rate}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-muted-foreground"
            >
              {error
                ? "Rate unavailable"
                : rate !== null
                  ? `1 ${from} = ${rate.toLocaleString("id-ID", { maximumFractionDigits: 6 })} ${to}`
                  : "Loading rate…"}
            </motion.span>
          </AnimatePresence>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onRefresh}
          aria-label="Refresh rate"
          className="h-7 w-7 rounded-full hover:bg-secondary"
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
