export function formatAUD(amount) {
  if (amount == null || Number.isNaN(amount)) return '$0'
  const n = Math.round(Number(amount) * 100) / 100
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`
}
