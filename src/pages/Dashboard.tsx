import { useState, useEffect } from 'react'
import { PhoneCall, Users, TrendingUp, Clock } from 'lucide-react'
import { MetricCard } from '@/components/metrics/MetricCard'
import { GanttChart, GanttTask } from '@/components/charts/GanttChart'
import { CallsChart } from '@/components/metrics/CallsChart'
import { TaskCalendar } from '@/components/calendar/TaskCalendar'
import { TeamOverview } from '@/components/team/TeamOverview'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { hasSupabaseCredentials } from '@/services/supabase'
import * as db from '@/services/database'
import {
    mockMetricSummary,
    mockCallsChartData,
    mockTeamMembers,
} from '@/services/mockData'
import { TaskList } from '@/components/tasks/TaskList'
import type { CallsChartData, MetricSummary, TeamMember } from '@/types'

export function Dashboard() {
    const { user } = useAuthStore()
    const { tasks } = useTaskStore()

    // State for database-loaded data
    const [metrics] = useState<MetricSummary>(mockMetricSummary)
    const [chartData] = useState<CallsChartData[]>(mockCallsChartData)
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)

    // Load data from database
    useEffect(() => {
        async function loadData() {
            if (hasSupabaseCredentials) {
                try {
                    // Fetch team members from database
                    const dbTeam = await db.getTeamMembers()
                    if (dbTeam.length > 0) {
                        setTeamMembers(dbTeam)
                    }

                    // In the future, fetch metrics from database
                    // For now, we use mock data as metrics table may not be populated
                } catch (error) {
                    console.error('Error loading dashboard data:', error)
                }
            }
        }
        loadData()
    }, [])

    const activeTeamMembers = teamMembers.filter(m => m.status === 'active').slice(0, 5)

    // Get recent tasks from the store
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)

    // Generate Gantt tasks from real tasks
    const ganttTasks: GanttTask[] = tasks.slice(0, 10).map((task, idx) => ({
        id: task.id,
        title: task.title,
        icon: task.priority === 'urgent' ? '🔥' : task.priority === 'high' ? '⚡' : '📋',
        category: task.priority === 'urgent' ? 'critical' :
            task.priority === 'high' ? 'testing' :
                task.status === 'done' ? 'production' :
                    task.status === 'in_progress' ? 'integration' : 'foundation',
        startWeek: Math.min(Math.ceil((idx + 1) / 3), 4),
        endWeek: Math.min(Math.ceil((idx + 1) / 3), 4),
    }))

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
                    value={metrics.calls_made}
                    unit="calls"
                    icon={PhoneCall}
                    trend={{ value: 12.5, direction: 'up', percentage: 12.5 }}
                />
                <MetricCard
                    title="Qualified Leads"
                    value={metrics.qualified_leads}
                    unit="leads"
                    icon={Users}
                    trend={{ value: 8.2, direction: 'up', percentage: 8.2 }}
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${metrics.conversion_rate}%`}
                    icon={TrendingUp}
                    trend={{ value: 2.1, direction: 'up', percentage: 2.1 }}
                />
                <MetricCard
                    title="Time Saved"
                    value={metrics.time_saved}
                    unit="hours"
                    icon={Clock}
                    trend={{ value: 15.3, direction: 'up', percentage: 15.3 }}
                />
            </div>

            {/* Gantt Chart - Full Width */}
            <GanttChart
                tasks={ganttTasks.length > 0 ? ganttTasks : undefined}
                title="Project Timeline"
                startDate={new Date()}
            />

            {/* Interactive Calendar & Chart Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <TaskCalendar title="Task Calendar" showLegend={false} />
                <CallsChart data={chartData} />
            </div>

            {/* Recent Tasks & Team */}
            <div className="grid gap-6 lg:grid-cols-2">
                <TaskList tasks={recentTasks} title="Recent Tasks" />
                <TeamOverview members={activeTeamMembers} title="Active Team" compact />
            </div>
        </div>
    )
}
