import { useState } from 'react'
import { Sparkles, Copy, Check, RefreshCw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useContentStore } from '@/store/contentStore'
import { useUIStore } from '@/store/uiStore'
import { useMetaStore } from '@/store/metaStore'
import type { Repository } from '@/types/repository'
import type { Platform, TonePreset } from '@/services/llm/contentService'

interface Props { repo: Repository }

const PLATFORMS: { id: Platform; label: string; labelEn: string; icon: string; desc: string; descEn: string }[] = [
  { id: 'naver-blog', label: '네이버 블로그', labelEn: 'Naver Blog', icon: '📝', desc: '개발기 포스팅 (1,500자)', descEn: 'Dev story post (1,500 chars)' },
  { id: 'ig-feed', label: '인스타 피드', labelEn: 'Instagram Feed', icon: '📸', desc: '카드뉴스 + 해시태그', descEn: 'Carousel + hashtags' },
  { id: 'ig-reels', label: '릴스 대본', labelEn: 'Reels Script', icon: '🎬', desc: '45초 보이스오버', descEn: '45s voice-over script' },
  { id: 'yt-shorts', label: '유튜브 쇼츠', labelEn: 'YouTube Shorts', icon: '▶', desc: '60초 대본 + 썸네일', descEn: '60s script + thumbnail' },
]

const TONES: { id: TonePreset; label: string; labelEn: string }[] = [
  { id: 'hive', label: 'hive 감성', labelEn: 'hive Style' },
  { id: 'technical', label: '기술적', labelEn: 'Technical' },
  { id: 'casual', label: '캐주얼', labelEn: 'Casual' },
]

export function ContentStudio({ repo }: Props) {
  const lang = useUIStore(s => s.lang)
  const { results, generating, error, tone, setTone, generate, clear } = useContentStore()
  const { metaByRepo } = useMetaStore()
  const [selected, setSelected] = useState<Platform>('naver-blog')
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const meta = metaByRepo[repo.name] ?? null
  const key = `${repo.name}:${selected}`
  const result = results[key]
  const isGenerating = generating.has(key)
  const err = error[key]

  async function handleGenerate() {
    await generate(repo, meta, selected, lang)
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">
            {lang === 'ko' ? '콘텐츠 만들기' : 'Content Studio'}
          </span>
          <Badge variant="outline" className="text-xs border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400">
            Multi-LLM
          </Badge>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {/* Tone selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ko' ? '톤:' : 'Tone:'}</span>
            {TONES.map(t => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  tone === t.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300'
                }`}
              >
                {lang === 'ko' ? t.label : t.labelEn}
              </button>
            ))}
          </div>

          {/* Platform selector */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition-colors ${
                  selected === p.id
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 dark:border-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                <span className="text-base">{p.icon}</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                  {lang === 'ko' ? p.label : p.labelEn}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {lang === 'ko' ? p.desc : p.descEn}
                </span>
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              size="sm"
            >
              {isGenerating ? (
                <><RefreshCw className="h-3.5 w-3.5 animate-spin" />{lang === 'ko' ? 'AI 생성 중...' : 'Generating...'}</>
              ) : (
                <><Sparkles className="h-3.5 w-3.5" />{lang === 'ko' ? '생성하기' : 'Generate'}</>
              )}
            </Button>
            {result && (
              <>
                <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2 dark:border-gray-600 dark:text-gray-300">
                  {copied ? <><Check className="h-3.5 w-3.5 text-green-500" />{lang === 'ko' ? '복사됨' : 'Copied'}</> : <><Copy className="h-3.5 w-3.5" />{lang === 'ko' ? '복사' : 'Copy'}</>}
                </Button>
                <Button onClick={() => clear(repo.name, selected)} variant="ghost" size="sm" className="text-gray-400 dark:text-gray-500 text-xs">
                  {lang === 'ko' ? '초기화' : 'Clear'}
                </Button>
              </>
            )}
          </div>

          {/* Error */}
          {err && (
            <p className="text-xs text-red-500 dark:text-red-400">{err}</p>
          )}

          {/* Result */}
          {result && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {PLATFORMS.find(p => p.id === selected)?.icon} {lang === 'ko' ? PLATFORMS.find(p => p.id === selected)?.label : PLATFORMS.find(p => p.id === selected)?.labelEn}
                  {' · '}{result.model}
                </span>
                <span className="text-xs text-gray-300 dark:text-gray-600">
                  {new Date(result.generatedAt).toLocaleTimeString()}
                </span>
              </div>
              <pre className="p-4 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-sans max-h-96 overflow-y-auto">
                {result.content}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
