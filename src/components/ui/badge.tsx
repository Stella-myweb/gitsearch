import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900',
  secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
  destructive: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
