import type { AIRepositoryMeta } from '@/types/repository'

const PREFIX = 'gitsearch_meta_'
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface CacheEntry {
  meta: AIRepositoryMeta
  expiresAt: number
}

export function getMetaCache(repoName: string): AIRepositoryMeta | null {
  try {
    const raw = localStorage.getItem(PREFIX + repoName)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(PREFIX + repoName)
      return null
    }
    return entry.meta
  } catch {
    return null
  }
}

export function setMetaCache(repoName: string, meta: AIRepositoryMeta): void {
  try {
    const entry: CacheEntry = { meta, expiresAt: Date.now() + TTL_MS }
    localStorage.setItem(PREFIX + repoName, JSON.stringify(entry))
  } catch {}
}
