/**
 * Mock Data for Development - Organized by Department/Vertical
 * 
 * Departments match ClickUp folder structure:
 * - DATA (Analytics, GTM, GA4)
 * - PMK (Paid Marketing / Performance Marketing)
 * - SEO (Search Engine Optimization)
 * - DMK (Digital Marketing)
 * - SM (Social Media)
 * - CONTENT (Content Marketing)
 */

import type {
    Project,
    Task,
    Metric,
    Billing,
    User,
    CallsChartData,
    CostChartData,
    MetricSummary,
    TeamMember,
    Client
} from '@/types'

// ==========================================
// Department Types
// ==========================================

export type Department = 'DATA' | 'PMK' | 'SEO' | 'DMK' | 'SM' | 'CONTENT'

export const departmentConfig: Record<Department, { name: string; color: string; icon: string }> = {
    DATA: { name: 'Data & Analytics', color: '#dd3333', icon: '📊' },
    PMK: { name: 'Performance Marketing', color: '#3b82f6', icon: '🎯' },
    SEO: { name: 'SEO', color: '#22c55e', icon: '🔍' },
    DMK: { name: 'Digital Marketing', color: '#a855f7', icon: '📱' },
    SM: { name: 'Social Media', color: '#f97316', icon: '📣' },
    CONTENT: { name: 'Content', color: '#ec4899', icon: '✍️' },
}

// ==========================================
// Mock User
// ==========================================

export const mockUser: User = {
    id: 'user-001',
    email: 'john@agency.com',
    agency_name: 'demoAgency',
    role: 'admin',
    avatar_url: undefined,
    timezone: 'America/New_York',
    notification_email: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-10T14:30:00Z',
}

// ==========================================
// Mock Projects
// ==========================================

export const mockProjects: Project[] = [
    {
        id: 'proj-001',
        agency_id: 'user-001',
        name: 'TechCorp AI Reception',
        description: 'AI receptionist for lead qualification and appointment scheduling.',
        status: 'active',
        clickup_folder_id: 'ck-folder-001',
        start_date: '2024-10-01',
        end_date: '2025-03-31',
        budget: 25000,
        spent: 12450,
        assigned_members: ['tm-001', 'tm-002'],
        created_at: '2024-10-01T09:00:00Z',
        updated_at: '2024-12-10T16:00:00Z',
    },
]

// ==========================================
// Mock Tasks - Organized by Department
// ==========================================

export interface DepartmentTask extends Task {
    department: Department
}

