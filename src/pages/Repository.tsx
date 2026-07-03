import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, GitFork, ExternalLink, Globe, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MarkdownViewer } from '@/components/repository/MarkdownViewer'
import { CurriculumBadge } from '@/components/repository/CurriculumBadge'
import { RelatedProjects } from '@/components/repository/RelatedProjects'
import { LoadingSpinner } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { getRepository, getReadme } from '@/services/github/repository'
import { LANGUAGE_COLORS } from '@/constants/languages'
import { formatDate } from '@/utils/formatDate'
import { GITHUB_USERNAME } from '@/config/env'
import { getCurriculumMeta } from '@/data/curriculum'
import { useRepositories } from '@/hooks/useRepositories'
import { useT } from '@/hooks/useT'
import type { Repository } from '@/types/repository'

export function RepositoryPage() {
  const { name } = useParams<{ name: string }>()
  const [repo, setRepo] = useState<Repository | null>(null)
  const [readme, setReadme] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { repositories } = useRepositories()
  const t = useT()

  useEffect(() => {
    if (!name) return
    setLoading(true)
    setError(null)

    Promise.all([
      getRepository(GITHUB_USERNAME, name),
      getReadme(GITHUB_USERNAME, name).catch(() => null),
    ])
      .then(([repoData, readmeData]) => {
        setRepo(repoData)
        setReadme(readmeData)
      })
      .catch((err) => {
        setError(err?.message || '레포지토리를 불러오는데 실패했습니다.')
      })
      .finally(() => setLoading(false))
  }, [name])

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <ErrorState message={error} />
    </div>
  )
  if (!repo) return null

  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? '#8b8b8b' : null
  const curriculumMeta = getCurriculumMeta(repo.name)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.repo.backHome}
      </Link>

      {/* Header */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{repo.name}</h1>
        {repo.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4">{repo.description}</p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
          {langColor && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            {repo.stargazers_count.toLocaleString()} stars
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            {repo.forks_count.toLocaleString()} forks
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            {t.repo.updatedAt} {formatDate(repo.updated_at)}
          </span>
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {repo.topics.map((topic) => (
              <Badge key={topic} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t.repo.viewOnGitHub}
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {t.repo.homepage}
            </a>
          )}
        </div>
      </div>

      {/* Curriculum Info */}
      {curriculumMeta && (
        <div className="mb-8 rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 p-5 space-y-4">
          <CurriculumBadge meta={curriculumMeta} />

          {curriculumMeta.summary && (
            <p className="text-sm text-gray-700 dark:text-gray-300">{curriculumMeta.summary}</p>
          )}

          {curriculumMeta.archPattern && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t.repo.archPattern}</span>
              <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{curriculumMeta.archPattern}</p>
            </div>
          )}

          {curriculumMeta.learningGoals.length > 0 && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t.repo.learningGoals}</span>
              <ul className="mt-1 space-y-1">
                {curriculumMeta.learningGoals.map((goal) => (
                  <li key={goal} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-blue-400">▸</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {curriculumMeta.relatedRepos.length > 0 && (
            <RelatedProjects
              relatedRepoNames={curriculumMeta.relatedRepos}
              allRepos={repositories}
            />
          )}
        </div>
      )}

      {/* README */}
      {readme ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            README
          </h2>
          <MarkdownViewer
            content={readme}
            username={GITHUB_USERNAME}
            repoName={repo.name}
            branch={repo.default_branch}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
          <p>{t.repo.noReadme}</p>
        </div>
      )}
    </div>
  )
}
