import { create } from 'zustand'
import type { ContentResult, Platform, TonePreset } from '@/services/llm/contentService'
import { generateContent } from '@/services/llm/contentService'
import type { Repository } from '@/types/repository'
import type { AIRepositoryMeta } from '@/types/repository'

interface ContentState {
  results: Record<string, ContentResult>  // key: `${repoName}:${platform}`
  generating: Set<string>
  error: Record<string, string>
  tone: TonePreset
  setTone: (t: TonePreset) => void
  generate: (repo: Repository, meta: AIRepositoryMeta | null, platform: Platform, locale: 'ko' | 'en') => Promise<void>
  clear: (repoName: string, platform: Platform) => void
}

export const useContentStore = create<ContentState>((set, get) => ({
  results: {},
  generating: new Set(),
  error: {},
  tone: 'hive',

  setTone: (tone) => set({ tone }),

  async generate(repo, meta, platform, locale) {
    const key = `${repo.name}:${platform}`
    if (get().generating.has(key)) return

    set(s => ({ generating: new Set([...s.generating, key]), error: { ...s.error, [key]: '' } }))

    try {
      const result = await generateContent({ repo, meta, platform, locale, tone: get().tone })
      set(s => ({
        results: { ...s.results, [key]: result },
        generating: new Set([...s.generating].filter(k => k !== key)),
      }))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '생성 실패'
      set(s => ({
        generating: new Set([...s.generating].filter(k => k !== key)),
        error: { ...s.error, [key]: msg },
      }))
    }
  },

  clear: (repoName, platform) => {
    const key = `${repoName}:${platform}`
    set(s => {
      const results = { ...s.results }
      delete results[key]
      return { results }
    })
  },
}))
