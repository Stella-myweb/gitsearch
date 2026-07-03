import { useUIStore } from '@/store/uiStore'
import { translations } from '@/i18n'

export function useT() {
  const lang = useUIStore(s => s.lang)
  return translations[lang]
}
