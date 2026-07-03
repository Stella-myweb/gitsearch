import { create } from 'zustand'
import type { Repository } from '@/types/repository'
import type { AIRepositoryMeta } from '@/types/repository'
import { generateRepositoryMeta } from '@/services/llm/metaService'

interface MetaState {
  metaByRepo: Record<string, AIRepositoryMeta>
  loadingRepos: Set<string>
  fetchMeta: (repo: Repository, locale: 'ko' | 'en') => Promise<void>
}

// Concurrency limiter — max 3 simultaneous requests
let inFlight = 0
const waitQueue: Array<() => void> = []

function acquireSlot(): Promise<void> {
  return new Promise(resolve => {
    if (inFlight < 3) { inFlight++; resolve() }
    else waitQueue.push(() => { inFlight++; resolve() })
  })
}

function releaseSlot() {
  inFlight--
  const next = waitQueue.shift()
  if (next) next()
}

export const useMetaStore = create<MetaState>((set, get) => ({
  metaByRepo: {},
  loadingRepos: new Set(),

  async fetchMeta(repo, locale) {
    const { metaByRepo, loadingRepos } = get()
    if (metaByRepo[repo.name] || loadingRepos.has(repo.name)) return

    set(s => ({ loadingRepos: new Set([...s.loadingRepos, repo.name]) }))

    await acquireSlot()
    try {
      const meta = await generateRepositoryMeta(repo, locale)
      set(s => ({
        metaByRepo: { ...s.metaByRepo, [repo.name]: meta },
        loadingRepos: new Set([...s.loadingRepos].filter(n => n !== repo.name)),
      }))
    } catch {
      set(s => ({
        loadingRepos: new Set([...s.loadingRepos].filter(n => n !== repo.name)),
      }))
    } finally {
      releaseSlot()
    }
  },
}))
