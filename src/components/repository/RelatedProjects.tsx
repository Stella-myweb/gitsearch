import { Link } from 'react-router-dom'
import type { Repository } from '@/types/repository'

interface RelatedProjectsProps {
  relatedRepoNames: string[]
  allRepos: Repository[]
}

export function RelatedProjects({ relatedRepoNames, allRepos }: RelatedProjectsProps) {
  const related = relatedRepoNames
    .map((name) => allRepos.find((r) => r.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Repository[]

  if (related.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">재사용 아키텍처 연결 프로젝트</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {related.map((repo) => (
          <Link
            key={repo.id}
            to={`/repository/${repo.name}`}
            className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{repo.name}</p>
              {repo.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{repo.description}</p>
              )}
            </div>
          </Link>
        ))}
        {relatedRepoNames
          .filter((name) => !allRepos.some((r) => r.name.toLowerCase() === name.toLowerCase()))
          .map((name) => (
            <div
              key={name}
              className="flex items-start gap-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500 truncate">{name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">준비 중</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
