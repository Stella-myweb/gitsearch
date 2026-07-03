import { useRef, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBoxProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
  className?: string
}

export function SearchBox({
  onSearch,
  placeholder = '검색...',
  initialValue = '',
  className,
}: SearchBoxProps) {
  const hasInteracted = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Set initial value without triggering search
  useEffect(() => {
    if (inputRef.current && initialValue) {
      inputRef.current.value = initialValue
    }
  }, [initialValue])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!hasInteracted.current) return
      const value = e.target.value
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        onSearch(value)
      }, 300)
    },
    [onSearch]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      hasInteracted.current = true
      if (e.key === 'Enter') {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        onSearch((e.target as HTMLInputElement).value)
      }
    },
    [onSearch]
  )

  const handleInput = useCallback(() => {
    hasInteracted.current = true
  }, [])

  return (
    <div className={`relative ${className ?? ''}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        className="pl-9"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </div>
  )
}
