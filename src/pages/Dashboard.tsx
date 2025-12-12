import { PhoneCall, Users, TrendingUp, Clock } from 'lucide-react'
import { MetricCard } from '@/components/metrics/MetricCard'
import { CallsChart } from '@/components/metrics/CallsChart'
import { TaskCalendar } from '@/components/calendar/TaskCalendar'
import { TeamOverview } from '@/components/team/TeamOverview'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import {
    mockMetricSummary,
    mockCallsChartData,
    mockTeamMembers,
} from '@/services/mockData'
import { TaskList } from '@/components/tasks/TaskList'

export function Dashboard() {
    const { user } = useAuthStore()
    const { tasks } = useTaskStore()
    const activeTeamMembers = mockTeamMembers.filter(m => m.status === 'active').slice(0, 5)

    // Get recent tasks from the store
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back{user?.agency_name ? `, ${user.agency_name}` : ''}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Here's what's happening with your AI receptionist today.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Calls"
                    value={mockMetricSummary.calls_made}
                    unit="calls"
                    icon={PhoneCall}
                    trend={{ value: 12.5, direction: 'up', percentage: 12.5 }}
                />
                <MetricCard
                    title="Qualified Leads"
                    value={mockMetricSummary.qualified_leads}
                    unit="leads"
                    icon={Users}
                    trend={{ value: 8.2, direction: 'up', percentage: 8.2 }}
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${mockMetricSummary.conversion_rate}%`}
                    icon={TrendingUp}
                    trend={{ value: 2.1, direction: 'up', percentage: 2.1 }}
                />
                <MetricCard
                    title="Time Saved"
                    value={mockMetricSummary.time_saved}
                    unit="hours"
                    icon={Clock}
                    trend={{ value: 15.3, direction: 'up', percentage: 15.3 }}
                />
            </div>

            {/* Interactive Calendar & Chart Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <TaskCalendar title="Task Calendar" showLegend={false} />
                <CallsChart data={mockCallsChartData} />
            </div>

            {/* Recent Tasks & Team */}
            <div className="grid gap-6 lg:grid-cols-2">
                <TaskList tasks={recentTasks} title="Recent Tasks" />
                <TeamOverview members={activeTeamMembers} title="Active Team" compact />
            </div>
        </div>
    )
}