export const mockTasks: DepartmentTask[] = [
    // DATA Department Tasks
    {
        id: 'task-001',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-001',
        title: 'GA4 Property Setup & Configuration',
        description: 'Set up GA4 property with enhanced e-commerce tracking, custom events, and conversion goals.',
        status: 'done',
        priority: 'high',
        assigned_to: 'Sarah Chen',
        due_date: '2026-01-08',
        time_tracked_minutes: 180,
        created_at: '2025-12-25T10:00:00Z',
        updated_at: '2026-01-08T15:30:00Z',
        department: 'DATA',
    },
    {
        id: 'task-002',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-002',
        title: 'GTM Container Implementation',
        description: 'Configure GTM container with all tracking tags, triggers, and variables for e-commerce.',
        status: 'in_progress',
        priority: 'high',
        assigned_to: 'Mike Johnson',
        due_date: '2026-02-05',
        time_tracked_minutes: 120,
        created_at: '2026-01-01T09:00:00Z',
        updated_at: '2026-01-22T11:00:00Z',
        department: 'DATA',
    },
    {
        id: 'task-003',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-003',
        title: 'Looker Studio Dashboard Build',
        description: 'Create executive dashboard with KPIs, attribution, and e-commerce metrics.',
        status: 'todo',
        priority: 'medium',
        assigned_to: 'Emma Wilson',
        due_date: '2026-02-20',
        time_tracked_minutes: 0,
        created_at: '2026-01-15T14:00:00Z',
        updated_at: '2026-01-15T14:00:00Z',
        department: 'DATA',
    },
    // PMK Department Tasks
    {
        id: 'task-004',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-004',
        title: 'Google Ads Conversion Tracking Setup',
        description: 'Configure enhanced conversions, offline conversion imports, and GCLID tracking.',
        status: 'in_progress',
        priority: 'high',
        assigned_to: 'David Brown',
        due_date: '2026-01-28',
        time_tracked_minutes: 90,
        created_at: '2026-01-10T08:00:00Z',
        updated_at: '2026-01-22T08:00:00Z',
        department: 'PMK',
    },
    {
        id: 'task-005',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-005',
        title: 'Meta Pixel & CAPI Implementation',
        description: 'Set up Meta Pixel with Conversions API for server-side tracking.',
        status: 'todo',
        priority: 'high',
        assigned_to: 'Jessica Lee',
        due_date: '2026-02-01',
        time_tracked_minutes: 0,
        created_at: '2026-01-18T11:00:00Z',
        updated_at: '2026-01-18T11:00:00Z',
        department: 'PMK',
    },
    {
        id: 'task-006',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-006',
        title: 'Campaign Performance Audit',
        description: 'Audit current paid campaigns and provide optimization recommendations.',
        status: 'in_review',
        priority: 'medium',
        assigned_to: 'David Brown',
        due_date: '2026-01-25',
        time_tracked_minutes: 240,
        created_at: '2026-01-05T10:00:00Z',
        updated_at: '2026-01-22T10:00:00Z',
        department: 'PMK',
    },
    // SEO Department Tasks
    {
        id: 'task-007',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-007',
        title: 'Technical SEO Audit',
        description: 'Complete technical audit including Core Web Vitals, crawlability, and indexation issues.',
        status: 'done',
        priority: 'high',
        assigned_to: 'Anna Martinez',
        due_date: '2026-01-15',
        time_tracked_minutes: 360,
        created_at: '2025-12-20T09:00:00Z',
        updated_at: '2026-01-14T17:00:00Z',
        department: 'SEO',
    },
    {
        id: 'task-008',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-008',
        title: 'Keyword Research & Strategy',
        description: 'Comprehensive keyword research for target market with content gap analysis.',
        status: 'in_progress',
        priority: 'medium',
        assigned_to: 'Chris Taylor',
        due_date: '2026-02-10',
        time_tracked_minutes: 180,
        created_at: '2026-01-08T10:00:00Z',
        updated_at: '2026-01-22T10:00:00Z',
        department: 'SEO',
    },
    // SM Department Tasks  
    {
        id: 'task-009',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-009',
        title: 'Social Media Audit & Strategy',
        description: 'Audit current social presence and develop content strategy for Q1.',
        status: 'todo',
        priority: 'medium',
        assigned_to: 'Olivia Garcia',
        due_date: '2026-02-05',
        time_tracked_minutes: 0,
        created_at: '2026-01-20T09:00:00Z',
        updated_at: '2026-01-20T09:00:00Z',
        department: 'SM',
    },
    // CONTENT Department Tasks
    {
        id: 'task-010',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-010',
        title: 'Content Calendar Creation',
        description: 'Develop Q1 content calendar with blog posts, case studies, and guides.',
        status: 'in_progress',
        priority: 'medium',
        assigned_to: 'Rachel Kim',
        due_date: '2026-01-30',
        time_tracked_minutes: 120,
        created_at: '2026-01-12T10:00:00Z',
        updated_at: '2026-01-22T10:00:00Z',
        department: 'CONTENT',
    },
    {
        id: 'task-011',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-011',
        title: 'Product Description Optimization',
        description: 'Rewrite top 50 product descriptions for SEO and conversion optimization.',
        status: 'todo',
        priority: 'low',
        assigned_to: 'Rachel Kim',
        due_date: '2026-02-15',
        time_tracked_minutes: 0,
        created_at: '2026-01-18T10:00:00Z',
        updated_at: '2026-01-18T10:00:00Z',
        department: 'CONTENT',
    },
]

