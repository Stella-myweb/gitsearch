import { Badge } from '@/components/ui/badge'
import type { CurriculumMeta } from '@/data/curriculum'
import { DifficultyStars } from './DifficultyStars'

interface CurriculumBadgeProps {
  meta: CurriculumMeta
  className?: string
}

export function CurriculumBadge({ meta, className }: CurriculumBadgeProps) {
  const dayLabel = meta.dayRange
    ? `Day ${meta.dayRange[0]}-${meta.dayRange[1]}`
    : meta.day
    ? `Day ${meta.day}`
    : null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
      <Badge variant="outline" className="text-xs font-medium border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
        Part {meta.part}
      </Badge>
      {dayLabel && (
        <Badge variant="outline" className="text-xs font-medium border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
          {dayLabel}
        </Badge>
      )}
      {meta.score && meta.scoreType && (
        <Badge
          variant="outline"
          className={`text-xs font-medium ${
            meta.scoreType === 'final'
              ? 'border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
              : 'border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
          }`}
        >
          {meta.scoreType === 'final' ? '최종' : '중간'} {meta.score}점
        </Badge>
      )}
      <DifficultyStars difficulty={meta.difficulty} className="text-sm" />
    </div>
  )
}
