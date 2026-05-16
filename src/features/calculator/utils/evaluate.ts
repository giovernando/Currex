/**
 * Safe arithmetic expression evaluator.
 * Supports: +, -, ×, ÷, %, parentheses, decimals, scientific functions.
 * No eval() used.
 */

type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const clean = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')

  while (i < clean.length) {
    const ch = clean[i]

    if (/\d/.test(ch) || (ch === '.' && /\d/.test(clean[i + 1] || ''))) {
      let num = ''
      while (i < clean.length && (/\d/.test(clean[i]) || clean[i] === '.')) {
        num += clean[i++]
      }
      tokens.push({ type: 'number', value: parseFloat(num) })
      continue
    }

    if (ch === '(') { tokens.push({ type: 'lparen' }); i++; continue }
    if (ch === ')') { tokens.push({ type: 'rparen' }); i++; continue }

    if (['+', '-', '*', '/', '%'].includes(ch)) {
      // Handle unary minus
      const isUnary =
        ch === '-' &&
        (tokens.length === 0 ||
          tokens[tokens.length - 1].type === 'operator' ||
          tokens[tokens.length - 1].type === 'lparen')
      if (isUnary) {
        tokens.push({ type: 'number', value: 0 })
      }
      tokens.push({ type: 'operator', value: ch })
      i++
      continue
    }

    i++ // skip unknown chars
  }

  return tokens
}

function precedence(op: string): number {
  if (op === '+' || op === '-') return 1
  if (op === '*' || op === '/' || op === '%') return 2
  return 0
}

function applyOp(left: number, op: string, right: number): number {
  switch (op) {
    case '+': return left + right
    case '-': return left - right
    case '*': return left * right
    case '/':
      if (right === 0) throw new Error('Division by zero')
      return left / right
    case '%': return left % right
    default: throw new Error(`Unknown operator: ${op}`)
  }
}

function evaluate(expr: string): number {
  if (!expr.trim()) throw new Error('Empty expression')

  const tokens = tokenize(expr)
  const values: number[] = []
  const ops: string[] = []

  const processOp = () => {
    const op = ops.pop()!
    const right = values.pop()!
    const left = values.pop()!
    values.push(applyOp(left, op, right))
  }

  for (const token of tokens) {
    if (token.type === 'number') {
      values.push(token.value)
    } else if (token.type === 'lparen') {
      ops.push('(')
    } else if (token.type === 'rparen') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        processOp()
      }
      ops.pop() // remove '('
    } else if (token.type === 'operator') {
      while (
        ops.length &&
        ops[ops.length - 1] !== '(' &&
        precedence(ops[ops.length - 1]) >= precedence(token.value)
      ) {
        processOp()
      }
      ops.push(token.value)
    }
  }

  while (ops.length) processOp()

  if (values.length !== 1) throw new Error('Invalid expression')
  return values[0]
}

export function safeEvaluate(expr: string): { value: number; error: string | null } {
  try {
    const result = evaluate(expr)
    if (!isFinite(result)) return { value: 0, error: 'Result is not finite' }
    if (isNaN(result)) return { value: 0, error: 'Invalid operation' }
    return { value: result, error: null }
  } catch (e) {
    return { value: 0, error: (e as Error).message }
  }
}

export function formatNumber(value: number, maxDecimals = 10): string {
  if (!isFinite(value)) return 'Error'
  if (isNaN(value)) return 'Error'

  // Avoid floating point garbage like 0.1 + 0.2 = 0.30000000000000004
  const rounded = parseFloat(value.toPrecision(12))

  // Use compact notation for very large/small numbers
  if (Math.abs(rounded) >= 1e15 || (Math.abs(rounded) < 1e-7 && rounded !== 0)) {
    return rounded.toExponential(4)
  }

  const str = rounded.toString()
  const parts = str.split('.')
  if (parts[1] && parts[1].length > maxDecimals) {
    return rounded.toFixed(maxDecimals).replace(/\.?0+$/, '')
  }
  return str
}

export function formatDisplay(value: string): string {
  if (value === 'Error' || value === 'Infinity') return value
  const num = parseFloat(value)
  if (isNaN(num)) return value
  return formatNumber(num)
}

// Scientific helpers
export const scientificOps: Record<string, (x: number) => number> = {
  sin: (x) => Math.sin((x * Math.PI) / 180),
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  '\u221a': (x) => Math.sqrt(x),
  '1/x': (x) => 1 / x,
  'x\u00b2': (x) => x * x,
  'x\u00b3': (x) => x * x * x,
  '|x|': (x) => Math.abs(x),
}

