import { useCallback, useEffect, useState } from "react";

export type Operator = "+" | "-" | "×" | "÷";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

const HISTORY_KEY = "vrnan-calc-history";

export type ScientificFn = "sin" | "cos" | "tan" | "log" | "ln" | "sqrt" | "square" | "pi" | "exp";

const applyScientific = (n: number, fn: ScientificFn): number => {
  switch (fn) {
    case "sin":
      return Math.sin((n * Math.PI) / 180); // degrees
    case "cos":
      return Math.cos((n * Math.PI) / 180);
    case "tan":
      return Math.tan((n * Math.PI) / 180);
    case "log":
      return Math.log10(n);
    case "ln":
      return Math.log(n);
    case "sqrt":
      return Math.sqrt(n);
    case "square":
      return n * n;
    case "exp":
      return Math.exp(n);
    case "pi":
      return Math.PI;
  }
};

const fnLabel: Record<ScientificFn, string> = {
  sin: "sin",
  cos: "cos",
  tan: "tan",
  log: "log",
  ln: "ln",
  sqrt: "√",
  square: "sqr",
  exp: "eˣ",
  pi: "π",
};
const MAX_HISTORY = 50;

const compute = (a: number, b: number, op: Operator): number => {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
};

const formatResult = (n: number): string => {
  if (!Number.isFinite(n)) return "Error";
  // Trim long floats but keep precision.
  const rounded = Math.round(n * 1e10) / 1e10;
  return String(rounded);
};

export const useCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // ignore quota
    }
  }, [history]);

  const inputDigit = useCallback(
    (digit: string) => {
      setDisplay((curr) => {
        if (waitingForOperand) {
          setWaitingForOperand(false);
          return digit;
        }
        if (curr === "0") return digit;
        if (curr.replace(/[-.]/g, "").length >= 12) return curr;
        return curr + digit;
      });
    },
    [waitingForOperand],
  );

  const inputDecimal = useCallback(() => {
    setDisplay((curr) => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return "0.";
      }
      return curr.includes(".") ? curr : curr + ".";
    });
  }, [waitingForOperand]);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression("");
  }, []);

  const backspace = useCallback(() => {
    setDisplay((curr) => {
      if (waitingForOperand || curr === "Error") return curr;
      if (curr.length <= 1 || (curr.length === 2 && curr.startsWith("-"))) return "0";
      return curr.slice(0, -1);
    });
  }, [waitingForOperand]);

  const toggleSign = useCallback(() => {
    setDisplay((curr) => {
      if (curr === "0" || curr === "Error") return curr;
      return curr.startsWith("-") ? curr.slice(1) : "-" + curr;
    });
  }, []);

  const percent = useCallback(() => {
    setDisplay((curr) => {
      const n = parseFloat(curr);
      return Number.isFinite(n) ? formatResult(n / 100) : curr;
    });
  }, []);

  const performOperation = useCallback(
    (nextOperator: Operator) => {
      const inputValue = parseFloat(display);

      if (previous === null) {
        setPrevious(inputValue);
      } else if (operator && !waitingForOperand) {
        const result = compute(previous, inputValue, operator);
        const formatted = formatResult(result);
        setDisplay(formatted);
        setPrevious(Number.isFinite(result) ? result : null);
      }

      setExpression(`${formatResult(parseFloat(display))} ${nextOperator}`);
      setWaitingForOperand(true);
      setOperator(nextOperator);
    },
    [display, operator, previous, waitingForOperand],
  );

  const equals = useCallback(() => {
    if (operator === null || previous === null) return;
    const inputValue = parseFloat(display);
    const result = compute(previous, inputValue, operator);
    const formatted = formatResult(result);
    const expr = `${formatResult(previous)} ${operator} ${formatResult(inputValue)}`;

    setDisplay(formatted);
    setExpression(expr + " =");
    setPrevious(null);
    setOperator(null);
    setWaitingForOperand(true);

    if (formatted !== "Error") {
      setHistory((h) =>
        [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            expression: expr,
            result: formatted,
            timestamp: Date.now(),
          },
          ...h,
        ].slice(0, MAX_HISTORY),
      );
    }
  }, [display, operator, previous]);

  const clearHistory = useCallback(() => setHistory([]), []);

  const recallHistory = useCallback((entry: HistoryEntry) => {
    setDisplay(entry.result);
    setPrevious(null);
    setOperator(null);
    setExpression(entry.expression + " =");
    setWaitingForOperand(true);
  }, []);

  const applyFunction = useCallback(
    (fn: ScientificFn) => {
      if (fn === "pi") {
        const formatted = formatResult(Math.PI);
        setDisplay(formatted);
        setExpression("π");
        setWaitingForOperand(true);
        return;
      }
      const input = parseFloat(display);
      if (!Number.isFinite(input)) return;
      const result = applyScientific(input, fn);
      const formatted = formatResult(result);
      const expr = `${fnLabel[fn]}(${formatResult(input)})`;
      setDisplay(formatted);
      setExpression(expr + " =");
      setPrevious(null);
      setOperator(null);
      setWaitingForOperand(true);

      if (formatted !== "Error") {
        setHistory((h) =>
          [
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              expression: expr,
              result: formatted,
              timestamp: Date.now(),
            },
            ...h,
          ].slice(0, MAX_HISTORY),
        );
      }
    },
    [display],
  );

  return {
    display,
    expression,
    history,
    inputDigit,
    inputDecimal,
    clearAll,
    backspace,
    toggleSign,
    percent,
    performOperation,
    equals,
    clearHistory,
    recallHistory,
    applyFunction,
  };
};
