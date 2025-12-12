import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CallsChartData } from '@/types'
import { formatDate } from '@/lib/utils'

interface CallsChartProps {
    data: CallsChartData[]
    title?: string
    showQualified?: boolean
    showConversions?: boolean
}

export function CallsChart({
    data,
    title = 'Calls Over Time',
    showQualified = true,
    showConversions = true,
}: CallsChartProps) {
    const formattedData = data.map(item => ({
        ...item,
        displayDate: formatDate(item.date, 'MMM d'),
    }))

    return (
        <Card className="relative overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={formattedData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <defs>
                                {/* Simplified gradients without heavy filters */}
                                <linearGradient id="callsGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="qualifiedGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="conversionsGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
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
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgb(0 0 0 / 0.3)',
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />

                            {/* Area fills for subtle glow effect */}
                            <Area
                                type="monotone"
                                dataKey="calls"
                                stroke="none"
                                fill="url(#callsGlow)"
                                fillOpacity={1}
                            />
                            {showQualified && (
                                <Area
                                    type="monotone"
                                    dataKey="qualified"
                                    stroke="none"
                                    fill="url(#qualifiedGlow)"
                                    fillOpacity={1}
                                />
                            )}
                            {showConversions && (
                                <Area
                                    type="monotone"
                                    dataKey="conversions"
                                    stroke="none"
                                    fill="url(#conversionsGlow)"
                                    fillOpacity={1}
                                />
                            )}

                            {/* Main lines - no heavy SVG filters */}
                            <Line
                                type="monotone"
                                dataKey="calls"
                                name="Total Calls"
                                stroke="#FF6B00"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: '#FF6B00' }}
                                activeDot={{ r: 6, fill: '#FF6B00', stroke: '#fff', strokeWidth: 2 }}
                            />
                            {showQualified && (
                                <Line
                                    type="monotone"
                                    dataKey="qualified"
                                    name="Qualified Leads"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: '#22c55e' }}
                                    activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                                />
                            )}
                            {showConversions && (
                                <Line
                                    type="monotone"
                                    dataKey="conversions"
                                    name="Conversions"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: '#a855f7' }}
                                    activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