// ==========================================
// Mock Metrics
// ==========================================

export const mockMetrics: Metric[] = [
    { id: 'metric-001', project_id: 'proj-001', metric_type: 'calls_made', value: 156, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
]

// ==========================================
// Mock Billing
// ==========================================

export const mockBilling: Billing[] = [
    {
        id: 'bill-001',
        project_id: 'proj-001',
        billing_month: '2024-12-01',
        calls_made: 2840,
        qualified_leads: 782,
        conversions: 312,
        minutes_called: 8520,
        cost_per_call: 0.85,
        cost_per_lead: 4.50,
        total_cost: 5935,
        status: 'pending',
        created_at: '2024-12-01T00:00:00Z',
        updated_at: '2024-12-10T18:00:00Z',
    },
]

// ==========================================
// Aggregated Data
// ==========================================

export const mockMetricSummary: MetricSummary = {
    calls_made: 4645,
    call_duration_mins: 13200,
    qualified_leads: 1302,
    conversions: 507,
    conversion_rate: 38.9,
    time_saved: 220,
}

export const mockCallsChartData: CallsChartData[] = [
    { date: '2024-12-04', calls: 245, qualified: 68, conversions: 25 },
]

export const mockCostChartData: CostChartData[] = [
    { date: '2024-12-04', cost: 892.50, calls: 245 },
]

// ==========================================
// Mock Team Members - Organized by Department
// ==========================================

export interface DepartmentTeamMember extends TeamMember {
    department: Department
}

export const mockTeamMembers: DepartmentTeamMember[] = [
    // DATA Team
    {
        id: 'team-001',
        name: 'Alex Rivera',
        email: 'alex@datarevolt.agency',
        role: 'owner',
        title: 'Data Analytics Lead',
        department: 'DATA',
        phone: '+1 (555) 123-4567',
        skills: ['GA4', 'GTM', 'BigQuery', 'Looker Studio', 'Python'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-01-15T00:00:00Z',
    },
    {
        id: 'team-002',
        name: 'Sarah Chen',
        email: 'sarah@datarevolt.agency',
        role: 'developer',
        title: 'GTM Specialist',
        department: 'DATA',
        phone: '+1 (555) 234-5678',
        skills: ['GTM', 'JavaScript', 'GA4', 'Tag Implementation'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-03-20T00:00:00Z',
    },
    {
        id: 'team-003',
        name: 'Mike Johnson',
        email: 'mike@datarevolt.agency',
        role: 'developer',
        title: 'Senior Data Engineer',
        department: 'DATA',
        skills: ['BigQuery', 'Python', 'SQL', 'Data Pipelines'],
        projects: ['proj-001'],
        status: 'busy',
        joined_at: '2023-06-10T00:00:00Z',
    },
    {
        id: 'team-004',
        name: 'Emma Wilson',
        email: 'emma@datarevolt.agency',
        role: 'developer',
        title: 'BI Analyst',
        department: 'DATA',
        skills: ['Looker Studio', 'Power BI', 'SQL', 'Data Visualization'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2024-01-15T00:00:00Z',
    },
    // PMK Team
    {
        id: 'team-005',
        name: 'David Brown',
        email: 'david@datarevolt.agency',
        role: 'project_manager',
        title: 'Performance Marketing Lead',
        department: 'PMK',
        phone: '+1 (555) 345-6789',
        skills: ['Google Ads', 'Meta Ads', 'Campaign Strategy', 'Attribution'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-02-01T00:00:00Z',
    },
    {
        id: 'team-006',
        name: 'Jessica Lee',
        email: 'jessica@datarevolt.agency',
        role: 'developer',
        title: 'Paid Social Specialist',
        department: 'PMK',
        skills: ['Meta Ads', 'TikTok Ads', 'LinkedIn Ads', 'Creative Strategy'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-08-15T00:00:00Z',
    },
    // SEO Team
    {
        id: 'team-007',
        name: 'Anna Martinez',
        email: 'anna@datarevolt.agency',
        role: 'project_manager',
        title: 'SEO Lead',
        department: 'SEO',
        phone: '+1 (555) 456-7890',
        skills: ['Technical SEO', 'Link Building', 'Content Strategy', 'Analytics'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-04-01T00:00:00Z',
    },
    {
        id: 'team-008',
        name: 'Chris Taylor',
        email: 'chris@datarevolt.agency',
        role: 'developer',
        title: 'SEO Specialist',
        department: 'SEO',
        skills: ['Keyword Research', 'On-Page SEO', 'Ahrefs', 'Screaming Frog'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-09-01T00:00:00Z',
    },
    // SM Team
    {
        id: 'team-009',
        name: 'Olivia Garcia',
        email: 'olivia@datarevolt.agency',
        role: 'developer',
        title: 'Social Media Manager',
        department: 'SM',
        phone: '+1 (555) 567-8901',
        skills: ['Content Creation', 'Community Management', 'Social Strategy'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-07-01T00:00:00Z',
    },
    // CONTENT Team
    {
        id: 'team-010',
        name: 'Rachel Kim',
        email: 'rachel@datarevolt.agency',
        role: 'developer',
        title: 'Content Strategist',
        department: 'CONTENT',
        phone: '+1 (555) 678-9012',
        skills: ['Copywriting', 'SEO Content', 'Content Strategy', 'Editing'],
        projects: ['proj-001'],
        status: 'active',
        joined_at: '2023-05-15T00:00:00Z',
    },
]

// ==========================================
// Mock Clients
// ==========================================

export const mockClients: Client[] = [
    {
        id: 'client-001',
        name: 'Alex Thompson',
        company: 'TechCorp Solutions',
        email: 'alex@techcorp.com',
        phone: '+1 (555) 111-2222',
        projects: ['proj-001'],
        status: 'active',
        notes: 'VIP client, prefers weekly check-ins on Tuesdays',
        created_at: '2024-10-01T00:00:00Z',
        updated_at: '2025-12-10T00:00:00Z',
    },
]

// ==========================================
// Helper Functions
// ==========================================

export function getProjectTasks(projectId: string): DepartmentTask[] {
    return mockTasks.filter(task => task.project_id === projectId)
}

export function getTasksByDepartment(department: Department): DepartmentTask[] {
    return mockTasks.filter(task => task.department === department)
}

export function getTeamMembersByDepartment(department: Department): DepartmentTeamMember[] {
    return mockTeamMembers.filter(member => member.department === department)
}

export function getProjectMetrics(projectId: string): Metric[] {
    return mockMetrics.filter(metric => metric.project_id === projectId)
}

export function getProjectBilling(projectId: string): Billing[] {
    return mockBilling.filter(bill => bill.project_id === projectId)
}

export function getRecentTasks(limit: number = 5): DepartmentTask[] {
    return [...mockTasks]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, limit)
}

export function getProjectWithStats(projectId: string) {
    const project = mockProjects.find(p => p.id === projectId)
    if (!project) return null

    const tasks = getProjectTasks(projectId)
    const completedTasks = tasks.filter(t => t.status === 'done').length

    return {
        ...project,
        task_count: tasks.length,
        completed_tasks: completedTasks,
        progress_percentage: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
    }
}

export function getTeamMembersByProject(projectId: string): DepartmentTeamMember[] {
    return mockTeamMembers.filter(member => member.projects.includes(projectId))
}

export function getClientByProject(projectId: string): Client | undefined {
    return mockClients.find(client => client.projects.includes(projectId))
}

export function getTeamMemberById(memberId: string): DepartmentTeamMember | undefined {
    return mockTeamMembers.find(member => member.id === memberId)
}

export function getClientById(clientId: string): Client | undefined {
    return mockClients.find(client => client.id === clientId)
}
