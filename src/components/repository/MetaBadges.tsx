import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUIStore } from '@/store/uiStore'
import { difficultyLabel, difficultyVariant } from '@/utils/metaLabels'
import type { AIRepositoryMeta } from '@/types/repository'

interface MetaBadgesProps {
  meta: AIRepositoryMeta | null
  loading: boolean
  isAI?: boolean
}

export function MetaBadges({ meta, loading, isAI }: MetaBadgesProps) {
  const lang = useUIStore(s => s.lang)

  if (loading) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-10 rounded-full" />
      </div>
    )
  }

  if (!meta) return null

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-wrap gap-1.5 items-center">
        {meta.difficulty && (
          <Badge variant={difficultyVariant(meta.difficulty)} className="text-xs px-1.5 py-0">
            {difficultyLabel(meta.difficulty, lang)}
          </Badge>
        )}
        <Badge variant="outline" className="text-xs px-1.5 py-0 dark:border-gray-600 dark:text-gray-300">
          {meta.category}
        </Badge>
        <Badge variant="outline" className="text-xs px-1.5 py-0 dark:border-gray-600 dark:text-gray-300">
          {meta.learningTime}
        </Badge>
        {meta.recommended && (
          <Badge variant="outline" className="text-xs px-1.5 py-0 text-yellow-600 border-yellow-400 dark:text-yellow-400 dark:border-yellow-600 flex items-center gap-0.5">
            <Star className="h-2.5 w-2.5" />
            {lang === 'ko' ? '추천' : 'Pick'}
          </Badge>
        )}
        {isAI && (
          <span className="text-xs text-gray-400 dark:text-gray-500">AI</span>
        )}
      </div>
      {meta.summary && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">
          {meta.summary}
        </p>
      )}
    </div>
  )
}
