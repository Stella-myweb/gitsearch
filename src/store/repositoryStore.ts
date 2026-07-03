import { create } from 'zustand'
import type { Repository } from '@/types/repository'

interface RepositoryState {
  repositories: Repository[]
  loading: boolean
  error: string | null
  searchQuery: string
  selectedLanguage: string
  selectedCategory: string
  selectedPart: number | null
  setRepositories: (repos: Repository[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (q: string) => void
  setSelectedLanguage: (lang: string) => void
  setSelectedCategory: (cat: string) => void
  setSelectedPart: (part: number | null) => void
}

export const useRepositoryStore = create<RepositoryState>((set) => ({
  repositories: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedLanguage: '',
  selectedCategory: 'all',
  selectedPart: null,
  setRepositories: (repos) => set({ repositories: repos }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedPart: (selectedPart) => set({ selectedPart }),
}))
