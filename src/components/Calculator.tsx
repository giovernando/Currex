import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Delete,
  Divide,
  Minus,
  Plus,
  X as Times,
  Equal,
  Percent,
  History as HistoryIcon,
  Trash2,
  Download,
  Check,
  FlaskConical,
  Calculator as CalcIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCalculator,
  type Operator,
  type HistoryEntry,
  type ScientificFn,
} from "@/hooks/useCalculator";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";
import { formatDisplay, formatExpression } from "@/lib/formatNumber";

/* -------------------------------------------------------------------------- */
/*                               Sub-components                               */
/* -------------------------------------------------------------------------- */

interface KeyProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "muted" | "operator" | "equals" | "accent" | "scientific";
  span?: 1 | 2;
  ariaLabel?: string;
  size?: "default" | "sm";
}

const keyClasses: Record<NonNullable<KeyProps["variant"]>, string> = {
  default: "bg-card text-foreground hover:bg-card/80 border-2 border-border shadow-key active:shadow-none",
  muted: "bg-secondary text-muted-foreground hover:text-foreground shadow-key active:shadow-none",
  operator: "bg-gradient-operator text-operator-foreground shadow-key active:shadow-none border-b-4 border-black/20",
  equals: "bg-gradient-primary text-primary-foreground shadow-key active:shadow-none border-b-4 border-black/20 font-bold",
  accent: "bg-accent text-accent-foreground hover:bg-accent/80 font-bold shadow-key active:shadow-none",
  scientific:
    "bg-secondary/70 text-accent hover:bg-secondary border-2 border-border/50 font-medium shadow-key active:shadow-none",
};

const CalcKey = ({
  label,
  onClick,
  variant = "default",
  span = 1,
  ariaLabel,
  size = "default",
}: KeyProps) => (
  <motion.button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    whileTap={{ scale: 0.92 }}
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 500, damping: 24 }}
    className={cn(
      "rounded-lg font-retro select-none flex items-center justify-center transition-all active:translate-y-0.5 active:shadow-none",
      size === "default" ? "h-16 sm:h-[68px] text-2xl sm:text-3xl" : "h-12 text-lg sm:text-xl",
      span === 2 && "col-span-2",
      keyClasses[variant],
    )}
  >
    {label}
  </motion.button>
);

