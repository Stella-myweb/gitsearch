import type { CurriculumMeta } from '../data/curriculum'

export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  updated_at: string
  created_at: string
  visibility: string
  default_branch: string
  owner: { login: string; avatar_url: string }
}

export interface EnrichedRepository extends Repository {
  curriculum?: CurriculumMeta
}

export interface RepositoryMeta {
  id: number
  name: string
  category?: string
  tags?: string[]
  featured?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}
