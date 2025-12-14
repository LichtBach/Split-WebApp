/**
 * Mock Data for Development
 * This provides realistic sample data for the dashboard while building the frontend.
 * Replace with real Supabase queries once credentials are configured.
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
// Mock User
// ==========================================

export const mockUser: User = {
    id: 'user-001',
    email: 'john@agency.com',
    agency_name: 'SplitAgency',
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
        description: 'AI receptionist for lead qualification and appointment scheduling. This project includes implementing an intelligent voice agent that handles incoming calls, qualifies leads based on predefined criteria, and schedules appointments directly into the client calendar system.',
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
    {
        id: 'proj-002',
        agency_id: 'user-001',
        name: 'MedClinic Appointments',
        description: 'Medical clinic appointment scheduling and patient intake automation. The AI handles patient inquiries, schedules appointments, and collects preliminary information before visits.',
        status: 'active',
        clickup_folder_id: 'ck-folder-002',
        start_date: '2024-11-15',
        budget: 18000,
        spent: 4200,
        assigned_members: ['tm-001', 'tm-003'],
        created_at: '2024-11-15T11:00:00Z',
        updated_at: '2024-12-09T10:15:00Z',
    },
    {
        id: 'proj-003',
        agency_id: 'user-001',
        name: 'RealEstate Leads',
        description: 'Real estate lead qualification and property inquiry handling. AI agent qualifies potential buyers and sellers, schedules property viewings.',
        status: 'on-hold',
        clickup_folder_id: 'ck-folder-003',
        start_date: '2024-09-01',
        budget: 15000,
        spent: 8900,
        assigned_members: ['tm-002'],
        created_at: '2024-09-01T08:00:00Z',
        updated_at: '2024-11-20T14:00:00Z',
    },
    {
        id: 'proj-004',
        agency_id: 'user-001',
        name: 'FinServ Consulting',
        description: 'Financial services consultation scheduling. Completed project with full voice agent implementation.',
        status: 'completed',
        clickup_folder_id: 'ck-folder-004',
        start_date: '2024-06-01',
        end_date: '2024-10-31',
        budget: 20000,
        spent: 19500,
        assigned_members: ['tm-001', 'tm-002', 'tm-003'],
        created_at: '2024-06-01T09:00:00Z',
        updated_at: '2024-10-31T17:00:00Z',
    },
]

// ==========================================
// Mock Tasks
// ==========================================

export const mockTasks: Task[] = [
    {
        id: 'task-001',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-001',
        title: 'Configure voice agent personality',
        description: 'Set up the AI voice agent with TechCorp brand voice and tone. This includes defining the greeting message, conversation flow, and handling of edge cases like unclear responses or callback requests.',
        status: 'done',
        priority: 'high',
        assigned_to: 'Sarah M.',
        due_date: '2025-12-08',
        time_tracked_minutes: 180,
        created_at: '2025-11-25T10:00:00Z',
        updated_at: '2025-12-08T15:30:00Z',
    },
    {
        id: 'task-002',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-002',
        title: 'Integrate CRM webhook',
        description: 'Set up n8n workflow to sync leads to Salesforce. The webhook should trigger on qualified lead, passing contact info, call transcript summary, and lead score.',
        status: 'in_progress',
        priority: 'high',
        assigned_to: 'Mike R.',
        due_date: '2025-12-15',
        time_tracked_minutes: 120,
        created_at: '2025-12-01T09:00:00Z',
        updated_at: '2025-12-12T11:00:00Z',
    },
    {
        id: 'task-003',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-003',
        title: 'A/B test greeting scripts',
        description: 'Test different opening scripts for call qualification. We will compare conversion rates between friendly/casual vs professional/formal approaches.',
        status: 'in_review',
        priority: 'medium',
        assigned_to: 'Lisa K.',
        due_date: '2025-12-18',
        time_tracked_minutes: 90,
        created_at: '2025-12-03T14:00:00Z',
        updated_at: '2025-12-12T09:00:00Z',
    },
    {
        id: 'task-004',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-004',
        title: 'Monthly performance report',
        description: 'Generate December performance metrics report. Include call volume, qualification rate, conversion rates, average call duration, and ROI analysis.',
        status: 'todo',
        priority: 'medium',
        assigned_to: 'John D.',
        due_date: '2025-12-31',
        time_tracked_minutes: 0,
        created_at: '2025-12-10T08:00:00Z',
        updated_at: '2025-12-10T08:00:00Z',
    },
    {
        id: 'task-005',
        project_id: 'proj-002',
        clickup_task_id: 'ck-task-005',
        title: 'HIPAA compliance review',
        description: 'Review voice agent scripts for HIPAA compliance. Ensure no PHI is stored in call logs and all data handling meets healthcare privacy requirements.',
        status: 'in_progress',
        priority: 'urgent',
        assigned_to: 'Sarah M.',
        due_date: '2025-12-13',
        time_tracked_minutes: 240,
        created_at: '2025-12-01T11:00:00Z',
        updated_at: '2025-12-12T16:00:00Z',
    },
    {
        id: 'task-006',
        project_id: 'proj-002',
        clickup_task_id: 'ck-task-006',
        title: 'Patient intake form integration',
        description: 'Connect voice agent to patient intake workflow. The agent should collect insurance info, symptoms, and preferred appointment times.',
        status: 'todo',
        priority: 'high',
        assigned_to: 'Mike R.',
        due_date: '2025-12-20',
        time_tracked_minutes: 0,
        created_at: '2025-12-05T10:00:00Z',
        updated_at: '2025-12-05T10:00:00Z',
    },
    {
        id: 'task-007',
        project_id: 'proj-001',
        clickup_task_id: 'ck-task-007',
        title: 'Update FAQ knowledge base',
        description: 'Add new FAQ entries based on common caller questions from the past week. Include pricing, service areas, and booking process.',
        status: 'todo',
        priority: 'low',
        assigned_to: 'Lisa K.',
        due_date: '2025-12-16',
        time_tracked_minutes: 0,
        created_at: '2025-12-11T09:00:00Z',
        updated_at: '2025-12-11T09:00:00Z',
    },
    {
        id: 'task-008',
        project_id: 'proj-002',
        clickup_task_id: 'ck-task-008',
        title: 'After-hours message setup',
        description: 'Configure voice agent behavior for after-hours calls. Should offer callback scheduling and emergency contact info.',
        status: 'in_progress',
        priority: 'medium',
        assigned_to: 'John D.',
        due_date: '2025-12-14',
        time_tracked_minutes: 45,
        created_at: '2025-12-09T11:00:00Z',
        updated_at: '2025-12-12T10:00:00Z',
    },
]

// ==========================================
// Mock Metrics
// ==========================================

export const mockMetrics: Metric[] = [
    // Today's metrics for proj-001
    { id: 'metric-001', project_id: 'proj-001', metric_type: 'calls_made', value: 156, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
    { id: 'metric-002', project_id: 'proj-001', metric_type: 'qualified_leads', value: 42, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
    { id: 'metric-003', project_id: 'proj-001', metric_type: 'conversions', value: 18, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
    { id: 'metric-004', project_id: 'proj-001', metric_type: 'call_duration_mins', value: 486, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
    // Today's metrics for proj-002
    { id: 'metric-005', project_id: 'proj-002', metric_type: 'calls_made', value: 89, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
    { id: 'metric-006', project_id: 'proj-002', metric_type: 'qualified_leads', value: 31, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
    { id: 'metric-007', project_id: 'proj-002', metric_type: 'conversions', value: 12, recorded_at: '2024-12-10T18:00:00Z', created_at: '2024-12-10T18:00:00Z' },
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
    {
        id: 'bill-002',
        project_id: 'proj-001',
        billing_month: '2024-11-01',
        calls_made: 3150,
        qualified_leads: 890,
        conversions: 356,
        minutes_called: 9450,
        cost_per_call: 0.85,
        cost_per_lead: 4.50,
        total_cost: 6682.50,
        status: 'paid',
        invoice_url: 'https://invoices.example.com/inv-001',
        created_at: '2024-11-01T00:00:00Z',
        updated_at: '2024-11-30T18:00:00Z',
    },
    {
        id: 'bill-003',
        project_id: 'proj-002',
        billing_month: '2024-12-01',
        calls_made: 1560,
        qualified_leads: 520,
        conversions: 195,
        minutes_called: 4680,
        cost_per_call: 0.75,
        cost_per_lead: 5.00,
        total_cost: 3770,
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
    time_saved: 220, // hours
}

export const mockCallsChartData: CallsChartData[] = [
    { date: '2024-12-04', calls: 245, qualified: 68, conversions: 25 },
    { date: '2024-12-05', calls: 312, qualified: 89, conversions: 34 },
    { date: '2024-12-06', calls: 289, qualified: 82, conversions: 31 },
    { date: '2024-12-07', calls: 198, qualified: 52, conversions: 18 },
    { date: '2024-12-08', calls: 175, qualified: 45, conversions: 15 },
    { date: '2024-12-09', calls: 356, qualified: 98, conversions: 42 },
    { date: '2024-12-10', calls: 245, qualified: 73, conversions: 30 },
]

export const mockCostChartData: CostChartData[] = [
    { date: '2024-12-04', cost: 892.50, calls: 245 },
    { date: '2024-12-05', cost: 1134.40, calls: 312 },
    { date: '2024-12-06', cost: 1050.87, calls: 289 },
    { date: '2024-12-07', cost: 719.74, calls: 198 },
    { date: '2024-12-08', cost: 636.25, calls: 175 },
    { date: '2024-12-09', cost: 1293.80, calls: 356 },
    { date: '2024-12-10', cost: 890.75, calls: 245 },
]

// ==========================================
// Helper Functions
// ==========================================

export function getProjectTasks(projectId: string): Task[] {
    return mockTasks.filter(task => task.project_id === projectId)
}

export function getProjectMetrics(projectId: string): Metric[] {
    return mockMetrics.filter(metric => metric.project_id === projectId)
}

export function getProjectBilling(projectId: string): Billing[] {
    return mockBilling.filter(bill => bill.project_id === projectId)
}

export function getRecentTasks(limit: number = 5): Task[] {
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

// ==========================================
// Mock Team Members
// ==========================================

export const mockTeamMembers: TeamMember[] = [
    {
        id: 'team-001',
        name: 'Sarah Mitchell',
        email: 'sarah@splitagency.com',
        role: 'owner',
        title: 'Agency Owner & Lead Strategist',
        department: 'Leadership',
        phone: '+1 (555) 123-4567',
        skills: ['Strategy', 'Client Relations', 'Voice AI', 'Project Management'],
        projects: ['proj-001', 'proj-002', 'proj-003'],
        status: 'active',
        joined_at: '2023-01-15T00:00:00Z',
    },
    {
        id: 'team-002',
        name: 'Mike Rodriguez',
        email: 'mike@splitagency.com',
        role: 'developer',
        title: 'Senior Integration Developer',
        department: 'Engineering',
        phone: '+1 (555) 234-5678',
        skills: ['n8n', 'API Integration', 'Webhooks', 'Node.js', 'Python'],
        projects: ['proj-001', 'proj-002'],
        status: 'active',
        joined_at: '2023-03-20T00:00:00Z',
    },
    {
        id: 'team-003',
        name: 'Lisa Kim',
        email: 'lisa@splitagency.com',
        role: 'project_manager',
        title: 'Project Manager',
        department: 'Operations',
        phone: '+1 (555) 345-6789',
        skills: ['Project Management', 'Client Communication', 'Agile', 'Documentation'],
        projects: ['proj-001', 'proj-003'],
        status: 'active',
        joined_at: '2023-06-10T00:00:00Z',
    },
    {
        id: 'team-004',
        name: 'John Davis',
        email: 'john@splitagency.com',
        role: 'qa',
        title: 'QA & Voice Testing Specialist',
        department: 'Quality Assurance',
        phone: '+1 (555) 456-7890',
        skills: ['Quality Assurance', 'Voice Testing', 'HIPAA Compliance', 'Analytics'],
        projects: ['proj-002', 'proj-004'],
        status: 'away',
        joined_at: '2023-09-05T00:00:00Z',
    },
    {
        id: 'team-005',
        name: 'Emily Chen',
        email: 'emily@splitagency.com',
        role: 'support',
        title: 'Customer Success Manager',
        department: 'Customer Success',
        phone: '+1 (555) 567-8901',
        skills: ['Customer Support', 'Onboarding', 'Training', 'Troubleshooting'],
        projects: ['proj-001', 'proj-002', 'proj-003', 'proj-004'],
        status: 'active',
        joined_at: '2024-01-15T00:00:00Z',
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
    {
        id: 'client-002',
        name: 'Dr. Maria Santos',
        company: 'MedClinic Partners',
        email: 'maria@medclinic.com',
        phone: '+1 (555) 222-3333',
        projects: ['proj-002'],
        status: 'active',
        notes: 'Healthcare client - requires HIPAA compliance for all communications',
        created_at: '2024-11-15T00:00:00Z',
        updated_at: '2025-12-12T00:00:00Z',
    },
    {
        id: 'client-003',
        name: 'James Wilson',
        company: 'RealEstate Pro',
        email: 'james@realestatepro.com',
        phone: '+1 (555) 333-4444',
        projects: ['proj-003'],
        status: 'inactive',
        notes: 'Project on hold - awaiting budget approval for Q1 2026',
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2025-11-20T00:00:00Z',
    },
    {
        id: 'client-004',
        name: 'Rachel Green',
        company: 'FinServ Consulting',
        email: 'rachel@finserv.com',
        phone: '+1 (555) 444-5555',
        projects: ['proj-004'],
        status: 'active',
        notes: 'Project completed successfully, potential for referrals',
        created_at: '2024-06-01T00:00:00Z',
        updated_at: '2025-10-31T00:00:00Z',
    },
]

// ==========================================
// Helper Functions for Team & Clients
// ==========================================

export function getTeamMembersByProject(projectId: string): TeamMember[] {
    return mockTeamMembers.filter(member => member.projects.includes(projectId))
}

export function getClientByProject(projectId: string): Client | undefined {
    return mockClients.find(client => client.projects.includes(projectId))
}

export function getTeamMemberById(memberId: string): TeamMember | undefined {
    return mockTeamMembers.find(member => member.id === memberId)
}

export function getClientById(clientId: string): Client | undefined {
    return mockClients.find(client => client.id === clientId)
}
