import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useTaskStore } from '@/store/taskStore'
import { mockProjects, mockTeamMembers } from '@/services/mockData'
import type { TaskStatus, TaskPriority } from '@/types'
import { cn } from '@/lib/utils'

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'todo', label: 'To Do', color: 'bg-gray-500' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
    { value: 'in_review', label: 'In Review', color: 'bg-purple-500' },
    { value: 'done', label: 'Done', color: 'bg-green-500' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-yellow-500' },
]

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-gray-500' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
    { value: 'high', label: 'High', color: 'bg-blue-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
]

export function TaskModal() {
    const {
        isModalOpen,
        modalMode,
        selectedTask,
        closeModal,
        createTask,
        updateTask,
        deleteTask,
    } = useTaskStore()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project_id: '',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
        assigned_to: '',
        due_date: '',
        client_visible: true,
    })

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isModalOpen])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        if (isModalOpen) {
            document.addEventListener('keydown', handleEscape)
        }
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isModalOpen])

    // Sync form data with selected task
    useEffect(() => {
        if (selectedTask) {
            setFormData({
                title: selectedTask.title || '',
                description: selectedTask.description || '',
                project_id: selectedTask.project_id || '',
                status: selectedTask.status || 'todo',
                priority: selectedTask.priority || 'medium',
                assigned_to: selectedTask.assigned_to || '',
                due_date: selectedTask.due_date || '',
                client_visible: selectedTask.client_visible ?? true,
            })
        }
    }, [selectedTask])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim()) return

        if (modalMode === 'create') {
            createTask({
                ...formData,
                clickup_task_id: `ck-${Date.now()}`,
                time_tracked_minutes: 0,
            })
        } else if (modalMode === 'edit' && selectedTask) {
            updateTask(selectedTask.id, formData)
            closeModal()
        }
    }

    const handleDelete = () => {
        if (selectedTask) {
            deleteTask(selectedTask.id)
            closeModal()
            setShowDeleteConfirm(false)
        }
    }

    const handleClose = () => {
        closeModal()
        setShowDeleteConfirm(false)
        setFormData({
            title: '',
            description: '',
            project_id: '',
            status: 'todo',
            priority: 'medium',
            assigned_to: '',
            due_date: '',
            client_visible: true,
        })
    }

    const isViewMode = modalMode === 'view'

    if (!isModalOpen) return null

    return (
        <AnimatePresence>
            {isModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal - Properly centered with flexbox */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 bg-card/95 backdrop-blur-lg shadow-2xl p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        {modalMode === 'create' && 'Create New Task'}
                                        {modalMode === 'edit' && 'Edit Task'}
                                        {modalMode === 'view' && 'Task Details'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {modalMode === 'create' && 'Add a new task to your project.'}
                                        {modalMode === 'edit' && 'Make changes to the task details.'}
                                        {modalMode === 'view' && 'View task information.'}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    className="text-muted-foreground hover:text-foreground -mt-1 -mr-2"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {showDeleteConfirm ? (
                                <div className="py-6 text-center space-y-4">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                        <Trash2 className="h-6 w-6 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Delete Task?</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 justify-center">
                                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDelete}>
                                            Delete Task
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Task title..."
                                            disabled={isViewMode}
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Task description..."
                                            disabled={isViewMode}
                                            rows={3}
                                        />
                                    </div>

                                    {/* Project & Assignee Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="project">Project</Label>
                                            <Select
                                                value={formData.project_id}
                                                onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                                                disabled={isViewMode}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {mockProjects.map((project) => (
                                                        <SelectItem key={project.id} value={project.id}>
                                                            {project.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="assignee">Assignee</Label>
                                            <Select
                                                value={formData.assigned_to || 'unassigned'}
                                                onValueChange={(value) => setFormData({ ...formData, assigned_to: value === 'unassigned' ? '' : value })}
                                                disabled={isViewMode}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Unassigned" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                                    {mockTeamMembers.map((member) => (
                                                        <SelectItem key={member.id} value={member.name}>
                                                            {member.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Status & Priority Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                                                disabled={isViewMode}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                                                {option.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="priority">Priority</Label>
                                            <Select
                                                value={formData.priority}
                                                onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                                                disabled={isViewMode}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {priorityOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                                                {option.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Due Date & Client Visibility */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="due_date">Due Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        disabled={isViewMode}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal h-10",
                                                            !formData.due_date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {formData.due_date ? (
                                                            format(parseISO(formData.due_date), "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={formData.due_date ? parseISO(formData.due_date) : undefined}
                                                        onSelect={(date) => {
                                                            setFormData({
                                                                ...formData,
                                                                due_date: date ? format(date, 'yyyy-MM-dd') : ''
                                                            })
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Client Visibility</Label>
                                            <div className="flex items-center gap-2 h-10">
                                                <input
                                                    type="checkbox"
                                                    id="client_visible"
                                                    checked={formData.client_visible}
                                                    onChange={(e) => setFormData({ ...formData, client_visible: e.target.checked })}
                                                    disabled={isViewMode}
                                                    className="h-4 w-4 rounded border-gray-300 accent-blue-500"
                                                />
                                                <Label htmlFor="client_visible" className="text-sm font-normal">
                                                    Visible to client
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Created/Updated info for view/edit mode */}
                                    {(modalMode === 'view' || modalMode === 'edit') && selectedTask && (
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                                            <span>Created: {format(new Date(selectedTask.created_at), 'MMM d, yyyy')}</span>
                                            <span>•</span>
                                            <span>Updated: {format(new Date(selectedTask.updated_at), 'MMM d, yyyy')}</span>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex justify-between pt-4 border-t">
                                        <div>
                                            {modalMode === 'edit' && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" onClick={handleClose}>
                                                {isViewMode ? 'Close' : 'Cancel'}
                                            </Button>
                                            {!isViewMode && (
                                                <Button type="submit" variant="gradient">
                                                    {modalMode === 'create' ? 'Create Task' : 'Save Changes'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
