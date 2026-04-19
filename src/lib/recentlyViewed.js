// Tracks recently-viewed product slugs in localStorage so we can show a
// "Recently viewed" rail on product pages and in the shop.
const KEY = 'softflowers:recentlyViewed'
const MAX = 8

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
    window.localStorage.setItem(KEY, JSON.stringify(slugs.slice(0, MAX)))
  } catch {
    /* private mode / quota — ignore */
  }
}

export function track(slug) {
  if (!slug) return
  const current = read().filter((s) => s !== slug)
  write([slug, ...current])
}

export function get(excludeSlug) {
  return read().filter((s) => s !== excludeSlug)
}
