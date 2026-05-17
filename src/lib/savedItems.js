// Tracks "saved for later" product slugs in localStorage so the Save button
// on a product page is a real, persistent toggle rather than a dead control.
const KEY = 'softflorals:savedItems'

function read() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

function write(slugs) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slugs))
  } catch {
    /* private mode / quota — ignore */
  }
}

export function isSaved(slug) {
  return read().includes(slug)
}

// Flips a slug's saved state. Returns the new state (true = now saved).
export function toggle(slug) {
  if (!slug) return false
  const current = read()
  if (current.includes(slug)) {
    write(current.filter((s) => s !== slug))
    return false
  }
  write([slug, ...current])
  return true
}

export function get() {
  return read()
}
