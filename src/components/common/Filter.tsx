import { POPULAR_LANGUAGES } from '@/constants/languages'
import { PARTS } from '@/data/curriculum'
import { cn } from '@/lib/utils'

interface FilterProps {
  selectedLanguage: string
  onLanguageChange: (lang: string) => void
  selectedPart?: number | null
  onPartChange?: (part: number | null) => void
}

export function Filter({ selectedLanguage, onLanguageChange, selectedPart, onPartChange }: FilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {POPULAR_LANGUAGES.map((lang) => {
          const value = lang === 'All' ? '' : lang
          const isSelected = selectedLanguage === value
          return (
            <button
              key={lang}
              onClick={() => onLanguageChange(value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors border',
                isSelected
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {lang}
            </button>
          )
        })}
      </div>

      {onPartChange && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Part:</span>
          <button
            onClick={() => onPartChange(null)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors border',
              selectedPart == null
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300 hover:text-blue-700 dark:hover:border-blue-500 dark:hover:text-blue-400'
            )}
          >
            전체
          </button>
          {PARTS.map((part) => {
            const isSelected = selectedPart === part.id
            return (
              <button
                key={part.id}
                onClick={() => onPartChange(part.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors border',
                  isSelected
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300 hover:text-blue-700 dark:hover:border-blue-500 dark:hover:text-blue-400'
                )}
              >
                {part.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
