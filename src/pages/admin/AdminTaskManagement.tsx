import { useState } from 'react'
import {
    Plus,
    Search,
    Filter,
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    Pause,
    MoreHorizontal,
    Calendar,
    Building2,
    Eye,
    EyeOff,
    GripVertical,
    Pencil,
    Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { TaskModal } from '@/components/tasks/TaskModal'
import { useTaskStore } from '@/store/taskStore'
import type { Task, TaskStatus, Client } from '@/types'
import { mockClients, mockProjects } from '@/services/mockData'
import { cn, formatDate } from '@/lib/utils'

const statusIcons: Record<TaskStatus, React.ReactNode> = {
    todo: <Circle className="h-4 w-4 text-gray-500" />,
    in_progress: <Clock className="h-4 w-4 text-blue-500" />,
    in_review: <AlertCircle className="h-4 w-4 text-purple-500" />,
    done: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    on_hold: <Pause className="h-4 w-4 text-yellow-500" />,
}

const statusLabels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done',
    on_hold: 'On Hold',
}

const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'done', label: 'Done' },
    { value: 'on_hold', label: 'On Hold' },
]

interface TaskRowProps {
    task: Task
    client?: Client
}

function TaskRow({ task, client }: TaskRowProps) {
    const {
        openEditModal,
        deleteTask,
        toggleClientVisibility,
        updateTaskStatus
    } = useTaskStore()

    const project = mockProjects.find(p => p.id === task.project_id)
    const isClientVisible = task.client_visible !== false

    const priorityColors: Record<string, string> = {
        low: 'border-l-gray-400',
        medium: 'border-l-blue-500',
        high: 'border-l-orange-500',
        urgent: 'border-l-red-500',
    }

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 border-b last:border-0 transition-transform duration-200 hover:scale-[1.01] origin-left group border-l-4",
            priorityColors[task.priority] || 'border-l-gray-400'
        )}>
            {/* Drag Handle */}
            <div className="opacity-0 group-hover:opacity-100 cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Status */}
            <div className="shrink-0">
                {statusIcons[task.status]}
            </div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{task.title}</span>
                    {isClientVisible ? (
                        <Eye className="h-3 w-3 text-green-500" />
                    ) : (
                        <EyeOff className="h-3 w-3 text-muted-foreground" />
                    )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {project && <span>{project.name}</span>}
                    {task.due_date && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.due_date, 'MMM d')}
                        </span>
                    )}
                </div>
            </div>

            {/* Assigned To */}
            <div className="flex items-center gap-2 shrink-0">
                {task.assigned_to && (
                    <div className="flex items-center gap-1.5 text-sm">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-xs">
                            {task.assigned_to.charAt(0)}
                        </div>
                        <span className="hidden md:inline text-muted-foreground">{task.assigned_to}</span>
                    </div>
                )}
            </div>

            {/* Client Tag */}
            <div className="shrink-0 min-w-[120px]">
                {client ? (
                    <Badge variant="outline" className="text-xs">
                        <Building2 className="h-3 w-3 mr-1" />
                        {client.company}
                    </Badge>
                ) : (
                    <span className="text-xs text-muted-foreground">No client</span>
                )}
            </div>

            {/* Status Badge */}
            <Badge
                variant="outline"
                className={cn(
                    "shrink-0 text-xs",
                    task.status === 'done' && "bg-green-500/10 text-green-500",
                    task.status === 'in_progress' && "bg-blue-500/10 text-blue-500",
                    task.status === 'in_review' && "bg-purple-500/10 text-purple-500",
                    task.status === 'on_hold' && "bg-yellow-500/10 text-yellow-500",
                )}
            >
                {statusLabels[task.status]}
            </Badge>

            {/* Actions */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(task)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Task
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Circle className="h-4 w-4 mr-2" />
                            Change Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            {statusOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => updateTaskStatus(task.id, option.value)}
                                >
                                    {statusIcons[option.value]}
                                    <span className="ml-2">{option.label}</span>
                                    {task.status === option.value && (
                                        <CheckCircle2 className="h-4 w-4 ml-auto text-primary" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => toggleClientVisibility(task.id)}>
                        {isClientVisible ? (
                            <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Hide from Client
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4 mr-2" />
                                Show to Client
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteTask(task.id)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export function AdminTaskManagement() {
    const { tasks, openCreateModal } = useTaskStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Group tasks by project
    const tasksByProject = filteredTasks.reduce((acc, task) => {
        const projectId = task.project_id
        if (!acc[projectId]) {
            acc[projectId] = []
        }
        acc[projectId].push(task)
        return acc
    }, {} as Record<string, Task[]>)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
                    <p className="text-muted-foreground">
                        Manage tasks and control what clients can see
                    </p>
                </div>
                <Button variant="gradient" onClick={() => openCreateModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'todo', 'in_progress', 'in_review', 'done', 'on_hold'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'all' ? 'All' : statusLabels[status]}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tasks by Project */}
            <div className="space-y-6">
                {Object.entries(tasksByProject).map(([projectId, projectTasks]) => {
                    const project = mockProjects.find(p => p.id === projectId)
                    const client = mockClients.find(c => c.projects.includes(projectId))

                    return (
                        <Card key={projectId}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold">
                                        {project?.name || 'Unknown Project'}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        {client && (
                                            <Badge variant="outline" className="text-xs">
                                                <Building2 className="h-3 w-3 mr-1" />
                                                {client.company}
                                            </Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {projectTasks.length} tasks
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {projectTasks.map((task) => (
                                        <TaskRow
                                            key={task.id}
                                            task={task}
                                            client={client}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                    <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filters
                    </p>
                    <Button variant="gradient" onClick={() => openCreateModal()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                    </Button>
                </div>
            )}

            {/* Task Modal */}
            <TaskModal />
        </div>
    )
}
