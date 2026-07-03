import { useEffect } from 'react'
import { useRepositoryStore } from '@/store/repositoryStore'
import { getAllRepositories } from '@/services/github/repository'
import { GITHUB_USERNAME } from '@/config/env'

export function useRepositories() {
  const { repositories, loading, error, setRepositories, setLoading, setError } =
    useRepositoryStore()

  useEffect(() => {
    if (repositories.length > 0) return
    setLoading(true)
    getAllRepositories(GITHUB_USERNAME)
      .then((repos) => {
        setRepositories(repos)
        setError(null)
      })
      .catch((err) => {
        setError(err?.message || '레포지토리를 불러오는데 실패했습니다.')
      })
      .finally(() => setLoading(false))
  }, [repositories.length, setRepositories, setLoading, setError])

  return { repositories, loading, error }
}
