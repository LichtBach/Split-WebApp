import { useState } from 'react'
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskList } from '@/components/tasks/TaskList'
import { useTaskStore } from '@/store/taskStore'
import { departmentConfig, type Department } from '@/services/mockData'
import type { TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'done', label: 'Done' },
]

const departments: Department[] = ['DATA', 'PMK', 'SEO', 'SM', 'CONTENT']

interface DepartmentSectionProps {
    department: Department
    tasks: any[]
    searchQuery: string
    statusFilter: TaskStatus | 'all'
}

function DepartmentSection({ department, tasks, searchQuery, statusFilter }: DepartmentSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const config = departmentConfig[department]

    // Filter tasks for this department
    const departmentTasks = tasks.filter((task: any) => task.department === department)

    // Apply search and status filters
    const filteredTasks = departmentTasks.filter((task: any) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter
        return matchesSearch && matchesStatus
    })

    if (filteredTasks.length === 0) return null

    const completedCount = filteredTasks.filter((t: any) => t.status === 'done').length
    const inProgressCount = filteredTasks.filter((t: any) => t.status === 'in_progress').length

    return (
        <Card className="overflow-hidden">
            <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors py-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${config.color}15` }}
                        >
                            {config.icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {config.name}
                                <span className="text-sm font-normal text-muted-foreground">
                                    ({filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'})
                                </span>
                            </CardTitle>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="text-emerald-500">{completedCount} completed</span>
                                <span className="text-blue-500">{inProgressCount} in progress</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent className="pt-0 pb-4">
                    <TaskList tasks={filteredTasks} />
                </CardContent>
            )}
        </Card>
    )
}

export function TasksPage() {
    const { tasks } = useTaskStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')

    // Overall stats
    const taskCounts = {
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        in_review: tasks.filter(t => t.status === 'in_review').length,
        done: tasks.filter(t => t.status === 'done').length,
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">
                        View all project tasks organized by team
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(taskCounts).map(([status, count]) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as TaskStatus)}
                        className={cn(
                            "p-3 rounded-lg border transition-all text-left",
                            statusFilter === status
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/50 hover:bg-accent/50'
                        )}
                    >
                        <p className="text-2xl font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                            {status.replace('_', ' ')}
                        </p>
                    </button>
                ))}
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
                    {statusFilters.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={statusFilter === filter.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter(filter.value)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tasks by Department */}
            <div className="space-y-4">
                {departments.map((department) => (
                    <DepartmentSection
                        key={department}
                        department={department}
                        tasks={tasks}
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                    />
                ))}
            </div>

            {/* Empty state */}
            {tasks.length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                    <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                    <p className="text-muted-foreground">
                        Tasks will appear here as they are assigned
                    </p>
                </div>
            )}
        </div>
    )
}
