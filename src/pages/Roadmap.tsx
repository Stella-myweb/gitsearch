import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { LoadingGrid } from '@/components/common/Loading'
import { useRepositories } from '@/hooks/useRepositories'
import { CURRICULUM, PARTS } from '@/data/curriculum'
import { CurriculumBadge } from '@/components/repository/CurriculumBadge'
import { DifficultyStars } from '@/components/repository/DifficultyStars'
import { useT } from '@/hooks/useT'

export function Roadmap() {
  const { repositories, loading } = useRepositories()
  const t = useT()

  const totalCurriculumRepos = CURRICULUM.length
  const totalScore = CURRICULUM.reduce((sum, c) => sum + (c.score ?? 0), 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.repo.backHome}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.roadmap.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t.roadmap.subtitle}</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{repositories.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.roadmap.stats.total}</p>
        </div>
        <div className="rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalCurriculumRepos}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{t.roadmap.stats.curriculum}</p>
        </div>
        <div className="rounded-lg border border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4 text-center">
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{totalScore}{t.curriculum.points}</p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{t.roadmap.stats.maxScore}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-8">
          {PARTS.map((part, idx) => {
            const partRepos = CURRICULUM.filter((c) => c.part === part.id)
            const matchedRepos = partRepos.map((meta) => ({
              meta,
              repo: repositories.find((r) => r.name.toLowerCase() === meta.repoName.toLowerCase()),
            }))

            return (
              <div key={part.id} className="relative pl-16">
                {/* Circle badge */}
                <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-sm font-bold text-blue-700 dark:text-blue-400 shadow-sm">
                  {idx + 1}
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">{part.label}</h2>
                    <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
                      {part.description}
                    </Badge>
                  </div>

                  {matchedRepos.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">{t.roadmap.noRepos}</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {matchedRepos.map(({ meta, repo }) => (
                        <div
                          key={meta.repoName}
                          className="rounded-md border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              {repo ? (
                                <Link
                                  to={`/repository/${repo.name}`}
                                  className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                                >
                                  {repo.name}
                                </Link>
                              ) : (
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  {meta.repoName}
                                </span>
                              )}
                              {repo?.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                  {repo.description}
                                </p>
                              )}
                              {meta.summary && !repo?.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                  {meta.summary}
                                </p>
                              )}
                            </div>
                            <DifficultyStars difficulty={meta.difficulty} className="text-xs shrink-0" />
                          </div>
                          <div className="mt-2">
                            <CurriculumBadge meta={meta} />
                          </div>
                          {meta.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {meta.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Other section */}
          {(() => {
            const knownPartIds = new Set(PARTS.map((p) => p.id))
            const otherRepos = CURRICULUM.filter((c) => !knownPartIds.has(c.part))
            if (otherRepos.length === 0) return null
            return (
              <div className="relative pl-16">
                <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-bold text-gray-500 dark:text-gray-400 shadow-sm">
                  +
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">{t.roadmap.others}</h2>
                  {otherRepos.map((meta) => {
                    const repo = repositories.find((r) => r.name.toLowerCase() === meta.repoName.toLowerCase())
                    return (
                      <div key={meta.repoName} className="rounded-md border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                        {repo ? (
                          <Link to={`/repository/${repo.name}`} className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">
                            {repo.name}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{meta.repoName}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {loading && (
        <div className="mt-8">
          <LoadingGrid count={4} />
        </div>
      )}
    </div>
  )
}
