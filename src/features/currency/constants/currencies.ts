export const CURRENCY_FLAGS: Record<string, string> = {
  AUD: '🇦🇺', BGN: '🇧🇬', BRL: '🇧🇷', CAD: '🇨🇦', CHF: '🇨🇭',
  CNY: '🇨🇳', CZK: '🇨🇿', DKK: '🇩🇰', EUR: '🇪🇺', GBP: '🇬🇧',
  HKD: '🇭🇰', HUF: '🇭🇺', IDR: '🇮🇩', ILS: '🇮🇱', INR: '🇮🇳',
  ISK: '🇮🇸', JPY: '🇯🇵', KRW: '🇰🇷', MXN: '🇲🇽', MYR: '🇲🇾',
  NOK: '🇳🇴', NZD: '🇳🇿', PHP: '🇵🇭', PLN: '🇵🇱', RON: '🇷🇴',
  SEK: '🇸🇪', SGD: '🇸🇬', THB: '🇹🇭', TRY: '🇹🇷', USD: '🇺🇸',
  ZAR: '🇿🇦', HRK: '🇭🇷', DZD: '🇩🇿', MAD: '🇲🇦', TWD: '🇹🇼',
  SAR: '🇸🇦', AED: '🇦🇪', QAR: '🇶🇦', KWD: '🇰🇼', EGP: '🇪🇬',
  PKR: '🇵🇰', BDT: '🇧🇩', VND: '🇻🇳', CLP: '🇨🇱', COP: '🇨🇴',
  ARS: '🇦🇷', PEN: '🇵🇪',
}

export function getCurrencyFlag(code: string): string {
  return CURRENCY_FLAGS[code] || '🏳️'
}

export function formatCurrencyAmount(amount: number, code: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${code} ${amount.toLocaleString()}`
  }
}

export function formatRate(rate: number): string {
  if (rate >= 1000) return rate.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (rate >= 1) return rate.toFixed(4)
  return rate.toFixed(6)
}
