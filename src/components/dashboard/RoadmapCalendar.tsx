import { useState, useMemo } from 'react'
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isToday,
    addMonths,
    subMonths,
    getDay,
    isSameMonth
} from 'date-fns'
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Task } from '@/types'
import { cn } from '@/lib/utils'

interface RoadmapCalendarProps {
    tasks: Task[]
    currentDate?: Date
    onDateChange?: (date: Date) => void
}

export function RoadmapCalendar({
    tasks,
    currentDate: controlledDate,
    onDateChange
}: RoadmapCalendarProps) {
    const [internalDate, setInternalDate] = useState(new Date())

    // Use controlled date if provided, otherwise use internal state
    const currentDate = controlledDate ?? internalDate
    const setCurrentDate = onDateChange ?? setInternalDate

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get the day of week the month starts on (0 = Sunday)
    const startDay = getDay(monthStart)

    // Group tasks by date
    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>()
        tasks.forEach(task => {
            if (task.due_date) {
                const dateKey = format(new Date(task.due_date), 'yyyy-MM-dd')
                const existing = map.get(dateKey) || []
                map.set(dateKey, [...existing, task])
            }
        })
        return map
    }, [tasks])

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = direction === 'prev'
            ? subMonths(currentDate, 1)
            : addMonths(currentDate, 1)
        setCurrentDate(newDate)
    }

    const getTaskColor = (task: Task) => {
        switch (task.status) {
            case 'done': return 'bg-green-500'
            case 'in_progress': return 'bg-blue-500'
            case 'in_review': return 'bg-purple-500'
            case 'on_hold': return 'bg-yellow-500'
            default: return 'bg-gray-500'
        }
    }

    const getPriorityBorder = (task: Task) => {
        switch (task.priority) {
            case 'urgent': return 'border-red-500'
            case 'high': return 'border-blue-500'
            case 'medium': return 'border-blue-500'
            default: return 'border-gray-400'
        }
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Project Roadmap</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigateMonth('prev')}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[120px] text-center">
                            {format(currentDate as Date, 'MMMM yyyy')}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigateMonth('next')}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div
                                key={day}
                                className="text-center text-xs font-medium text-muted-foreground py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[80px]" />
                        ))}

                        {/* Days of the month */}
                        {days.map(day => {
                            const dateKey = format(day, 'yyyy-MM-dd')
                            const dayTasks = tasksByDate.get(dateKey) || []
                            const isCurrentDay = isToday(day)
                            const hasUrgent = dayTasks.some(t => t.priority === 'urgent')

                            return (
                                <div
                                    key={dateKey}
                                    className={cn(
                                        "min-h-[80px] p-1 rounded-lg border transition-colors",
                                        isCurrentDay && "bg-primary/5 border-primary",
                                        !isCurrentDay && "border-transparent hover:border-border hover:bg-accent/50",
                                        hasUrgent && !isCurrentDay && "border-red-500/30"
                                    )}
                                >
                                    {/* Date Number */}
                                    <div className={cn(
                                        "text-xs font-medium mb-1 px-1",
                                        isCurrentDay && "text-primary",
                                        !isSameMonth(day, currentDate as Date) && "text-muted-foreground/50"
                                    )}>
                                        {format(day, 'd')}
                                    </div>

                                    {/* Tasks for this day */}
                                    <div className="space-y-1">
                                        {dayTasks.slice(0, 3).map(task => (
                                            <Tooltip key={task.id}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={cn(
                                                            "text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer",
                                                            "border-l-2 bg-card hover:bg-accent transition-colors",
                                                            getPriorityBorder(task)
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <Circle
                                                                className={cn("h-1.5 w-1.5 fill-current", getTaskColor(task))}
                                                            />
                                                            <span className="truncate">{task.title}</span>
                                                        </div>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="max-w-[250px]">
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{task.title}</p>
                                                        {task.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Badge variant="outline" className="text-[10px] h-5">
                                                                {task.status.replace('_', ' ')}
                                                            </Badge>
                                                            {task.assigned_to && (
                                                                <span className="text-muted-foreground">
                                                                    {task.assigned_to}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <div className="text-[10px] text-muted-foreground px-1">
                                                +{dayTasks.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </TooltipProvider>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center gap-1">
                        <Circle className="h-2 w-2 fill-gray-500 text-gray-500" />
                        <span>To Do</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                        <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Circle className="h-2 w-2 fill-purple-500 text-purple-500" />
                        <span>Review</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                        <span>Done</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
