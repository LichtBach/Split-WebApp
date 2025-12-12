import { Badge } from '@/components/ui/badge'
import type { TaskStatus, TaskPriority } from '@/types'
import { cn } from '@/lib/utils'

interface TaskStatusBadgeProps {
    status: TaskStatus
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
    todo: {
        label: 'To Do',
        className: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    },
    in_progress: {
        label: 'In Progress',
        className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    in_review: {
        label: 'In Review',
        className: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
    done: {
        label: 'Done',
        className: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    on_hold: {
        label: 'On Hold',
        className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
    const config = statusConfig[status]
    return (
        <Badge variant="outline" className={cn('font-medium', config.className)}>
            {config.label}
        </Badge>
    )
}

interface TaskPriorityBadgeProps {
    priority: TaskPriority
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
    low: {
        label: 'Low',
        className: 'bg-gray-500/10 text-gray-500',
    },
    medium: {
        label: 'Medium',
        className: 'bg-blue-500/10 text-blue-500',
    },
    high: {
        label: 'High',
        className: 'bg-orange-500/10 text-orange-500',
    },
    urgent: {
        label: 'Urgent',
        className: 'bg-red-500/10 text-red-500',
    },
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
    const config = priorityConfig[priority]
    return (
        <Badge variant="outline" className={cn('font-medium', config.className)}>
            {config.label}
        </Badge>
    )
}
