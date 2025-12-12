import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { mockTasks } from '@/services/mockData'
import { generateId } from '@/lib/utils'

interface TaskState {
    tasks: Task[]
    selectedTask: Task | null
    isModalOpen: boolean
    modalMode: 'create' | 'edit' | 'view'
}

interface TaskActions {
    // CRUD operations
    createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Task
    updateTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void

    // Task status/properties
    updateTaskStatus: (id: string, status: TaskStatus) => void
    updateTaskPriority: (id: string, priority: TaskPriority) => void
    updateTaskDueDate: (id: string, dueDate: string | undefined) => void
    assignTask: (id: string, assignee: string | undefined) => void
    toggleClientVisibility: (id: string) => void

    // Modal management
    openCreateModal: (projectId?: string) => void
    openEditModal: (task: Task) => void
    openViewModal: (task: Task) => void
    closeModal: () => void

    // Selection
    selectTask: (task: Task | null) => void

    // Getters
    getTaskById: (id: string) => Task | undefined
    getTasksByProject: (projectId: string) => Task[]
    getTasksByStatus: (status: TaskStatus) => Task[]
    getTasksByDueDate: (date: string) => Task[]
    getRecentTasks: (limit?: number) => Task[]
}

type TaskStore = TaskState & TaskActions

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            // Initial state
            tasks: mockTasks,
            selectedTask: null,
            isModalOpen: false,
            modalMode: 'create',

            // CRUD operations
            createTask: (taskData) => {
                const now = new Date().toISOString()
                const newTask: Task = {
                    ...taskData,
                    id: generateId(),
                    created_at: now,
                    updated_at: now,
                    time_tracked_minutes: taskData.time_tracked_minutes || 0,
                    client_visible: taskData.client_visible ?? true,
                }
                set((state) => ({
                    tasks: [...state.tasks, newTask],
                    isModalOpen: false,
                    selectedTask: null,
                }))
                return newTask
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? { ...task, ...updates, updated_at: new Date().toISOString() }
                            : task
                    ),
                }))
            },

            deleteTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
                }))
            },

            // Task status/properties
            updateTaskStatus: (id, status) => {
                get().updateTask(id, { status })
            },

            updateTaskPriority: (id, priority) => {
                get().updateTask(id, { priority })
            },

            updateTaskDueDate: (id, dueDate) => {
                get().updateTask(id, { due_date: dueDate })
            },

            assignTask: (id, assignee) => {
                get().updateTask(id, { assigned_to: assignee })
            },

            toggleClientVisibility: (id) => {
                const task = get().getTaskById(id)
                if (task) {
                    get().updateTask(id, { client_visible: !task.client_visible })
                }
            },

            // Modal management
            openCreateModal: (projectId) => {
                const emptyTask: Task = {
                    id: '',
                    project_id: projectId || '',
                    clickup_task_id: '',
                    title: '',
                    description: '',
                    status: 'todo',
                    priority: 'medium',
                    time_tracked_minutes: 0,
                    created_at: '',
                    updated_at: '',
                    client_visible: true,
                }
                set({
                    isModalOpen: true,
                    modalMode: 'create',
                    selectedTask: emptyTask,
                })
            },

            openEditModal: (task) => {
                set({
                    isModalOpen: true,
                    modalMode: 'edit',
                    selectedTask: task,
                })
            },

            openViewModal: (task) => {
                set({
                    isModalOpen: true,
                    modalMode: 'view',
                    selectedTask: task,
                })
            },

            closeModal: () => {
                set({
                    isModalOpen: false,
                    selectedTask: null,
                })
            },

            // Selection
            selectTask: (task) => {
                set({ selectedTask: task })
            },

            // Getters
            getTaskById: (id) => {
                return get().tasks.find((task) => task.id === id)
            },

            getTasksByProject: (projectId) => {
                return get().tasks.filter((task) => task.project_id === projectId)
            },

            getTasksByStatus: (status) => {
                return get().tasks.filter((task) => task.status === status)
            },

            getTasksByDueDate: (date) => {
                return get().tasks.filter((task) => task.due_date === date)
            },

            getRecentTasks: (limit = 5) => {
                return [...get().tasks]
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                    .slice(0, limit)
            },
        }),
        {
            name: 'task-storage',
            partialize: (state) => ({ tasks: state.tasks }),
        }
    )
)
