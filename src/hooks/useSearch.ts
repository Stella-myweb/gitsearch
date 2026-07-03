import { useMemo } from 'react'
import { useRepositoryStore } from '@/store/repositoryStore'
import { filterRepos } from '@/utils/filterRepos'

export function useSearch() {
  const { repositories, searchQuery, selectedLanguage, selectedCategory } = useRepositoryStore()

  const filtered = useMemo(
    () => filterRepos(repositories, { searchQuery, selectedLanguage, selectedCategory }),
    [repositories, searchQuery, selectedLanguage, selectedCategory]
  )

  return { filtered }
}
