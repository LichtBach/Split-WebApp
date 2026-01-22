/**
 * ClickUp API Service for DRA Onboarding
 * 
 * Hierarchy: Workspace (Team) > Space (Client) > Folder (Department) > List > Task
 * 
 * Departments: DATA, PMK, DMK, SEO, SM, CONTENT
 */

const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2'

// Department folder names in ClickUp
export const DEPARTMENTS = {
    DATA: 'DATA',           // Analytics, GTM, GA4
    PMK: 'PMK',             // Paid Marketing
    DMK: 'DMK',             // Digital Marketing  
    SEO: 'SEO',             // Search Engine Optimization
    SM: 'SM',               // Social Media
    CONTENT: 'CONTENT',     // Content Marketing
} as const

export type Department = keyof typeof DEPARTMENTS

interface ClickUpConfig {
    apiToken: string
    teamId: string       // DRA Workspace ID
    clientSpaceId?: string  // Client's specific Space
}

// Get config from environment or localStorage
export function getClickUpConfig(): ClickUpConfig | null {
    const apiToken = import.meta.env.VITE_CLICKUP_API_TOKEN || localStorage.getItem('clickup_api_token')
    const teamId = import.meta.env.VITE_CLICKUP_TEAM_ID || localStorage.getItem('clickup_team_id')

    if (!apiToken || !teamId) {
        return null
    }

    return {
        apiToken,
        teamId,
        clientSpaceId: localStorage.getItem('clickup_space_id') || undefined
    }
}

export function hasClickUpCredentials(): boolean {
    return getClickUpConfig() !== null
}

// Set client's Space ID (called after onboarding)
export function setClientSpaceId(spaceId: string): void {
    localStorage.setItem('clickup_space_id', spaceId)
}

