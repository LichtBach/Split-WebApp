import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, parseISO } from "date-fns"

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format currency values
 */
export function formatCurrency(
    value: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value)
}

/**
 * Format large numbers with abbreviations (1K, 1M, etc.)
 */
export function formatNumber(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
}

/**
 * Format duration in minutes to human readable (2h 5m)
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/**
 * Format percentage with trend indicator
 */
export function formatPercentage(value: number, showSign: boolean = false): string {
    const sign = showSign && value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, formatStr)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { addSuffix: true })
}

/**
 * Get initials from name (for avatars)
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0
    return Math.round((completed / total) * 100)
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        // Project statuses
        active: 'bg-green-500/10 text-green-500 border-green-500/20',
        'on-hold': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        // Task statuses
        todo: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        in_review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        done: 'bg-green-500/10 text-green-500 border-green-500/20',
        // Billing statuses
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    }
    return colors[status] || colors.todo
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
        low: 'bg-gray-500/10 text-gray-500',
        medium: 'bg-blue-500/10 text-blue-500',
        high: 'bg-orange-500/10 text-orange-500',
        urgent: 'bg-red-500/10 text-red-500',
    }
    return colors[priority] || colors.medium
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Sleep utility for async/await
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
