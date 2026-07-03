import { useRef, useEffect } from 'react'
import { useMetaStore } from '@/store/metaStore'
import { useUIStore } from '@/store/uiStore'
import type { Repository } from '@/types/repository'

export function useRepositoryMeta(repo: Repository) {
  const ref = useRef<HTMLDivElement>(null)
  const { metaByRepo, loadingRepos, fetchMeta } = useMetaStore()
  const lang = useUIStore(s => s.lang)

  const meta = metaByRepo[repo.name] ?? null
  const loading = loadingRepos.has(repo.name)

  useEffect(() => {
    if (meta || loading) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { fetchMeta(repo, lang); observer.disconnect() } },
      { rootMargin: '100px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [repo.name, meta, loading, lang])

  return { ref, meta, loading, isAI: meta?.generatedBy !== 'heuristic' }
}