// API Helper
async function clickUpFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config = getClickUpConfig()
    if (!config) {
        throw new Error('ClickUp API not configured')
    }

    const response = await fetch(`${CLICKUP_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Authorization': config.apiToken,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
}

// ===============================
// TYPE DEFINITIONS
// ===============================

export interface ClickUpSpace {
    id: string
    name: string
    private: boolean
    statuses: ClickUpStatus[]
    features: Record<string, { enabled: boolean }>
}

export interface ClickUpFolder {
    id: string
    name: string
    orderindex: number
    hidden: boolean
    space: { id: string; name: string }
    task_count: string
    lists: ClickUpList[]
}

export interface ClickUpList {
    id: string
    name: string
    orderindex: number
    status?: ClickUpStatus
    task_count: number
    folder: { id: string; name: string }
    space: { id: string; name: string }
}

export interface ClickUpStatus {
    id?: string
    status: string
    type: string
    orderindex: number
    color: string
}

export interface ClickUpTask {
    id: string
    custom_id?: string
    name: string
    text_content?: string
    description: string
    status: ClickUpStatus
    priority?: { priority: string; color: string; id: string }
    orderindex: string
    date_created: string
    date_updated: string
    date_closed?: string
    date_done?: string
    creator: ClickUpUser
    assignees: ClickUpUser[]
    watchers: ClickUpUser[]
    tags: ClickUpTag[]
    parent?: string
    folder: { id: string; name: string }
    space: { id: string }
    list: { id: string; name: string }
    url: string
    start_date?: string
    due_date?: string
    time_estimate?: number
    time_spent?: number
    custom_fields?: ClickUpCustomField[]
    attachments?: ClickUpAttachment[]
    // Extended field for department tracking
    _department?: string
}

export interface ClickUpUser {
    id: number
    username: string
    email: string
    color: string
    profilePicture?: string
    initials: string
}

export interface ClickUpTag {
    name: string
    tag_fg: string
    tag_bg: string
    creator: number
}

export interface ClickUpCustomField {
    id: string
    name: string
    type: string
    value?: unknown
}

export interface ClickUpAttachment {
    id: string
    version: string
    date: string
    title: string
    extension: string
    thumbnail_small?: string
    thumbnail_medium?: string
    thumbnail_large?: string
    url: string
    size?: number
}

// ===============================
// API FUNCTIONS
// ===============================

/**
 * Get all spaces in the workspace (admin only)
 */
export async function getSpaces(): Promise<ClickUpSpace[]> {
    const config = getClickUpConfig()
    if (!config) throw new Error('ClickUp not configured')

    const response = await clickUpFetch<{ spaces: ClickUpSpace[] }>(`/team/${config.teamId}/space`)
    return response.spaces
}

/**
 * Get all folders (departments) in a space
 */
export async function getFolders(spaceId: string): Promise<ClickUpFolder[]> {
    const response = await clickUpFetch<{ folders: ClickUpFolder[] }>(`/space/${spaceId}/folder`)
    return response.folders
}

/**
 * Get all lists in a folder
 */
export async function getLists(folderId: string): Promise<ClickUpList[]> {
    const response = await clickUpFetch<{ lists: ClickUpList[] }>(`/folder/${folderId}/list`)
    return response.lists
}

/**
 * Get tasks from a list
 */
export async function getTasks(listId: string, params?: {
    archived?: boolean
    include_closed?: boolean
    subtasks?: boolean
    statuses?: string[]
    assignees?: string[]
    tags?: string[]
}): Promise<ClickUpTask[]> {
    const searchParams = new URLSearchParams()

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, v))
                } else {
                    searchParams.append(key, String(value))
                }
            }
        })
    }

    const queryString = searchParams.toString()
    const endpoint = `/list/${listId}/task${queryString ? `?${queryString}` : ''}`

    const response = await clickUpFetch<{ tasks: ClickUpTask[] }>(endpoint)
    return response.tasks
}

/**
 * Get ALL tasks for a client's Space (across all departments)
 */
export async function getSpaceTasks(spaceId: string): Promise<ClickUpTask[]> {
    const folders = await getFolders(spaceId)
    const allTasks: ClickUpTask[] = []

    for (const folder of folders) {
        const lists = await getLists(folder.id)

        for (const list of lists) {
            const tasks = await getTasks(list.id, { include_closed: true })

            // Add department info to each task
            tasks.forEach(task => {
                task._department = folder.name
            })

            allTasks.push(...tasks)
        }
    }

    return allTasks
}

/**
 * Get tasks for a specific department
 */
export async function getDepartmentTasks(spaceId: string, department: Department): Promise<ClickUpTask[]> {
    const folders = await getFolders(spaceId)
    const departmentFolder = folders.find(f => f.name.toUpperCase() === department)

    if (!departmentFolder) {
        return []
    }

    const lists = await getLists(departmentFolder.id)
    const tasks: ClickUpTask[] = []

    for (const list of lists) {
        const listTasks = await getTasks(list.id, { include_closed: true })
        listTasks.forEach(task => {
            task._department = department
        })
        tasks.push(...listTasks)
    }

    return tasks
}

// ===============================
// DASHBOARD DATA HELPERS
// ===============================

/**
 * Calculate project status from tasks
 */
export function calculateProjectStatus(tasks: ClickUpTask[]): {
    total: number
    completed: number
    inProgress: number
    blocked: number
    progress: number
} {
    const total = tasks.length
    const completed = tasks.filter(t =>
        t.status.type === 'closed' ||
        t.status.status.toLowerCase() === 'complete' ||
        t.status.status.toLowerCase() === 'done'
    ).length
    const blocked = tasks.filter(t =>
        t.tags.some(tag => tag.name.toLowerCase() === 'blocker') ||
        t.status.status.toLowerCase().includes('block')
    ).length
    const inProgress = tasks.filter(t =>
        t.status.status.toLowerCase().includes('progress') ||
        t.status.status.toLowerCase() === 'in progress'
    ).length

    return {
        total,
        completed,
        inProgress,
        blocked,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0
    }
}

/**
 * Get tasks marked as blockers
 */
export function getBlockers(tasks: ClickUpTask[]): ClickUpTask[] {
    return tasks.filter(task =>
        task.tags.some(tag => tag.name.toLowerCase() === 'blocker') ||
        task.status.status.toLowerCase().includes('block')
    )
}

/**
 * Get tasks marked as deliverables
 */
export function getDeliverables(tasks: ClickUpTask[]): ClickUpTask[] {
    return tasks.filter(task =>
        task.tags.some(tag => tag.name.toLowerCase() === 'deliverable') ||
        task.list.name.toLowerCase().includes('deliverable')
    )
}

/**
 * Get unique assignees from tasks
 */
export function getUniqueAssignees(tasks: ClickUpTask[]): ClickUpUser[] {
    const assigneeMap = new Map<number, ClickUpUser>()

    tasks.forEach(task => {
        task.assignees.forEach(assignee => {
            assigneeMap.set(assignee.id, assignee)
        })
    })

    return Array.from(assigneeMap.values())
}

/**
 * Group tasks by department
 */
export function groupByDepartment(tasks: ClickUpTask[]): Record<string, ClickUpTask[]> {
    const grouped: Record<string, ClickUpTask[]> = {}

    tasks.forEach(task => {
        const dept = task._department || 'OTHER'
        if (!grouped[dept]) {
            grouped[dept] = []
        }
        grouped[dept].push(task)
    })

    return grouped
}

/**
 * Get tasks due within next N days
 */
export function getUpcomingTasks(tasks: ClickUpTask[], daysAhead: number = 14): ClickUpTask[] {
    const now = Date.now()
    const futureDate = now + (daysAhead * 24 * 60 * 60 * 1000)

    return tasks
        .filter(task => {
            if (!task.due_date) return false
            const dueDate = parseInt(task.due_date)
            return dueDate >= now && dueDate <= futureDate
        })
        .sort((a, b) => parseInt(a.due_date || '0') - parseInt(b.due_date || '0'))
}

// ===============================
// CLIENT MAPPING
// ===============================

export interface ClientClickUpMapping {
    clientId: string
    clientEmail: string
    clickupSpaceId: string
    companyName?: string
    createdAt: Date
}

/**
 * Save client-ClickUp mapping (to be implemented with your database)
 */
export async function saveClientMapping(mapping: ClientClickUpMapping): Promise<void> {
    // TODO: Implement with Supabase or your database
    console.log('Saving client mapping:', mapping)

    // For now, store in localStorage
    localStorage.setItem('clickup_space_id', mapping.clickupSpaceId)
    localStorage.setItem('client_email', mapping.clientEmail)
}

/**
 * Get client's ClickUp Space ID (to be implemented with your database)
 */
export async function getClientSpaceId(clientEmail: string): Promise<string | null> {
    // TODO: Implement with Supabase or your database
    console.log('Getting space ID for:', clientEmail)

    // For now, read from localStorage
    return localStorage.getItem('clickup_space_id')
}

export default {
    getSpaces,
    getFolders,
    getLists,
    getTasks,
    getSpaceTasks,
    getDepartmentTasks,
    calculateProjectStatus,
    getBlockers,
    getDeliverables,
    getUniqueAssignees,
    groupByDepartment,
    getUpcomingTasks,
    saveClientMapping,
    getClientSpaceId,
    hasClickUpCredentials,
    setClientSpaceId,
    DEPARTMENTS,
}
