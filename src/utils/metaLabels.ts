import type { DifficultyLevel } from '@/types/repository'

export function difficultyLabel(d: DifficultyLevel, lang: 'ko' | 'en'): string {
  const map: Record<DifficultyLevel, { ko: string; en: string }> = {
    beginner: { ko: '입문', en: 'Beginner' },
    intermediate: { ko: '중급', en: 'Intermediate' },
    advanced: { ko: '고급', en: 'Advanced' },
    '': { ko: '-', en: '-' },
  }
  return map[d]?.[lang] ?? d
}

export function difficultyVariant(d: DifficultyLevel): 'secondary' | 'outline' | 'destructive' {
  if (d === 'beginner') return 'secondary'
  if (d === 'advanced') return 'destructive'
  return 'outline'
}
