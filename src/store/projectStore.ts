import { create } from 'zustand'
import type { Project, ProjectActivity } from '@/types'

interface ProjectStore {
    selectedProject: Project | null
    isDetailModalOpen: boolean
    projectActivities: ProjectActivity[]

    // Actions
    openProjectDetail: (project: Project) => void
    closeProjectDetail: () => void
    getProjectActivities: (projectId: string) => ProjectActivity[]
}

// Mock activities data
const mockActivities: ProjectActivity[] = [
    {
        id: '1',
        project_id: 'proj-1',
        user_id: 'user-1',
        user_name: 'Sarah Mitchell',
        action: 'created',
        description: 'Created this project',
        timestamp: '2024-12-10T14:30:00Z'
    },
    {
        id: '2',
        project_id: 'proj-1',
        user_id: 'user-2',
        user_name: 'Mike Rodriguez',
        action: 'assigned',
        description: 'Assigned team members to the project',
        timestamp: '2024-12-10T15:45:00Z'
    },
    {
        id: '3',
        project_id: 'proj-1',
        user_id: 'user-1',
        user_name: 'Sarah Mitchell',
        action: 'status_changed',
        description: 'Changed status from To Do to In Progress',
        timestamp: '2024-12-11T09:00:00Z'
    },
    {
        id: '4',
        project_id: 'proj-1',
        user_id: 'user-3',
        user_name: 'Alex Johnson',
        action: 'commented',
        description: 'Added a comment about the timeline',
        timestamp: '2024-12-12T11:20:00Z'
    },
    {
        id: '5',
        project_id: 'proj-2',
        user_id: 'user-1',
        user_name: 'Sarah Mitchell',
        action: 'created',
        description: 'Created this project',
        timestamp: '2024-12-09T10:00:00Z'
    },
    {
        id: '6',
        project_id: 'proj-2',
        user_id: 'user-2',
        user_name: 'Mike Rodriguez',
        action: 'updated',
        description: 'Updated project description',
        timestamp: '2024-12-11T16:30:00Z'
    },
]

export const useProjectStore = create<ProjectStore>((set, get) => ({
    selectedProject: null,
    isDetailModalOpen: false,
    projectActivities: mockActivities,

    openProjectDetail: (project: Project) => {
        set({ selectedProject: project, isDetailModalOpen: true })
    },

    closeProjectDetail: () => {
        set({ selectedProject: null, isDetailModalOpen: false })
    },

    getProjectActivities: (projectId: string) => {
        return get().projectActivities.filter(a => a.project_id === projectId)
    },
}))
