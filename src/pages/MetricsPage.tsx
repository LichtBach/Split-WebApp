import { PhoneCall, Users, TrendingUp, Clock, DollarSign, Target } from 'lucide-react'
import { MetricCard } from '@/components/metrics/MetricCard'
import { CallsChart } from '@/components/metrics/CallsChart'
import { CostChart } from '@/components/metrics/CostChart'
import {
    mockMetricSummary,
    mockCallsChartData,
    mockCostChartData,
} from '@/services/mockData'
import { formatDuration } from '@/lib/utils'

export function MetricsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics & Metrics</h1>
                <p className="text-muted-foreground">
                    Track your AI receptionist performance and key metrics.
                </p>
            </div>

            {/* Overview Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <MetricCard
                    title="Total Calls"
                    value={mockMetricSummary.calls_made}
                    icon={PhoneCall}
                    trend={{ value: 12.5, direction: 'up', percentage: 12.5 }}
                />
                <MetricCard
                    title="Call Duration"
                    value={formatDuration(mockMetricSummary.call_duration_mins)}
                    icon={Clock}
                    trend={{ value: 5.8, direction: 'up', percentage: 5.8 }}
                />
                <MetricCard
                    title="Qualified Leads"
                    value={mockMetricSummary.qualified_leads}
                    icon={Users}
                    trend={{ value: 8.2, direction: 'up', percentage: 8.2 }}
                />
                <MetricCard
                    title="Conversions"
                    value={mockMetricSummary.conversions}
                    icon={Target}
                    trend={{ value: 15.3, direction: 'up', percentage: 15.3 }}
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
                    icon={DollarSign}
                    trend={{ value: 18.7, direction: 'up', percentage: 18.7 }}
                />
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <CallsChart
                    data={mockCallsChartData}
                    title="Calls & Conversions Over Time"
                />
                <CostChart
                    data={mockCostChartData}
                    title="Daily Costs"
                />
            </div>

            {/* Additional Chart - Full Width */}
            <CallsChart
                data={mockCallsChartData}
                title="Weekly Performance Trend"
                showQualified={true}
                showConversions={true}
            />
        </div>
    )
}
