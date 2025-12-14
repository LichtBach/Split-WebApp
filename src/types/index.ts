// ==========================================
// User & Authentication Types
// ==========================================

export interface User {
    id: string;
    email: string;
    agency_name: string;
    role: 'admin' | 'project_manager' | 'viewer';
    avatar_url?: string;
    timezone: string;
    notification_email: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    email: string;
    password: string;
    agency_name: string;
}

// ==========================================
// Project Types
// ==========================================

export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'archived';

export interface Project {
    id: string;
    agency_id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    clickup_folder_id?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    spent: number;
    assigned_members?: string[]; // Team member IDs
    created_at: string;
    updated_at: string;
    // Relations
    tasks?: Task[];
    metrics?: Metric[];
}

export interface ProjectActivity {
    id: string;
    project_id: string;
    user_id: string;
    user_name: string;
    action: 'created' | 'updated' | 'commented' | 'status_changed' | 'assigned' | 'completed';
    description: string;
    timestamp: string;
}

export interface ProjectWithStats extends Project {
    task_count: number;
    completed_tasks: number;
    progress_percentage: number;
}

// ==========================================
// Task Types
// ==========================================

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
    id: string;
    project_id: string;
    clickup_task_id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigned_to?: string;
    due_date?: string;
    time_tracked_minutes: number;
    created_at: string;
    updated_at: string;
    // For admin management
    client_visible?: boolean;
    client_id?: string;
}

// ==========================================
// Team Member Types
// ==========================================

export type TeamRole = 'owner' | 'project_manager' | 'developer' | 'designer' | 'qa' | 'support';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: TeamRole;
    title: string;
    avatar_url?: string;
    department?: string;
    phone?: string;
    skills: string[];
    projects: string[]; // project IDs
    status: 'active' | 'away' | 'offline';
    joined_at: string;
}

// ==========================================
// Client Types
// ==========================================

export interface Client {
    id: string;
    name: string;
    company: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    projects: string[]; // project IDs
    status: 'active' | 'inactive' | 'pending';
    notes?: string;
    created_at: string;
    updated_at: string;
}

// ==========================================
// Timeline Types
// ==========================================

export interface TimelineItem {
    id: string;
    task_id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date?: string;
    status: TaskStatus;
    assigned_to?: string;
    client_id?: string;
    color?: string;
}

// ==========================================
// Metric Types
// ==========================================

export type MetricType =
    | 'calls_made'
    | 'call_duration_mins'
    | 'qualified_leads'
    | 'conversions'
    | 'time_saved'
    | 'cost_per_call'
    | 'cost_per_lead';

export interface Metric {
    id: string;
    project_id: string;
    metric_type: MetricType;
    value: number;
    metadata?: Record<string, unknown>;
    recorded_at: string;
    created_at: string;
}

export interface MetricSummary {
    calls_made: number;
    call_duration_mins: number;
    qualified_leads: number;
    conversions: number;
    conversion_rate: number;
    time_saved: number;
}

export interface TrendData {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
}

// ==========================================
// Billing Types
// ==========================================

export type BillingStatus = 'pending' | 'sent' | 'paid';

export interface Billing {
    id: string;
    project_id: string;
    billing_month: string;
    calls_made: number;
    qualified_leads: number;
    conversions: number;
    minutes_called: number;
    cost_per_call?: number;
    cost_per_lead?: number;
    total_cost: number;
    status: BillingStatus;
    invoice_url?: string;
    created_at: string;
    updated_at: string;
}

export interface BillingSummary {
    current_month: Billing | null;
    total_spent: number;
    average_monthly: number;
    invoices: Billing[];
}

// ==========================================
// Chart Data Types
// ==========================================

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

export interface CallsChartData {
    date: string;
    calls: number;
    qualified: number;
    conversions: number;
}

export interface CostChartData {
    date: string;
    cost: number;
    calls: number;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    count: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ==========================================
// Webhook Types
// ==========================================

export interface WebhookLog {
    id: string;
    webhook_type: string;
    payload: Record<string, unknown>;
    status: 'success' | 'failed' | 'retrying';
    error_message?: string;
    retry_count: number;
    received_at: string;
}

// ==========================================
// UI State Types
// ==========================================

export interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    toasts: Toast[];
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    description?: string;
    duration?: number;
}
