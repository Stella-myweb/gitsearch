import type { Repository } from '@/types/repository'
import { fetchAllRepos, fetchRepo, fetchReadme } from './api'
import { getCacheKey, getFromCache, setToCache } from './cache'

export async function getAllRepositories(username: string): Promise<Repository[]> {
  const key = getCacheKey(username)
  const cached = getFromCache<Repository[]>(key)
  if (cached) return cached

  const repos = await fetchAllRepos(username)
  setToCache(key, repos)
  return repos
}

export async function getRepository(username: string, name: string): Promise<Repository> {
  return fetchRepo(username, name)
}

export async function getReadme(username: string, name: string): Promise<string> {
  return fetchReadme(username, name)
}