const Display = ({ expression, display }: { expression: string; display: string }) => {
  const formatted = formatDisplay(display);
  const formattedExpr = formatExpression(expression);
  return (
    <div className="bg-gradient-display scanlines rounded-lg p-6 sm:p-7 mb-5 border-4 border-card shadow-inner min-h-[120px] flex flex-col justify-end">
      <div className="h-6 text-right text-sm lcd-text opacity-70 truncate font-mono mb-1">
        {formattedExpr || "\u00A0"}
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={formatted}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="text-right text-5xl sm:text-6xl font-retro lcd-text break-all"
        >
          {formatted}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const HistoryPanel = ({
  open,
  history,
  onSelect,
  onClear,
}: {
  open: boolean;
  history: HistoryEntry[];
  onSelect: (e: HistoryEntry) => void;
  onClear: () => void;
}) => (
  <AnimatePresence initial={false}>
    {open && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="bg-card rounded-lg border-2 border-border mb-5 p-4 shadow-elegant">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              History
            </h2>
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground/70 py-6 text-center">
              No calculations yet.
            </p>
          ) : (
            <ul className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {history.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => onSelect(h)}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                  >
                    <div className="text-[10px] text-muted-foreground font-mono truncate uppercase">
                      {formatExpression(h.expression)}
                    </div>
                    <div className="text-xl font-retro group-hover:text-primary transition-colors">
                      = {formatDisplay(h.result)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const InstallButton = () => {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  if (installed) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-accent" /> Installed
      </span>
    );
  }
  if (!canInstall) return null;
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={promptInstall}
      className="h-8 gap-1.5 text-xs bg-secondary/60 hover:bg-secondary"
    >
      <Download className="h-3.5 w-3.5" /> Install App
    </Button>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Main Calculator                               */
/* -------------------------------------------------------------------------- */

type Mode = "basic" | "scientific";

export const Calculator = () => {
  const calc = useCalculator();
  const haptic = useHaptics();
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<Mode>("basic");

  // Wrap any action with haptic feedback.
  const buzz = <T extends (...args: never[]) => void>(fn: T, pattern: number | number[] = 12) =>
    ((...args: Parameters<T>) => {
      haptic(pattern);
      fn(...args);
    }) as T;

  const opIcon = (op: Operator) => {
    const cls = "h-6 w-6";
    switch (op) {
      case "+":
        return <Plus className={cls} />;
      case "-":
        return <Minus className={cls} />;
      case "×":
        return <Times className={cls} />;
      case "÷":
        return <Divide className={cls} />;
    }
  };

  const sciButtons: { label: string; fn: ScientificFn }[] = [
    { label: "sin", fn: "sin" },
    { label: "cos", fn: "cos" },
    { label: "tan", fn: "tan" },
    { label: "π", fn: "pi" },
    { label: "log", fn: "log" },
    { label: "ln", fn: "ln" },
    { label: "√", fn: "sqrt" },
    { label: "x²", fn: "square" },
  ];

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      {/* Header */}
      <header className="flex items-center justify-between mb-5 px-1">
        <div>
          <h1 className="font-retro text-3xl font-bold tracking-widest text-primary uppercase">vrnan</h1>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Model 3000-X // v.1.0</p>
        </div>
        <div className="flex items-center gap-2">
          <InstallButton />
          <Button
            size="icon"
            variant="ghost"
            onClick={buzz(() => setShowHistory((s) => !s))}
            aria-label="Toggle history"
            className={cn(
              "h-9 w-9 rounded-sm bg-card border border-border hover:bg-secondary",
              showHistory && "bg-primary text-primary-foreground shadow-key",
            )}
          >
            <HistoryIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Display expression={calc.expression} display={calc.display} />

      <HistoryPanel
        open={showHistory}
        history={calc.history}
        onSelect={(e) => {
          haptic(8);
          calc.recallHistory(e);
        }}
        onClear={buzz(calc.clearHistory, [10, 30, 10])}
      />

      {/* Mode toggle */}
      <div className="flex items-center bg-card border-2 border-border rounded-lg p-1 mb-6">
        {(["basic", "scientific"] as Mode[]).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={buzz(() => setMode(m))}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 text-[10px] font-bold py-2 rounded-md transition-all uppercase tracking-wider",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "basic" ? <CalcIcon className="h-3 w-3" /> : <FlaskConical className="h-3 w-3" />}
              {m === "basic" ? "Standard" : "Scientific"}
            </button>
          );
        })}
      </div>

      {/* Scientific row */}
      <AnimatePresence initial={false}>
        {mode === "scientific" && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-2">
              {sciButtons.map((b) => (
                <CalcKey
                  key={b.fn}
                  label={b.label}
                  variant="scientific"
                  size="sm"
                  onClick={buzz(() => calc.applyFunction(b.fn))}
                  ariaLabel={b.label}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
              Trigonometri menggunakan derajat (°)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3">
        <CalcKey label="AC" variant="muted" onClick={buzz(calc.clearAll, [8, 20, 8])} ariaLabel="All clear" />
        <CalcKey label="±" variant="muted" onClick={buzz(calc.toggleSign)} ariaLabel="Toggle sign" />
        <CalcKey label={<Percent className="h-5 w-5" />} variant="muted" onClick={buzz(calc.percent)} ariaLabel="Percent" />
        <CalcKey
          label={opIcon("÷")}
          variant="operator"
          onClick={buzz(() => calc.performOperation("÷"))}
          ariaLabel="Divide"
        />

        <CalcKey label="7" onClick={buzz(() => calc.inputDigit("7"))} />
        <CalcKey label="8" onClick={buzz(() => calc.inputDigit("8"))} />
        <CalcKey label="9" onClick={buzz(() => calc.inputDigit("9"))} />
        <CalcKey
          label={opIcon("×")}
          variant="operator"
          onClick={buzz(() => calc.performOperation("×"))}
          ariaLabel="Multiply"
        />

        <CalcKey label="4" onClick={buzz(() => calc.inputDigit("4"))} />
        <CalcKey label="5" onClick={buzz(() => calc.inputDigit("5"))} />
        <CalcKey label="6" onClick={buzz(() => calc.inputDigit("6"))} />
        <CalcKey
          label={opIcon("-")}
          variant="operator"
          onClick={buzz(() => calc.performOperation("-"))}
          ariaLabel="Subtract"
        />

        <CalcKey label="1" onClick={buzz(() => calc.inputDigit("1"))} />
        <CalcKey label="2" onClick={buzz(() => calc.inputDigit("2"))} />
        <CalcKey label="3" onClick={buzz(() => calc.inputDigit("3"))} />
        <CalcKey
          label={opIcon("+")}
          variant="operator"
          onClick={buzz(() => calc.performOperation("+"))}
          ariaLabel="Add"
        />

        <CalcKey label="0" span={2} onClick={buzz(() => calc.inputDigit("0"))} />
        <CalcKey label="." onClick={buzz(calc.inputDecimal)} ariaLabel="Decimal point" />
        <CalcKey
          label={<Equal className="h-6 w-6" />}
          variant="equals"
          onClick={buzz(calc.equals, [15, 25, 15])}
          ariaLabel="Equals"
        />

        <CalcKey
          label={<Delete className="h-5 w-5" />}
          variant="muted"
          span={2}
          onClick={buzz(calc.backspace)}
          ariaLabel="Backspace"
        />
      </div>

      <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
        Works offline · Tap install to add to your device
      </p>
    </div>
  );
};

export default Calculator;
