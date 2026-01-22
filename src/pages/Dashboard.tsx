import { useState } from 'react'
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    TrendingUp,
    Mail,
} from 'lucide-react'
import { MetricCard } from '@/components/metrics/MetricCard'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// New components for client success dashboard
import { ProjectStatusCard, type ProjectStatus } from '@/components/projects/ProjectStatusCard'
import { BlockersList, type Blocker } from '@/components/projects/BlockersList'
import { AgencyTeam, type TeamMember } from '@/components/projects/AgencyTeam'
import { DeliverablesList, type Deliverable } from '@/components/projects/DeliverablesList'
import { InvoicesList, type Invoice } from '@/components/billing/InvoicesList'

// Mock data for demonstration - will be replaced with ClickUp API data
const mockProject: ProjectStatus = {
    id: '1',
    name: 'Full GTM & GA4 Setup',
    phase: 'Implementation Phase',
    progress: 45,
    totalTasks: 32,
    completedTasks: 14,
    inProgressTasks: 8,
    blockedTasks: 1,
    dueDate: 'Feb 28, 2026',
    health: 'on_track',
}

const mockBlockers: Blocker[] = [
    {
        id: '1',
        title: 'Awaiting e-commerce datalayer specification',
        description: 'Need confirmation on custom product dimensions and checkout step naming convention',
        priority: 'high',
        assignee: { name: 'Sarah Chen' },
        createdAt: '2026-01-20',
        daysPending: 2,
        projectName: 'GTM & GA4 Setup',
        clickupUrl: 'https://app.clickup.com/task/123',
    },
]

const mockTeam: TeamMember[] = [
    {
        id: '1',
        name: 'Alex Rivera',
        role: 'Data Analytics Lead',
        email: 'alex@datarevolt.agency',
        phone: '+1 555-0101',
        isLead: true,
        status: 'active',
    },
    {
        id: '2',
        name: 'Sarah Chen',
        role: 'GTM Specialist',
        email: 'sarah@datarevolt.agency',
        phone: '+1 555-0102',
        status: 'active',
    },
    {
        id: '3',
        name: 'Mike Johnson',
        role: 'Senior Data Engineer',
        email: 'mike@datarevolt.agency',
        status: 'busy',
    },
    {
        id: '4',
        name: 'Emma Wilson',
        role: 'BI Analyst',
        email: 'emma@datarevolt.agency',
        status: 'active',
    },
]

const mockDeliverables: Deliverable[] = [
    {
        id: '1',
        name: 'GA4 Audit Report',
        description: 'Comprehensive audit of current analytics implementation with recommendations',
        type: 'document',
        status: 'delivered',
        dueDate: 'Jan 15, 2026',
        deliveredDate: 'Jan 14, 2026',
        fileUrl: '#',
        previewUrl: '#',
    },
    {
        id: '2',
        name: 'GTM Container Export',
        description: 'Production-ready GTM container with all tracking tags and triggers',
        type: 'code',
        status: 'in_review',
        dueDate: 'Feb 5, 2026',
    },
    {
        id: '3',
        name: 'Looker Studio Dashboard',
        description: 'Executive KPI dashboard with e-commerce metrics and marketing attribution',
        type: 'design',
        status: 'pending',
        dueDate: 'Feb 20, 2026',
    },
    {
        id: '4',
        name: 'Revenue Lost Due to Out of Stock Analysis',
        description: 'Data analysis identifying revenue impact from out-of-stock products',
        type: 'document',
        status: 'pending',
        dueDate: 'Feb 25, 2026',
    },
]

const mockInvoices: Invoice[] = [
    {
        id: '1',
        invoiceNumber: 'INV-2026-001',
        description: 'Project Kickoff - 30% Deposit',
        amount: 3600,
        currency: 'USD',
        status: 'paid',
        issueDate: 'Jan 5, 2026',
        dueDate: 'Jan 12, 2026',
        paidDate: 'Jan 8, 2026',
        downloadUrl: '#',
    },
    {
        id: '2',
        invoiceNumber: 'INV-2026-002',
        description: 'GTM Implementation Milestone',
        amount: 2400,
        currency: 'USD',
        status: 'sent',
        issueDate: 'Jan 22, 2026',
        dueDate: 'Feb 5, 2026',
        paymentUrl: '#',
        downloadUrl: '#',
    },
]

// Day-by-day roadmap data
interface RoadmapTask {
    id: string
    title: string
    icon: string
    category: 'discovery' | 'implementation' | 'testing' | 'delivery'
    startDate: Date
    endDate: Date
}

const categoryColors = {
    discovery: 'from-[#dd3333] to-[#b52828]',
    implementation: 'from-[#dd3333]/80 to-[#b52828]/80',
    testing: 'from-slate-600 to-slate-700',
    delivery: 'from-emerald-500 to-emerald-600',
}

const categoryLabels = {
    discovery: 'Discovery & Audit',
    implementation: 'Implementation',
    testing: 'Testing & QA',
    delivery: 'Delivery',
}

// Generate dates for the roadmap (next 14 days)
const today = new Date()
const startDate = new Date(today)
startDate.setDate(today.getDate() - today.getDay() + 1) // Start from Monday

