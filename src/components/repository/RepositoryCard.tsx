import { Link } from 'react-router-dom'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LANGUAGE_COLORS } from '@/constants/languages'
import { formatRelativeDate } from '@/utils/formatDate'
import { useT } from '@/hooks/useT'
import { useRepositoryMeta } from '@/hooks/useRepositoryMeta'
import { MetaBadges } from '@/components/repository/MetaBadges'
import type { Repository } from '@/types/repository'

interface RepositoryCardProps {
  repo: Repository
}

export function RepositoryCard({ repo }: RepositoryCardProps) {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? '#8b8b8b' : null
  const t = useT()
  const { ref, meta, loading, isAI } = useRepositoryMeta(repo)

  return (
    <div ref={ref}>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="flex flex-col flex-1 p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link
              to={`/repository/${repo.name}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 text-sm"
            >
              {repo.name}
            </Link>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="GitHub에서 보기"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 mb-3">
            {repo.description || t.repo.noDescription}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {repo.topics?.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs px-1.5 py-0 dark:bg-gray-700 dark:text-gray-300">
                {topic}
              </Badge>
            ))}
          </div>

          <MetaBadges meta={meta} loading={loading} isAI={isAI} />

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
            <div className="flex items-center gap-3">
              {langColor && (
                <span className="flex items-center gap-1">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: langColor }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3" />
                {repo.stargazers_count.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5">
                <GitFork className="h-3 w-3" />
                {repo.forks_count.toLocaleString()}
              </span>
            </div>
            <span>{formatRelativeDate(repo.updated_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
