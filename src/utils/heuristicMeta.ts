import type { AIRepositoryMeta, DifficultyLevel } from '@/types/repository'
import type { Repository } from '@/types/repository'

const AI_KEYWORDS = ['langchain', 'openai', 'gpt', 'llm', 'rag', 'langgraph', 'mcp', 'agent', 'gemini', 'anthropic', 'claude']
const ADVANCED_KEYWORDS = ['langgraph', 'rag', 'pgvector', 'supabase', 'neon', 'pipeline', 'orchestration']
const BEGINNER_KEYWORDS = ['todo', 'calculator', 'weather', 'hello', 'intro', 'basic']

export function generateHeuristicMeta(repo: Repository): AIRepositoryMeta {
  const text = [repo.name, repo.description ?? '', ...(repo.topics ?? [])].join(' ').toLowerCase()
  const lang = (repo.language ?? '').toLowerCase()

  let difficulty: DifficultyLevel = 'intermediate'
  if (BEGINNER_KEYWORDS.some(k => text.includes(k))) difficulty = 'beginner'
  if (ADVANCED_KEYWORDS.some(k => text.includes(k))) difficulty = 'advanced'

  let category = repo.language ?? 'Project'
  if (AI_KEYWORDS.some(k => text.includes(k))) category = 'AI/ML'
  else if (text.includes('react') || text.includes('vue') || lang === 'typescript' || lang === 'javascript') category = 'Frontend'
  else if (text.includes('python')) category = 'Python'
  else if (text.includes('api') || text.includes('server')) category = 'Backend'

  const learningTime = difficulty === 'advanced' ? '5-10h' : difficulty === 'intermediate' ? '2-4h' : '1-2h'
  const recommended = (repo.stargazers_count > 0) || AI_KEYWORDS.some(k => text.includes(k))

  return {
    difficulty,
    category,
    learningTime,
    recommended,
    summary: repo.description ?? `${repo.language ?? 'Code'} project: ${repo.name}`,
    generatedAt: new Date().toISOString(),
    generatedBy: 'heuristic',
  }
}
