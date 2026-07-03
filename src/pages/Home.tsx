import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Star, Clock, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RepositoryCard } from '@/components/repository/RepositoryCard'
import { LoadingGrid } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination } from '@/components/common/Pagination'
import { CATEGORIES } from '@/constants/categories'
import { useRepositories } from '@/hooks/useRepositories'
import { GITHUB_USERNAME } from '@/config/env'
import { PARTS, CURRICULUM } from '@/data/curriculum'
import { useT } from '@/hooks/useT'
import { useUIStore } from '@/store/uiStore'

const PAGE_SIZE = 12

export function Home() {
  const navigate = useNavigate()
  const { repositories, loading, error } = useRepositories()
  const [page, setPage] = useState(1)
  const [heroQuery, setHeroQuery] = useState('')
  const t = useT()
  const lang = useUIStore(s => s.lang)

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault()
    if (heroQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroQuery.trim())}`)
    }
  }

  const sorted = [...repositories].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
  const byStars = [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count)

  const totalPages = Math.ceil(repositories.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">{t.appName}</h1>
          <p className="text-gray-300 mb-2 text-lg">
            {GITHUB_USERNAME}{t.tagline}
          </p>
          <p className="text-gray-400 text-sm mb-8">
            {t.totalRepos(repositories.length)}
          </p>
          <form onSubmit={handleHeroSearch} className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
            </div>
            <Button type="submit" className="bg-white text-gray-900 hover:bg-gray-100 shrink-0">
              {t.searchLabel}
            </Button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
        {/* Roadmap mini timeline */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.home.roadmapTitle}</h2>
            </div>
            <Link
              to="/roadmap"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              {t.home.roadmapViewAll} →
            </Link>
          </div>
          <div className="rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-900/20 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {t.home.roadmapProgress(new Set(CURRICULUM.map(c => c.part)).size, PARTS.length)}
            </p>
            <div className="flex flex-wrap gap-2">
              {PARTS.map((part) => {
                const hasRepos = CURRICULUM.some((c) => c.part === part.id)
                return (
                  <Link
                    key={part.id}
                    to="/roadmap"
                    className={`flex flex-col items-center rounded-lg border px-3 py-2 text-center transition-colors min-w-[80px] ${
                      hasRepos
                        ? 'border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xs font-semibold">{part.label}</span>
                    <span className="text-xs mt-0.5 truncate max-w-[72px]">{part.description}</span>
                    {hasRepos && <span className="mt-1 text-xs text-blue-400">●</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.home.categories}</h2>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.id === 'all' ? '/search' : `/category/${cat.id}`}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all text-center"
              >
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{lang === 'ko' ? cat.label : cat.labelEn}</span>
              </Link>
            ))}
          </div>
        </section>

        {error && <ErrorState message={error} />}

        {/* Recent */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.home.recentUpdates}</h2>
          </div>
          {loading ? (
            <LoadingGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.slice(0, 6).map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </section>

        {/* Popular */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.home.popular}</h2>
          </div>
          {loading ? (
            <LoadingGrid count={6} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {byStars.slice(0, 6).map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </section>

        {/* All repos */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.home.allRepos}</h2>
          {loading ? (
            <LoadingGrid count={12} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
                {paged.map((repo) => (
                  <RepositoryCard key={repo.id} repo={repo} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
