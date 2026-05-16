/** Tiny nanoid-like unique ID generator (no dependency) */
export function nanoid(size = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  for (const b of bytes) {
    result += chars[b % chars.length]
  }
  return result
}
