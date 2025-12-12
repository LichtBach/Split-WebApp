import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CostChartData } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

interface CostChartProps {
    data: CostChartData[]
    title?: string
}

export function CostChart({ data, title = 'Daily Cost' }: CostChartProps) {
    const formattedData = data.map(item => ({
        ...item,
        displayDate: formatDate(item.date, 'MMM d'),
    }))

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl border border-white/10 bg-card p-3 shadow-lg">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">
                        Cost: <span className="font-semibold text-orange-400">{formatCurrency(payload[0].value)}</span>
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="relative overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={formattedData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                {/* Simplified gradient without filter */}
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                            <XAxis
                                dataKey="displayDate"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="cost"
                                stroke="#FF6B00"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorCost)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
