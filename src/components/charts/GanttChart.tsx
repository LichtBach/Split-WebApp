import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { format, addDays, startOfWeek } from 'date-fns'

// Category types and colors
export type TaskCategory = 'foundation' | 'testing' | 'integration' | 'production' | 'critical'

const categoryConfig: Record<TaskCategory, { label: string; color: string; gradient: string }> = {
    foundation: {
        label: 'Foundation',
        color: '#7C3AED',
        gradient: 'from-violet-500 to-purple-600',
    },
    testing: {
        label: 'Testing & MVP',
        color: '#EC4899',
        gradient: 'from-pink-500 to-rose-500',
    },
    integration: {
        label: 'Integration',
        color: '#3B82F6',
        gradient: 'from-blue-500 to-indigo-500',
    },
    production: {
        label: 'Production Launch',
        color: '#10B981',
        gradient: 'from-emerald-400 to-teal-500',
    },
    critical: {
        label: 'Critical Dependency',
        color: '#F59E0B',
        gradient: 'from-amber-400 to-orange-500',
    },
}

export interface GanttTask {
    id: string
    title: string
    icon?: string
    category: TaskCategory
    startWeek: number
    endWeek: number
}

interface GanttChartProps {
    tasks?: GanttTask[]
    title?: string
    startDate?: Date
    weeksToShow?: number
}

// Default demo data
const defaultTasks: GanttTask[] = [
    { id: '1', title: 'Design Conversational Flows', icon: '💬', category: 'foundation', startWeek: 1, endWeek: 1 },
    { id: '2', title: 'Configure Knowledge Base', icon: '🧠', category: 'foundation', startWeek: 1, endWeek: 1 },
    { id: '3', title: 'Build FAQ Database', icon: '❓', category: 'foundation', startWeek: 1, endWeek: 1 },
    { id: '4', title: 'API Integration', icon: '🔗', category: 'integration', startWeek: 1, endWeek: 1 },
    { id: '5', title: 'Comprehensive Testing', icon: '✅', category: 'testing', startWeek: 2, endWeek: 2 },
    { id: '6', title: 'Debug & Resolve Issues', icon: '🔧', category: 'testing', startWeek: 2, endWeek: 2 },
    { id: '7', title: 'Performance Optimization', icon: '📊', category: 'testing', startWeek: 2, endWeek: 2 },
    { id: '8', title: 'Ticketing System Integration', icon: '🎫', category: 'production', startWeek: 3, endWeek: 3 },
    { id: '9', title: 'Twilio Number Porting', icon: '📞', category: 'critical', startWeek: 3, endWeek: 4 },
    { id: '10', title: 'Upload EV Manuals', icon: '📚', category: 'production', startWeek: 3, endWeek: 3 },
]

export function GanttChart({
    tasks = defaultTasks,
    title = 'Project Timeline',
    startDate = new Date(),
    weeksToShow = 4,
}: GanttChartProps) {
    // Generate week headers
    const weeks = useMemo(() => {
        const weekStart = startOfWeek(startDate, { weekStartsOn: 1 })
        return Array.from({ length: weeksToShow }, (_, i) => {
            const weekStartDate = addDays(weekStart, i * 7)
            const weekEndDate = addDays(weekStartDate, 4) // Mon-Fri
            return {
                number: i + 1,
                label: `Week ${i + 1}`,
                dateRange: `${format(weekStartDate, 'MMM d')}-${format(weekEndDate, 'd')}`,
            }
        })
    }, [startDate, weeksToShow])

    // Get unique categories used in tasks for legend
    const usedCategories = useMemo(() => {
        const cats = new Set(tasks.map(t => t.category))
        return Array.from(cats) as TaskCategory[]
    }, [tasks])

    // Calculate bar position and width
    const getBarStyle = (task: GanttTask) => {
        const startPercent = ((task.startWeek - 1) / weeksToShow) * 100
        const widthPercent = ((task.endWeek - task.startWeek + 1) / weeksToShow) * 100
        return {
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <span>{title}</span>
                </CardTitle>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4">
                    {usedCategories.map((cat) => (
                        <div key={cat} className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "w-4 h-4 rounded",
                                    `bg-gradient-to-r ${categoryConfig[cat].gradient}`
                                )}
                            />
                            <span className="text-sm text-muted-foreground">
                                {categoryConfig[cat].label}
                            </span>
                        </div>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        {/* Header */}
                        <thead>
                            <tr className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                                <th className="text-left p-4 font-semibold min-w-[250px] border-r border-white/20">
                                    Task / Deliverable
                                </th>
                                {weeks.map((week) => (
                                    <th
                                        key={week.number}
                                        className="text-center p-4 font-semibold min-w-[140px] border-r last:border-r-0 border-white/20"
                                    >
                                        <div className="font-bold">{week.label}</div>
                                        <div className="text-xs font-normal opacity-80">
                                            {week.dateRange}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {tasks.map((task, idx) => (
                                <tr
                                    key={task.id}
                                    className={cn(
                                        "border-b border-border/50 hover:bg-accent/30 transition-colors",
                                        idx % 2 === 0 ? "bg-background" : "bg-muted/30"
                                    )}
                                >
                                    {/* Task Name */}
                                    <td className="p-4 font-medium border-r border-border/30">
                                        <div className="flex items-center gap-2">
                                            {task.icon && (
                                                <span className="text-lg">{task.icon}</span>
                                            )}
                                            <span>{task.title}</span>
                                        </div>
                                    </td>

                                    {/* Week cells with Gantt bars */}
                                    <td colSpan={weeksToShow} className="p-0 relative h-14">
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 flex">
                                            {weeks.map((week) => (
                                                <div
                                                    key={week.number}
                                                    className={cn(
                                                        "flex-1 border-r border-border/30 last:border-r-0"
                                                    )}
                                                />
                                            ))}
                                        </div>

                                        {/* Gantt Bar */}
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 h-8 mx-2"
                                            style={getBarStyle(task)}
                                        >
                                            <div
                                                className={cn(
                                                    "h-full rounded-lg bg-gradient-to-r shadow-md flex items-center justify-center text-white text-sm font-medium",
                                                    categoryConfig[task.category].gradient
                                                )}
                                            >
                                                Week {task.startWeek}
                                                {task.endWeek !== task.startWeek && (
                                                    <span> - {task.endWeek}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
