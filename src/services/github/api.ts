import axios from 'axios'
import { GITHUB_TOKEN } from '@/config/env'
import type { Repository } from '@/types/repository'

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  },
})

export async function fetchAllRepos(username: string): Promise<Repository[]> {
  const allRepos: Repository[] = []
  let page = 1
  const perPage = 100

  while (true) {
    const { data } = await githubApi.get<Repository[]>(
      `/users/${username}/repos`,
      { params: { per_page: perPage, page, sort: 'updated', type: 'public' } }
    )
    allRepos.push(...data)
    if (data.length < perPage) break
    page++
  }

  return allRepos
}

export async function fetchRepo(username: string, repoName: string): Promise<Repository> {
  const { data } = await githubApi.get<Repository>(`/repos/${username}/${repoName}`)
  return data
}

export async function fetchReadme(username: string, repoName: string): Promise<string> {
  const { data } = await githubApi.get<{ content: string; encoding: string }>(
    `/repos/${username}/${repoName}/readme`
  )
  if (data.encoding === 'base64') {
    return atob(data.content.replace(/\n/g, ''))
  }
  return data.content
}
