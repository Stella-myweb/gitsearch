import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, Globe } from 'lucide-react'
import { SearchBox } from '@/components/common/SearchBox'
import { useUIStore } from '@/store/uiStore'
import { useT } from '@/hooks/useT'

export function Header() {
  const navigate = useNavigate()
  const { toggleTheme, theme, toggleLang, lang } = useUIStore()
  const t = useT()

  function handleSearch(query: string) {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{t.appName}</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <SearchBox onSearch={handleSearch} placeholder={t.searchPlaceholder} />
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          {(['/', '/search', '/roadmap', '/about'] as const).map((path, i) => {
            const labels = [t.nav.home, t.nav.search, t.nav.roadmap, t.nav.about]
            return (
              <Link
                key={path}
                to={path}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {labels[i]}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === 'ko' ? 'EN' : 'KO'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title={theme === 'light' ? '다크 모드' : '라이트 모드'}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}
