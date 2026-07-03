const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function getCacheKey(username: string): string {
  return `gitsearch_repos_${username}`
}

export function getFromCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export function setToCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // ignore storage errors
  }
}

export function clearCache(key: string): void {
  localStorage.removeItem(key)
}
