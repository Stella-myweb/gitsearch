export interface CurriculumMeta {
  repoName: string
  day?: number
  dayRange?: [number, number]
  part: number
  score?: number
  scoreType?: 'mid' | 'final'
  difficulty: 1 | 2 | 3 | 4 | 5
  categories: string[]
  learningGoals: string[]
  relatedRepos: string[]
  archPattern?: string
  useCase: ('portfolio' | 'akamai' | 'saas' | 'hive')[]
  summary?: string
}

export const CURRICULUM: CurriculumMeta[] = [
  {
    repoName: 'gitsearch',
    dayRange: [18, 20],
    part: 8,
    score: 60,
    scoreType: 'final',
    difficulty: 4,
    categories: ['React', 'GitHub API', 'Portfolio'],
    learningGoals: ['GitHub REST API 활용', 'Vite + React 19', 'Vercel 배포', '재사용 아키텍처 시각화'],
    relatedRepos: ['jobtrend', 'security-news-pipeline'],
    archPattern: 'GitHub API + React Wiki',
    useCase: ['portfolio', 'akamai'],
    summary: 'GitHub 저장소를 학습자 친화적인 Wiki로 탐색하는 포트폴리오 뷰어. 20일 과정 산출물 전체를 하나의 재사용 아키텍처 증거로 통합한다.',
  },
  {
    repoName: 'jobtrend',
    dayRange: [18, 20],
    part: 8,
    score: 60,
    scoreType: 'final',
    difficulty: 5,
    categories: ['RAG', 'LangGraph', 'MCP', 'Supabase Auth', 'Neon DB', 'OpenAI API'],
    learningGoals: ['RAG 파이프라인 설계', 'LangGraph 멀티에이전트', 'MCP 연동', 'pgvector 벡터 검색', '소셜 로그인'],
    relatedRepos: ['security-news-pipeline', 'playrank', 'gitsearch'],
    archPattern: '4-agent pipeline (Collector→Analyzer→Insight→Reporter)',
    useCase: ['portfolio', 'akamai', 'saas'],
    summary: '취업 트렌드 대시보드 + STAR Story Bank + 모의면접 + 자소서 어시스턴트. 4-agent LangGraph 파이프라인과 RAG 기반 맞춤 분석을 결합한 최종 프로젝트.',
  },
  {
    repoName: 'security-news-pipeline',
    part: 7,
    score: 40,
    scoreType: 'mid',
    difficulty: 4,
    categories: ['LangGraph', 'MCP', 'Data Pipeline', 'OpenAI API'],
    learningGoals: ['LangGraph 에이전트 설계', 'LinkedIn Card News 자동화', '4-agent 패턴'],
    relatedRepos: ['jobtrend', 'playrank', 'gitsearch'],
    archPattern: '4-agent pipeline (Collector→Analyzer→Insight→Reporter)',
    useCase: ['portfolio', 'akamai'],
    summary: '보안 뉴스를 자동 수집해 LinkedIn 카드뉴스로 변환하는 4-agent 파이프라인. JobTrend와 동일한 아키텍처 패턴을 공유한다.',
  },
  {
    repoName: 'playrank',
    part: 6,
    difficulty: 3,
    categories: ['Data Pipeline', 'OpenAI API', 'React'],
    learningGoals: ['GPT/Gemini API 활용', 'Collector→Analyzer 패턴'],
    relatedRepos: ['jobtrend', 'security-news-pipeline'],
    archPattern: 'Collector→Analyzer→Insight→Reporter',
    useCase: ['portfolio'],
    summary: '게임 랭킹 데이터 분석 파이프라인. Multi-LLM 오케스트레이션 모듈의 초기 구현체.',
  },
]

export function getCurriculumMeta(repoName: string): CurriculumMeta | undefined {
  return CURRICULUM.find(c => c.repoName.toLowerCase() === repoName.toLowerCase())
}

export const PARTS = [
  { id: 1, label: 'Part 1-2', description: '환경 구축' },
  { id: 3, label: 'Part 3', description: 'Claude Projects & Skills' },
  { id: 4, label: 'Part 4', description: 'MCP 에이전트' },
  { id: 5, label: 'Part 5', description: '중간 프로젝트' },
  { id: 6, label: 'Part 6', description: 'GPT/Gemini API' },
  { id: 7, label: 'Part 7', description: 'Agentic RAG' },
  { id: 8, label: 'Part 8', description: '최종 프로젝트' },
]
