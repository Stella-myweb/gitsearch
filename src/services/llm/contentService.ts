import OpenAI from 'openai'
import type { Repository } from '@/types/repository'
import type { AIRepositoryMeta } from '@/types/repository'
import { OPENAI_KEY, LLM_MODEL } from '@/config/env'

export type Platform = 'naver-blog' | 'ig-feed' | 'ig-reels' | 'yt-shorts'
export type TonePreset = 'hive' | 'technical' | 'casual'

export interface ContentResult {
  platform: Platform
  content: string
  generatedAt: string
  model: string
}

interface GenerateOptions {
  repo: Repository
  meta: AIRepositoryMeta | null
  platform: Platform
  locale: 'ko' | 'en'
  tone: TonePreset
}

const TONE_DESC: Record<TonePreset, string> = {
  hive: '밝고 친근한 라이프스타일 크리에이터 톤. 비개발자도 이해할 수 있게. hive 브랜드 감성.',
  technical: '개발자 시점. 기술적 디테일 포함. 정확하고 간결하게.',
  casual: '일상적이고 솔직한 톤. 개발 경험담 위주.',
}

function buildRepoContext(repo: Repository, meta: AIRepositoryMeta | null): string {
  return `프로젝트명: ${repo.name}
설명: ${repo.description ?? '없음'}
언어: ${repo.language ?? '없음'}
토픽: ${(repo.topics ?? []).join(', ') || '없음'}
${meta ? `AI 요약: ${meta.summary}
난이도: ${meta.difficulty}
카테고리: ${meta.category}
학습시간: ${meta.learningTime}` : ''}`
}

const PLATFORM_PROMPTS: Record<Platform, (ctx: string, tone: string, locale: string) => string> = {
  'naver-blog': (ctx, tone, locale) => `당신은 ${tone} 스타일의 블로그 작가입니다.
아래 GitHub 프로젝트를 소개하는 네이버 블로그 포스팅을 작성하세요.

${ctx}

요구사항:
- 제목 3안 (SEO 최적화, 클릭유도형)
- 본문 1,500자 내외
- 섹션: 서론 → 개발하게 된 이유 → 주요 기능 → 기술 스택 → 배운 점 → 마무리 + 다음 편 예고
- 네이버 블로그 태그 10개
- 언어: ${locale === 'ko' ? '한국어' : 'English'}
- 톤: ${tone}`,

  'ig-feed': (ctx, tone, locale) => `당신은 ${tone} 스타일의 인스타그램 콘텐츠 크리에이터입니다.
아래 GitHub 프로젝트를 소개하는 인스타그램 피드 카드뉴스 텍스트를 작성하세요.

${ctx}

요구사항:
- 슬라이드 6장 텍스트 (각 슬라이드 제목 + 본문 2-3줄)
  - 슬라이드 1: 훅 (강렬한 첫 문장)
  - 슬라이드 2-4: 기능/기술/배운점
  - 슬라이드 5: 결과/성과
  - 슬라이드 6: CTA + 링크 안내
- 캡션 (300자 내외)
- 해시태그 25개 (#개발일상 #vibe코딩 등 포함)
- 언어: ${locale === 'ko' ? '한국어' : 'English'}`,

  'ig-reels': (ctx, tone, locale) => `당신은 ${tone} 스타일의 인스타그램 릴스 대본 작가입니다.
아래 GitHub 프로젝트를 소개하는 45초 릴스 보이스오버 대본을 작성하세요.

${ctx}

요구사항:
- 타임코드 포함 ([0-3s], [4-15s], [16-35s], [36-45s])
- 구간: 훅 → 문제제기 → 해결/기능 → CTA
- 자막용 줄바꿈 (한 줄 7단어 이내)
- 화면 지시 포함 (예: [화면: 앱 데모])
- 언어: ${locale === 'ko' ? '한국어' : 'English'}`,

  'yt-shorts': (ctx, tone, locale) => `당신은 ${tone} 스타일의 유튜브 쇼츠 대본 작가입니다.
아래 GitHub 프로젝트를 소개하는 60초 유튜브 쇼츠 대본을 작성하세요.

${ctx}

요구사항:
- 대본 (타임코드 포함, 60초)
- 썸네일 텍스트 3안 (임팩트 있게)
- 제목 3안 (검색 최적화)
- 영상 설명란 (첫 2줄이 핵심)
- 태그 15개
- 언어: ${locale === 'ko' ? '한국어' : 'English'}`,
}

// Model routing by platform
function selectModel(_platform: Platform): { provider: 'openai' | 'none'; model: string } {
  // MVP: use OpenAI for all (Claude/Gemini routing in Phase 2b)
  if (!OPENAI_KEY) return { provider: 'none', model: 'heuristic' }
  return { provider: 'openai', model: LLM_MODEL || 'gpt-4o-mini' }
}

export async function generateContent(options: GenerateOptions): Promise<ContentResult> {
  const { repo, meta, platform, locale, tone } = options
  const { provider, model } = selectModel(platform)

  const ctx = buildRepoContext(repo, meta)
  const prompt = PLATFORM_PROMPTS[platform](ctx, TONE_DESC[tone], locale)

  if (provider === 'none') {
    return {
      platform,
      content: generateFallbackContent(repo, platform, locale),
      generatedAt: new Date().toISOString(),
      model: 'fallback',
    }
  }

  const client = new OpenAI({ apiKey: OPENAI_KEY, dangerouslyAllowBrowser: true })
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
    temperature: 0.7,
  })

  return {
    platform,
    content: response.choices[0]?.message?.content ?? '',
    generatedAt: new Date().toISOString(),
    model,
  }
}

function generateFallbackContent(repo: Repository, platform: Platform, locale: 'ko' | 'en'): string {
  const name = repo.name
  const desc = repo.description ?? ''
  if (locale === 'ko') {
    return `[API 키 없이 생성된 템플릿]

프로젝트: ${name}
${desc}

VITE_OPENAI_KEY를 설정하면 AI가 ${platform} 맞춤 콘텐츠를 생성합니다.`
  }
  return `[Template — set VITE_OPENAI_KEY for AI generation]

Project: ${name}
${desc}`
}
