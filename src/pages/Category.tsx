import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { RepositoryCard } from '@/components/repository/RepositoryCard'
import { LoadingGrid } from '@/components/common/Loading'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination } from '@/components/common/Pagination'
import { CATEGORIES } from '@/constants/categories'
import { useRepositories } from '@/hooks/useRepositories'
import { filterRepos } from '@/utils/filterRepos'

const PAGE_SIZE = 12

export function Category() {
  const { name } = useParams<{ name: string }>()
  const { repositories, loading, error } = useRepositories()
  const [page, setPage] = useState(1)

  const category = CATEGORIES.find((c) => c.id === name)
  const filtered = filterRepos(repositories, {
    searchQuery: '',
    selectedLanguage: '',
    selectedCategory: name ?? 'all',
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {category ? category.label : name} 카테고리
        </h1>
        <p className="text-sm text-gray-500 mt-1">{filtered.length}개의 레포지토리</p>
      </div>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingGrid count={12} />
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <p className="text-lg">이 카테고리에 레포지토리가 없습니다</p>
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
    </div>
  )
}
