import type { Repository } from '@/types/repository'
import { getCurriculumMeta } from '@/data/curriculum'

interface FilterOptions {
  searchQuery: string
  selectedLanguage: string
  selectedCategory: string
  selectedPart?: number | null
}

export function filterRepos(
  repos: Repository[],
  { searchQuery, selectedLanguage, selectedCategory, selectedPart }: FilterOptions
): Repository[] {
  return repos.filter((repo) => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesName = repo.name.toLowerCase().includes(q)
      const matchesDesc = repo.description?.toLowerCase().includes(q) ?? false
      const matchesLang = repo.language?.toLowerCase().includes(q) ?? false
      const matchesTopics = repo.topics?.some((t) => t.toLowerCase().includes(q)) ?? false
      if (!matchesName && !matchesDesc && !matchesLang && !matchesTopics) return false
    }

    // Language filter
    if (selectedLanguage && selectedLanguage !== 'All') {
      if (repo.language !== selectedLanguage) return false
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      const lang = repo.language?.toLowerCase() ?? ''
      const topics = repo.topics?.map((t) => t.toLowerCase()) ?? []
      const cat = selectedCategory.toLowerCase()

      const matchesTopic = topics.some((t) => t.includes(cat))
      const matchesLang = lang.includes(cat)

      // Special mappings
      const categoryMappings: Record<string, string[]> = {
        react: ['react', 'nextjs', 'next.js', 'gatsby'],
        vue: ['vue', 'nuxt', 'nuxt.js'],
        python: ['python', 'django', 'flask', 'fastapi'],
        node: ['node', 'nodejs', 'express', 'nestjs', 'javascript', 'typescript'],
        ai: ['ai', 'ml', 'machine-learning', 'deep-learning', 'tensorflow', 'pytorch', 'llm'],
        mobile: ['mobile', 'android', 'ios', 'react-native', 'flutter', 'swift', 'kotlin'],
        tools: ['tool', 'cli', 'script', 'utility', 'automation'],
      }

      const keywords = categoryMappings[cat] ?? [cat]
      const matchesKeyword =
        keywords.some((k) => topics.some((t) => t.includes(k))) ||
        keywords.some((k) => lang.includes(k))

      if (!matchesTopic && !matchesLang && !matchesKeyword) return false
    }

    // Part filter
    if (selectedPart != null) {
      const meta = getCurriculumMeta(repo.name)
      if (!meta || meta.part !== selectedPart) return false
    }

    return true
  })
}
