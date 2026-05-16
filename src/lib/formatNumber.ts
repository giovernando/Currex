/**
 * Format a numeric string for display by adding thousand separators
 * to the integer portion while preserving:
 *  - the decimal part (and trailing dot during typing, e.g. "12.")
 *  - leading minus sign
 *  - special tokens like "Error"
 *
 * Locale: id-ID style (titik untuk ribuan, koma untuk desimal).
 */
export const formatDisplay = (value: string): string => {
  if (!value || value === "Error") return value;

  // Detect sign
  const negative = value.startsWith("-");
  const raw = negative ? value.slice(1) : value;

  // Split integer / decimal parts (keep trailing dot if user is typing)
  const hasDot = raw.includes(".");
  const [intPartRaw, decPartRaw = ""] = raw.split(".");

  // Only digits in integer; if not numeric, return original
  if (!/^\d*$/.test(intPartRaw)) return value;

  const intFormatted = intPartRaw.length
    ? Number(intPartRaw).toLocaleString("id-ID")
    : "0";

  let result = intFormatted;
  if (hasDot) {
    // Use comma as decimal separator to match id-ID convention
    result += "," + decPartRaw;
  }

  return (negative ? "-" : "") + result;
};

/**
 * Format an expression string (e.g. "1234 + 56") by applying
 * thousand separators to each numeric token it contains.
 */
export const formatExpression = (expr: string): string => {
  if (!expr) return expr;
  return expr.replace(/-?\d+(\.\d+)?/g, (match) => formatDisplay(match));
};
