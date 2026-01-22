import { useState } from 'react'
import {
    Calendar,
    Clock,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Circle as CircleIcon,
    AlertCircle,
    Pause
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TaskStatusBadge, TaskPriorityBadge } from './TaskStatusBadge'
import type { Task, TaskStatus } from '@/types'
import { formatDate, formatRelativeTime, formatDuration, cn } from '@/lib/utils'

interface TaskItemProps {
    task: Task
    expanded?: boolean
    onToggle?: () => void
}

function TaskItem({ task, expanded = false, onToggle }: TaskItemProps) {
    return (
        <Card
            className={cn(
                "transition-transform duration-200 hover:scale-[1.02] origin-left border-l-4 will-change-transform",
                task.priority === 'urgent' && "border-l-red-500",
                task.priority === 'high' && "border-l-[#dd3333]",
                task.priority === 'medium' && "border-l-yellow-500",
                task.priority === 'low' && "border-l-gray-500",
            )}
        >
            <CardContent className="p-0">
                {/* Task Header - Always Visible */}
                <div
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={onToggle}
                >
                    {/* Expand Icon */}
                    <button className="text-muted-foreground hover:text-foreground">
                        {expanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>

                    {/* Status Badge */}
                    <TaskStatusBadge status={task.status} />

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{task.title}</h4>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                        {task.assigned_to && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#dd3333] to-[#b52828] flex items-center justify-center text-white text-xs font-medium">
                                    {task.assigned_to.charAt(0)}
                                </div>
                                <span className="hidden md:inline">{task.assigned_to}</span>
                            </div>
                        )}
                        {task.due_date && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDate(task.due_date, 'MMM d')}</span>
                            </div>
                        )}
                        <TaskPriorityBadge priority={task.priority} />
                    </div>
                </div>

                {/* Expanded Content */}
                {expanded && (
                    <div className="border-t bg-muted/30 p-4 space-y-4 animate-fade-in">
                        {/* Description */}
                        {task.description && (
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-muted-foreground">Description</h5>
                                <p className="text-sm leading-relaxed bg-background/50 rounded-lg p-3 border">
                                    {task.description}
                                </p>
                            </div>
                        )}

                        {/* Task Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Assignee */}
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Assignee</p>
                                <div className="flex items-center gap-2">
                                    {task.assigned_to ? (
                                        <>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#dd3333] to-[#b52828] flex items-center justify-center text-white text-xs font-medium">
                                                {task.assigned_to.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium">{task.assigned_to}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">Unassigned</span>
                                    )}
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {task.due_date ? formatDate(task.due_date, 'MMM d, yyyy') : 'No due date'}
                                    </span>
                                </div>
                            </div>

                            {/* Time Tracked */}
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Time Tracked</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {task.time_tracked_minutes > 0
                                            ? formatDuration(task.time_tracked_minutes)
                                            : 'No time logged'}
                                    </span>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Priority</p>
                                <TaskPriorityBadge priority={task.priority} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Created {formatRelativeTime(task.created_at)}</span>
                                <span>•</span>
                                <span>Updated {formatRelativeTime(task.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

interface TaskListProps {
    tasks: Task[]
    title?: string
}

export function TaskList({ tasks, title }: TaskListProps) {
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

    const toggleTask = (taskId: string) => {
        setExpandedTasks(prev => {
            const next = new Set(prev)
            if (next.has(taskId)) {
                next.delete(taskId)
            } else {
                next.add(taskId)
            }
            return next
        })
    }

    if (tasks.length === 0) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No tasks found</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            {title && (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <span className="text-sm text-muted-foreground">{tasks.length} tasks</span>
                </div>
            )}
            <div className="space-y-2">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        expanded={expandedTasks.has(task.id)}
                        onToggle={() => toggleTask(task.id)}
                    />
                ))}
            </div>
        </div>
    )
}

interface RecentTasksProps {
    tasks: Task[]
    limit?: number
}

export function RecentTasks({ tasks, limit = 5 }: RecentTasksProps) {
    const recentTasks = tasks.slice(0, limit)
    return <TaskList tasks={recentTasks} title="Recent Tasks" />
}
