import { useState, useMemo } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Building2,
    Calendar as CalendarIcon,
    Plus
} from 'lucide-react'
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    addMonths,
    subMonths,
    getDay,
    isToday,
    isSameMonth,
    differenceInDays,
    parseISO,
    isAfter,
    isBefore
} from 'date-fns'
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
import { mockClients, mockProjects } from '@/services/mockData'
import { useTaskStore } from '@/store/taskStore'
import { cn } from '@/lib/utils'

interface TimelineTask extends Task {
    startDate: Date
    endDate: Date
    color: string
}

const clientColors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-pink-500',
    'bg-cyan-500',
]

export function ClientTimeline() {
    const { tasks } = useTaskStore()
    const [currentDate, setCurrentDate] = useState(new Date())

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startDay = getDay(monthStart)

    // Get clients with their tasks
    const clientsWithTasks = useMemo(() => {
        return mockClients.map((client, index) => {
            const clientProjects = mockProjects.filter(p => client.projects.includes(p.id))
            const clientTasks = tasks.filter(t =>
                clientProjects.some(p => p.id === t.project_id) &&
                t.client_visible !== false
            )

            const timelineTasks: TimelineTask[] = clientTasks
                .filter(t => t.due_date)
                .map(t => {
                    const dueDate = parseISO(t.due_date!)
                    // Estimate start date based on status and creation
                    const createdDate = parseISO(t.created_at)
                    const startDate = t.status === 'done' ? createdDate :
                        isAfter(createdDate, subMonths(dueDate, 1)) ? createdDate : subMonths(dueDate, 1)

                    return {
                        ...t,
                        startDate,
                        endDate: dueDate,
                        color: clientColors[index % clientColors.length],
                    }
                })

            return {
                client,
                tasks: timelineTasks,
                color: clientColors[index % clientColors.length],
            }
        }).filter(c => c.tasks.length > 0)
    }, [tasks])

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev =>
            direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Client Timeline</h1>
                    <p className="text-muted-foreground">
                        View project milestones and deadlines for each client
                    </p>
                </div>
                <Button variant="gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                </Button>
            </div>

            {/* Calendar Navigation */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Timeline View</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => navigateMonth('prev')}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium min-w-[140px] text-center">
                                {format(currentDate, 'MMMM yyyy')}
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
                        <div className="grid grid-cols-7 gap-1 mb-3 border-b pb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-medium text-muted-foreground py-1"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid with Tasks */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells for days before month starts */}
                            {Array.from({ length: startDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[100px]" />
                            ))}

                            {/* Days of the month */}
                            {days.map(day => {
                                const dateStr = format(day, 'yyyy-MM-dd')
                                const isCurrentDay = isToday(day)

                                // Find tasks that span this day
                                const dayTasks = clientsWithTasks.flatMap(({ client, tasks, color }) =>
                                    tasks.filter(task => {
                                        const isStart = format(task.startDate, 'yyyy-MM-dd') === dateStr
                                        const isBetween = isAfter(day, task.startDate) && isBefore(day, task.endDate)
                                        const isEnd = format(task.endDate, 'yyyy-MM-dd') === dateStr
                                        return isStart || isBetween || isEnd
                                    }).map(task => ({
                                        ...task,
                                        client,
                                        isStart: format(task.startDate, 'yyyy-MM-dd') === dateStr,
                                        isEnd: format(task.endDate, 'yyyy-MM-dd') === dateStr,
                                        color,
                                    }))
                                )

                                return (
                                    <div
                                        key={dateStr}
                                        className={cn(
                                            "min-h-[100px] p-1 rounded-lg border transition-colors",
                                            isCurrentDay && "bg-primary/5 border-primary",
                                            !isCurrentDay && "border-transparent hover:border-border"
                                        )}
                                    >
                                        {/* Date Number */}
                                        <div className={cn(
                                            "text-xs font-medium mb-1 px-1",
                                            isCurrentDay && "text-primary",
                                            !isSameMonth(day, currentDate) && "text-muted-foreground/50"
                                        )}>
                                            {format(day, 'd')}
                                        </div>

                                        {/* Tasks */}
                                        <div className="space-y-1">
                                            {dayTasks.slice(0, 3).map((task, idx) => (
                                                <Tooltip key={`${task.id}-${idx}`}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={cn(
                                                                "text-[10px] px-1.5 py-0.5 truncate cursor-pointer text-white",
                                                                task.color,
                                                                task.isStart && "rounded-l",
                                                                task.isEnd && "rounded-r",
                                                                !task.isStart && !task.isEnd && "rounded-none"
                                                            )}
                                                        >
                                                            {task.isStart ? task.title : ''}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="max-w-[250px]">
                                                        <div className="space-y-1">
                                                            <p className="font-medium">{task.title}</p>
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <Building2 className="h-3 w-3" />
                                                                <span>{task.client.company}</span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {format(task.startDate, 'MMM d')} - {format(task.endDate, 'MMM d, yyyy')}
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
                </CardContent>
            </Card>

            {/* Client Legend */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Clients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {clientsWithTasks.map(({ client, tasks, color }) => (
                            <div key={client.id} className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded", color)} />
                                <span className="text-sm font-medium">{client.company}</span>
                                <span className="text-xs text-muted-foreground">
                                    ({tasks.length} tasks)
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Upcoming Deadlines
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {clientsWithTasks
                            .flatMap(({ client, tasks }) =>
                                tasks.map(t => ({ ...t, client }))
                            )
                            .filter(t => isAfter(t.endDate, new Date()))
                            .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
                            .slice(0, 5)
                            .map(task => {
                                const daysUntil = differenceInDays(task.endDate, new Date())

                                return (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-1 h-10 rounded", task.color)} />
                                            <div>
                                                <p className="font-medium text-sm">{task.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {task.client.company}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {format(task.endDate, 'MMM d, yyyy')}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px]",
                                                    daysUntil <= 3 && "bg-red-500/10 text-red-500",
                                                    daysUntil > 3 && daysUntil <= 7 && "bg-yellow-500/10 text-yellow-500",
                                                    daysUntil > 7 && "bg-green-500/10 text-green-500"
                                                )}
                                            >
                                                {daysUntil === 0 ? 'Today' :
                                                    daysUntil === 1 ? 'Tomorrow' :
                                                        `${daysUntil} days`}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