const mockRoadmapTasks: RoadmapTask[] = [
    { id: '1', title: 'Current State Audit', icon: '🔍', category: 'discovery', startDate: new Date(startDate), endDate: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000) },
    { id: '2', title: 'Tracking Plan Review', icon: '📋', category: 'discovery', startDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000) },
    { id: '3', title: 'GTM Container Setup', icon: '🏗️', category: 'implementation', startDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000) },
    { id: '4', title: 'GA4 Configuration', icon: '⚙️', category: 'implementation', startDate: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000) },
    { id: '5', title: 'E-commerce Tracking', icon: '🛒', category: 'implementation', startDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 9 * 24 * 60 * 60 * 1000) },
    { id: '6', title: 'Marketing Pixels', icon: '📊', category: 'implementation', startDate: new Date(startDate.getTime() + 8 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000) },
    { id: '7', title: 'Data Validation', icon: '✅', category: 'testing', startDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 11 * 24 * 60 * 60 * 1000) },
    { id: '8', title: 'Looker Studio Build', icon: '📈', category: 'implementation', startDate: new Date(startDate.getTime() + 11 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 13 * 24 * 60 * 60 * 1000) },
    { id: '9', title: 'Final Handover', icon: '🚀', category: 'delivery', startDate: new Date(startDate.getTime() + 13 * 24 * 60 * 60 * 1000), endDate: new Date(startDate.getTime() + 13 * 24 * 60 * 60 * 1000) },
]

// Generate 14 days for the roadmap
const roadmapDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    return date
})



function DayRoadmap({ tasks, days }: { tasks: RoadmapTask[], days: Date[] }) {
    const getTaskPosition = (task: RoadmapTask) => {
        const startIdx = days.findIndex(d => d.toDateString() === task.startDate.toDateString())
        const endIdx = days.findIndex(d => d.toDateString() === task.endDate.toDateString())
        if (startIdx === -1) return null
        return {
            start: startIdx,
            span: Math.max(1, (endIdx === -1 ? startIdx : endIdx) - startIdx + 1)
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <span>Project Roadmap</span>
                    <div className="flex gap-4">
                        {Object.entries(categoryLabels).map(([key, label]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded", `bg-gradient-to-r ${categoryColors[key as keyof typeof categoryColors]}`)} />
                                <span className="text-xs text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="text-left p-3 font-semibold min-w-[200px] w-[200px] border-r border-white/20 sticky left-0 bg-black z-10">
                                    Task
                                </th>
                                {days.map((day, i) => (
                                    <th
                                        key={i}
                                        className={cn(
                                            "text-center p-2 font-medium min-w-[70px] border-r last:border-r-0 border-white/20",
                                            day.getDay() === 0 || day.getDay() === 6 ? "bg-gray-800" : ""
                                        )}
                                    >
                                        <div className="text-xs">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                        <div className="text-sm font-bold">{day.getDate()}</div>
                                        <div className="text-xs opacity-70">{day.toLocaleDateString('en-US', { month: 'short' })}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, idx) => {
                                const pos = getTaskPosition(task)
                                return (
                                    <tr
                                        key={task.id}
                                        className={cn(
                                            "border-b border-border/50 hover:bg-accent/30 transition-colors",
                                            idx % 2 === 0 ? "bg-background" : "bg-muted/30"
                                        )}
                                    >
                                        <td className="p-3 font-medium border-r border-border/30 sticky left-0 z-10 bg-inherit">
                                            <div className="flex items-center gap-2 bg-inherit">
                                                <span className="text-lg">{task.icon}</span>
                                                <span className="text-sm">{task.title}</span>
                                            </div>
                                        </td>
                                        {days.map((day, dayIdx) => {
                                            const isWeekend = day.getDay() === 0 || day.getDay() === 6
                                            const isStart = pos && dayIdx === pos.start

                                            return (
                                                <td
                                                    key={dayIdx}
                                                    className={cn(
                                                        "p-1 relative border-r last:border-r-0 border-border/30",
                                                        isWeekend && "bg-muted/50"
                                                    )}
                                                >
                                                    {isStart && (
                                                        <div
                                                            className={cn(
                                                                "absolute top-1/2 -translate-y-1/2 left-1 right-0 h-7 rounded-md bg-gradient-to-r text-white text-xs font-medium flex items-center justify-center shadow-sm",
                                                                categoryColors[task.category]
                                                            )}
                                                            style={{
                                                                width: `calc(${pos.span * 100}% - 8px)`,
                                                                minWidth: '60px'
                                                            }}
                                                        >
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

export function Dashboard() {
    const { user } = useAuthStore()
    const [activeProject] = useState<ProjectStatus>(mockProject)

    const handleContactTeam = () => {
        window.location.href = 'mailto:team@datarevolt.agency?subject=Project%20Question'
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header with Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back{user?.agency_name ? `, ${user.agency_name}` : ''}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Here's your project overview and latest updates.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleContactTeam}
                        className="gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        Email Team
                    </Button>
                </div>
            </div>

            {/* Key Metrics Grid - No percentage comparisons */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Project Progress"
                    value={`${activeProject.progress}%`}
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Tasks Completed"
                    value={activeProject.completedTasks}
                    unit={`of ${activeProject.totalTasks}`}
                    icon={CheckCircle2}
                />
                <MetricCard
                    title="In Progress"
                    value={activeProject.inProgressTasks}
                    unit="tasks"
                    icon={Clock}
                />
                <MetricCard
                    title="Blockers"
                    value={activeProject.blockedTasks}
                    unit="issues"
                    icon={AlertTriangle}
                />
            </div>

            {/* Project Status Card */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ProjectStatusCard project={activeProject} />
                </div>
                <div>
                    <AgencyTeam
                        members={mockTeam}
                        title="Your DRA Team"
                        compact
                    />
                </div>
            </div>

            {/* Day-by-Day Roadmap */}
            <DayRoadmap tasks={mockRoadmapTasks} days={roadmapDays} />

            {/* Blockers & Deliverables Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <BlockersList
                    blockers={mockBlockers}
                    title="Active Blockers"
                />
                <DeliverablesList
                    deliverables={mockDeliverables}
                    title="Project Deliverables"
                    compact
                />
            </div>

            {/* Invoices */}
            <InvoicesList
                invoices={mockInvoices}
                title="Billing & Invoices"
            />
        </div>
    )
}
