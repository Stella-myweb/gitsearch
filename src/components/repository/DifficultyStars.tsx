interface DifficultyStarsProps {
  difficulty: 1 | 2 | 3 | 4 | 5
  className?: string
}

export function DifficultyStars({ difficulty, className }: DifficultyStarsProps) {
  return (
    <span className={className} title={`난이도 ${difficulty}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < difficulty ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  )
}
