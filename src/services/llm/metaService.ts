import OpenAI from 'openai'
import type { Repository } from '@/types/repository'
import type { AIRepositoryMeta, DifficultyLevel } from '@/types/repository'
import { OPENAI_KEY, LLM_MODEL } from '@/config/env'
import { getMetaCache, setMetaCache } from './metaCache'
import { generateHeuristicMeta } from '@/utils/heuristicMeta'

const SYSTEM_PROMPT = `You are a developer wiki assistant. Given a GitHub repository's metadata, respond with ONLY a JSON object (no markdown, no explanation) with these fields:
- difficulty: "beginner" | "intermediate" | "advanced"
- category: short string like "React", "AI/ML", "Python", "Backend", "DevTools"
- learningTime: estimated time like "1-2h", "3-5h", "1-2 days"
- recommended: boolean (true if the project is a good learning resource)
- summary: one sentence, learner-friendly, under 80 characters`

export async function generateRepositoryMeta(repo: Repository, locale: 'ko' | 'en' = 'ko'): Promise<AIRepositoryMeta> {
  // 1. Cache hit
  const cached = getMetaCache(repo.name)
  if (cached) return cached

  // 2. No API key → heuristic
  if (!OPENAI_KEY) {
    const meta = generateHeuristicMeta(repo)
    setMetaCache(repo.name, meta)
    return meta
  }

  // 3. LLM call
  try {
    const client = new OpenAI({ apiKey: OPENAI_KEY, dangerouslyAllowBrowser: true })
    const userPrompt = `Repository: ${repo.name}
Description: ${repo.description ?? 'none'}
Language: ${repo.language ?? 'unknown'}
Topics: ${(repo.topics ?? []).join(', ') || 'none'}
Response language for summary: ${locale === 'ko' ? 'Korean' : 'English'}`

    const response = await client.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 200,
      temperature: 0.3,
    })

    const raw = response.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(raw)

    const VALID_DIFFICULTIES: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', '']
    const meta: AIRepositoryMeta = {
      difficulty: VALID_DIFFICULTIES.includes(parsed.difficulty) ? parsed.difficulty : 'intermediate',
      category: typeof parsed.category === 'string' ? parsed.category : (repo.language ?? 'Project'),
      learningTime: typeof parsed.learningTime === 'string' ? parsed.learningTime : '2-3h',
      recommended: typeof parsed.recommended === 'boolean' ? parsed.recommended : false,
      summary: typeof parsed.summary === 'string' ? parsed.summary : (repo.description ?? repo.name),
      generatedAt: new Date().toISOString(),
      generatedBy: 'openai',
    }

    setMetaCache(repo.name, meta)
    return meta
  } catch {
    const meta = generateHeuristicMeta(repo)
    setMetaCache(repo.name, meta)
    return meta
  }
}
