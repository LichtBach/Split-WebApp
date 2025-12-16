import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatNumber, formatPercentage } from '@/lib/utils'
import type { TrendData } from '@/types'

interface MetricCardProps {
    title: string
    value: number | string
    unit?: string
    icon?: LucideIcon
    trend?: TrendData
    className?: string
    loading?: boolean
}

export function MetricCard({
    title,
    value,
    unit,
    icon: Icon,
    trend,
    className,
    loading = false,
}: MetricCardProps) {
    if (loading) {
        return (
            <Card className={cn("", className)}>
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-8 w-32 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const displayValue = typeof value === 'number' ? formatNumber(value) : value

    return (
        <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold tracking-tight">
                                {displayValue}
                            </span>
                            {unit && (
                                <span className="text-sm text-muted-foreground">{unit}</span>
                            )}
                        </div>
                        {trend && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-sm",
                                    trend.direction === 'up' && "text-green-500",
                                    trend.direction === 'down' && "text-red-500",
                                    trend.direction === 'neutral' && "text-muted-foreground"
                                )}
                            >
                                {trend.direction === 'up' && <TrendingUp className="h-4 w-4" />}
                                {trend.direction === 'down' && <TrendingDown className="h-4 w-4" />}
                                <span>{formatPercentage(trend.percentage, true)}</span>
                                <span className="text-muted-foreground">vs last month</span>
                            </div>
                        )}
                    </div>
                    {Icon && (
                        <div className="rounded-lg bg-black p-3">
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
