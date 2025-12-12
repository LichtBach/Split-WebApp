import { useState, useMemo, useCallback } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon
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
    isSameMonth
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
import { TaskModal } from '@/components/tasks/TaskModal'
import { useTaskStore } from '@/store/taskStore'
import type { Task, TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusColors: Record<TaskStatus, string> = {
    todo: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    in_review: 'bg-purple-500',
    done: 'bg-green-500',
    on_hold: 'bg-yellow-500',
}

const statusLabels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done',
    on_hold: 'On Hold',
}

interface TaskCalendarProps {
    title?: string
    showLegend?: boolean
}

export function TaskCalendar({ title = 'Task Calendar', showLegend = true }: TaskCalendarProps) {
    const { tasks, openCreateModal, openEditModal, updateTaskDueDate, selectTask } = useTaskStore()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [draggedTask, setDraggedTask] = useState<Task | null>(null)
    const [dragOverDate, setDragOverDate] = useState<string | null>(null)

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startDay = getDay(monthStart)

    // Group tasks by due date
    const tasksByDate = useMemo(() => {
        const grouped: Record<string, Task[]> = {}
        tasks.forEach((task) => {
            if (task.due_date) {
                const dateKey = task.due_date
                if (!grouped[dateKey]) {
                    grouped[dateKey] = []
                }
                grouped[dateKey].push(task)
            }
        })
        return grouped
    }, [tasks])

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev =>
            direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
        )
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    // Drag and drop handlers
    const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
        setDraggedTask(task)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', task.id)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent, dateStr: string) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDragOverDate(dateStr)
    }, [])

    const handleDragLeave = useCallback(() => {
        setDragOverDate(null)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent, dateStr: string) => {
        e.preventDefault()
        if (draggedTask && draggedTask.due_date !== dateStr) {
            updateTaskDueDate(draggedTask.id, dateStr)
        }
        setDraggedTask(null)
        setDragOverDate(null)
    }, [draggedTask, updateTaskDueDate])

    const handleDragEnd = useCallback(() => {
        setDraggedTask(null)
        setDragOverDate(null)
    }, [])

    // Click on empty day to create task
    const handleDayClick = useCallback((dateStr: string) => {
        // Pre-fill the due date when creating
        selectTask({
            id: '',
            project_id: '',
            clickup_task_id: '',
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            due_date: dateStr,
            time_tracked_minutes: 0,
            created_at: '',
            updated_at: '',
            client_visible: true,
        })
        openCreateModal()
    }, [openCreateModal, selectTask])

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">{title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={goToToday}>
                            Today
                        </Button>
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
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div
                                key={day}
                                className="text-center text-xs font-medium text-muted-foreground py-2 border-b"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[100px] bg-muted/20 rounded-md" />
                        ))}

                        {/* Days of the month */}
                        {days.map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd')
                            const dayTasks = tasksByDate[dateStr] || []
                            const isCurrentDay = isToday(day)
                            const isCurrentMonth = isSameMonth(day, currentDate)
                            const isDropTarget = dragOverDate === dateStr

                            return (
                                <div
                                    key={dateStr}
                                    className={cn(
                                        "min-h-[100px] p-1 rounded-md border transition-all cursor-pointer group",
                                        isCurrentDay && "bg-primary/5 border-primary",
                                        !isCurrentDay && "border-transparent hover:border-border hover:bg-accent/30",
                                        isDropTarget && "border-primary bg-primary/10 border-dashed",
                                        !isCurrentMonth && "opacity-50"
                                    )}
                                    onDragOver={(e) => handleDragOver(e, dateStr)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, dateStr)}
                                    onClick={() => dayTasks.length === 0 && handleDayClick(dateStr)}
                                >
                                    {/* Date Header */}
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={cn(
                                            "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                            isCurrentDay && "bg-primary text-primary-foreground"
                                        )}>
                                            {format(day, 'd')}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDayClick(dateStr)
                                            }}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Tasks */}
                                    <div className="space-y-1">
                                        {dayTasks.slice(0, 3).map((task) => (
                                            <Tooltip key={task.id}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, task)}
                                                        onDragEnd={handleDragEnd}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            openEditModal(task)
                                                        }}
                                                        className={cn(
                                                            "text-[10px] px-1.5 py-0.5 rounded truncate cursor-grab active:cursor-grabbing text-white font-medium",
                                                            statusColors[task.status],
                                                            draggedTask?.id === task.id && "opacity-50"
                                                        )}
                                                    >
                                                        {task.title}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="max-w-[200px]">
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{task.title}</p>
                                                        {task.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Badge variant="outline" className="text-[10px]">
                                                                {statusLabels[task.status]}
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
                                            <div className="text-[10px] text-muted-foreground text-center">
                                                +{dayTasks.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    {showLegend && (
                        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
                            <span className="text-xs text-muted-foreground">Status:</span>
                            {Object.entries(statusLabels).map(([status, label]) => (
                                <div key={status} className="flex items-center gap-1.5">
                                    <div className={cn("w-2.5 h-2.5 rounded", statusColors[status as TaskStatus])} />
                                    <span className="text-xs">{label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </TooltipProvider>
            </CardContent>

            {/* Task Modal */}
            <TaskModal />
        </Card>
    )
}
