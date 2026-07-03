import { Github } from 'lucide-react'
import { GITHUB_USERNAME } from '@/config/env'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} 깃서치 — GitHub Repository Wiki Viewer
          </p>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            {GITHUB_USERNAME}
          </a>
        </div>
      </div>
    </footer>
  )
}
