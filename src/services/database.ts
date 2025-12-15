import { supabase, hasSupabaseCredentials } from './supabase'
import { mockProjects, mockTasks, mockTeamMembers } from './mockData'
import type { Project, Task, TeamMember, Metric } from '@/types'

// ==========================================
// Projects
// ==========================================

export async function getProjects(): Promise<Project[]> {
    if (!hasSupabaseCredentials) {
        return mockProjects
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data as Project[]
}

export async function getProject(id: string): Promise<Project | null> {
    if (!hasSupabaseCredentials) {
        return mockProjects.find(p => p.id === id) || null
    }

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching project:', error)
        return null
    }

    return data as Project
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return null
    }

    const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()

    if (error) {
        console.error('Error creating project:', error)
        return null
    }

    return data as Project
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return null
    }

    const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating project:', error)
        return null
    }

    return data as Project
}

export async function deleteProject(id: string): Promise<boolean> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return false
    }

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting project:', error)
        return false
    }

    return true
}

// ==========================================
// Tasks
// ==========================================

export async function getTasks(projectId?: string): Promise<Task[]> {
    if (!hasSupabaseCredentials) {
        return projectId
            ? mockTasks.filter(t => t.project_id === projectId)
            : mockTasks
    }

    let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

    if (projectId) {
        query = query.eq('project_id', projectId)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching tasks:', error)
        return []
    }

    return data as Task[]
}

export async function getTask(id: string): Promise<Task | null> {
    if (!hasSupabaseCredentials) {
        return mockTasks.find(t => t.id === id) || null
    }

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching task:', error)
        return null
    }

    return data as Task
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return null
    }

    const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()

    if (error) {
        console.error('Error creating task:', error)
        return null
    }

    return data as Task
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return null
    }

    const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating task:', error)
        return null
    }

    return data as Task
}

export async function deleteTask(id: string): Promise<boolean> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return false
    }

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting task:', error)
        return false
    }

    return true
}

// ==========================================
// Team Members
// ==========================================

export async function getTeamMembers(): Promise<TeamMember[]> {
    if (!hasSupabaseCredentials) {
        return mockTeamMembers
    }

    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching team members:', error)
        return []
    }

    return data as TeamMember[]
}

export async function createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember | null> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return null
    }

    const { data, error } = await supabase
        .from('team_members')
        .insert(member)
        .select()
        .single()

    if (error) {
        console.error('Error creating team member:', error)
        return null
    }

    return data as TeamMember
}

export async function updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return null
    }

    const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating team member:', error)
        return null
    }

    return data as TeamMember
}

// ==========================================
// Metrics
// ==========================================

export async function getMetrics(projectId: string): Promise<Metric[]> {
    if (!hasSupabaseCredentials) {
        return []
    }

    const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('project_id', projectId)
        .order('recorded_at', { ascending: false })

    if (error) {
        console.error('Error fetching metrics:', error)
        return []
    }

    return data as Metric[]
}

export async function addMetric(metric: Omit<Metric, 'id' | 'created_at'>): Promise<Metric | null> {
    if (!hasSupabaseCredentials) {
        console.warn('Supabase not configured')
        return null
    }

    const { data, error } = await supabase
        .from('metrics')
        .insert(metric)
        .select()
        .single()

    if (error) {
        console.error('Error adding metric:', error)
        return null
    }

    return data as Metric
}

// ==========================================
// Real-time Subscriptions
// ==========================================

export function subscribeToTasks(projectId: string, callback: (tasks: Task[]) => void) {
    if (!hasSupabaseCredentials) {
        return { unsubscribe: () => { } }
    }

    const channel = supabase
        .channel(`tasks:${projectId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'tasks',
                filter: `project_id=eq.${projectId}`,
            },
            async () => {
                const tasks = await getTasks(projectId)
                callback(tasks)
            }
        )
        .subscribe()

    return {
        unsubscribe: () => {
            supabase.removeChannel(channel)
        }
    }
}

export function subscribeToProjects(callback: (projects: Project[]) => void) {
    if (!hasSupabaseCredentials) {
        return { unsubscribe: () => { } }
    }

    const channel = supabase
        .channel('projects')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'projects',
            },
            async () => {
                const projects = await getProjects()
                callback(projects)
            }
        )
        .subscribe()

    return {
        unsubscribe: () => {
            supabase.removeChannel(channel)
        }
    }
}
