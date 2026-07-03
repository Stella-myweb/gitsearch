import { Github, Search, BookOpen, Zap } from 'lucide-react'
import { GITHUB_USERNAME } from '@/config/env'
import { useT } from '@/hooks/useT'

const FEATURE_ICONS = [Search, BookOpen, Zap]

export function About() {
  const t = useT()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{t.about.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t.about.subtitle}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 mb-12">
        {t.about.features.map(({ title, desc }, i) => {
          const Icon = FEATURE_ICONS[i]
          return (
            <div key={title} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.about.techStack}</h2>
        <div className="flex flex-wrap gap-2">
          {[
            'React 19',
            'TypeScript',
            'Vite',
            'TailwindCSS',
            'React Router v6',
            'Zustand',
            'Axios',
            'react-markdown',
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Github className="h-4 w-4" />
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            github.com/{GITHUB_USERNAME}
          </a>
        </div>
      </div>
    </div>
  )
}
