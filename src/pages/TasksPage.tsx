import { useState } from 'react'
import { Search, Plus, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskModal } from '@/components/tasks/TaskModal'
import { useTaskStore } from '@/store/taskStore'
import type { TaskStatus } from '@/types'

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'done', label: 'Done' },
    { value: 'on_hold', label: 'On Hold' },
]

export function TasksPage() {
    const { tasks, openCreateModal } = useTaskStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Group by status for overview
    const taskCounts = {
        todo: tasks.filter(t => t.status === 'todo').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        in_review: tasks.filter(t => t.status === 'in_review').length,
        done: tasks.filter(t => t.status === 'done').length,
        on_hold: tasks.filter(t => t.status === 'on_hold').length,
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">
                        Manage and track all your tasks across projects
                    </p>
                </div>
                <Button variant="gradient" onClick={() => openCreateModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(taskCounts).map(([status, count]) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as TaskStatus)}
                        className={`p-3 rounded-lg border transition-all text-left ${statusFilter === status
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/50 hover:bg-accent/50'
                            }`}
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

            {/* Task List */}
            {filteredTasks.length > 0 ? (
                <TaskList tasks={filteredTasks} />
            ) : (
                <div className="text-center py-12 border rounded-lg">
                    <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery
                            ? 'Try adjusting your search query'
                            : 'Create a new task to get started'}
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
