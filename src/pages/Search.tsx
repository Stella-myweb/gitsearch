import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchBox } from '@/components/common/SearchBox'
import { Filter } from '@/components/common/Filter'
import { RepositoryCard } from '@/components/repository/RepositoryCard'
import { LoadingGrid } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination } from '@/components/common/Pagination'
import { useRepositories } from '@/hooks/useRepositories'
import { useRepositoryStore } from '@/store/repositoryStore'
import { filterRepos } from '@/utils/filterRepos'
import { useT } from '@/hooks/useT'

const PAGE_SIZE = 12

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { repositories, loading, error } = useRepositories()
  const { selectedLanguage, setSelectedLanguage, selectedPart, setSelectedPart } = useRepositoryStore()
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') ?? '')
  const [page, setPage] = useState(1)
  const t = useT()

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setLocalQuery(q)
    setPage(1)
  }, [searchParams])

  function handleSearch(query: string) {
    setSearchParams(query ? { q: query } : {})
    setPage(1)
  }

  function handleLanguageChange(lang: string) {
    setSelectedLanguage(lang)
    setPage(1)
  }

  function handlePartChange(part: number | null) {
    setSelectedPart(part)
    setPage(1)
  }

  const filtered = filterRepos(repositories, {
    searchQuery: localQuery,
    selectedLanguage,
    selectedCategory: 'all',
    selectedPart,
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.search.title}</h1>
        <SearchBox
          onSearch={handleSearch}
          placeholder={t.search.placeholder}
          initialValue={localQuery}
          className="max-w-xl"
        />
        <Filter
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          selectedPart={selectedPart}
          onPartChange={handlePartChange}
        />
      </div>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingGrid count={12} />
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {localQuery ? (
              <>
                "<span className="font-medium text-gray-900 dark:text-white">{localQuery}</span>"{' '}
                {t.search.resultCount('', filtered.length).replace(`"" `, '')}
              </>
            ) : (
              <>{t.search.totalCount(filtered.length)}</>
            )}
          </p>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">{t.search.noResults}</p>
              <p className="text-sm mt-1">{t.search.noResultsHint}</p>
            </div>
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
        </>
      )}
    </div>
  )
}
