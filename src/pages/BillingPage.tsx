import { Download, FileText, CreditCard, DollarSign, PhoneCall, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MetricCard } from '@/components/metrics/MetricCard'
import { Separator } from '@/components/ui/separator'
import { mockBilling } from '@/services/mockData'
import { formatCurrency, formatDate, cn, getStatusColor } from '@/lib/utils'

export function BillingPage() {
    const currentMonthBilling = mockBilling.filter(b => b.status === 'pending')
    const paidBilling = mockBilling.filter(b => b.status === 'paid')

    const totalPending = currentMonthBilling.reduce((sum, b) => sum + b.total_cost, 0)
    const totalPaid = paidBilling.reduce((sum, b) => sum + b.total_cost, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
                    <p className="text-muted-foreground">
                        Track your costs and manage invoices.
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Pending Amount"
                    value={formatCurrency(totalPending)}
                    icon={CreditCard}
                />
                <MetricCard
                    title="Total Paid (All Time)"
                    value={formatCurrency(totalPaid)}
                    icon={DollarSign}
                />
                <MetricCard
                    title="This Month Calls"
                    value={currentMonthBilling.reduce((sum, b) => sum + b.calls_made, 0)}
                    icon={PhoneCall}
                />
                <MetricCard
                    title="This Month Leads"
                    value={currentMonthBilling.reduce((sum, b) => sum + b.qualified_leads, 0)}
                    icon={Users}
                />
            </div>

            {/* Current Period */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Billing Period</CardTitle>
                    <CardDescription>December 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentMonthBilling.map((bill) => (
                        <div key={bill.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Project Invoice</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Billing period: {formatDate(bill.billing_month, 'MMMM yyyy')}
                                    </p>
                                </div>
                                <Badge variant="outline" className={getStatusColor(bill.status)}>
                                    {bill.status}
                                </Badge>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-4">
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Calls Made</p>
                                    <p className="text-2xl font-bold">{bill.calls_made.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        @ {formatCurrency(bill.cost_per_call || 0)}/call
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Qualified Leads</p>
                                    <p className="text-2xl font-bold">{bill.qualified_leads.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        @ {formatCurrency(bill.cost_per_lead || 0)}/lead
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Conversions</p>
                                    <p className="text-2xl font-bold">{bill.conversions.toLocaleString()}</p>
                                </div>
                                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                                    <p className="text-sm text-muted-foreground">Total Cost</p>
                                    <p className="text-2xl font-bold gradient-text">{formatCurrency(bill.total_cost)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Invoice History */}
            <Card>
                <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>Past billing periods and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {paidBilling.map((bill, index) => (
                            <div key={bill.id}>
                                {index > 0 && <Separator className="my-4" />}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-muted p-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">
                                                {formatDate(bill.billing_month, 'MMMM yyyy')} Invoice
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {bill.calls_made.toLocaleString()} calls • {bill.qualified_leads.toLocaleString()} leads
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(bill.total_cost)}</p>
                                            <Badge variant="outline" className={cn('mt-1', getStatusColor(bill.status))}>
                                                {bill.status}
                                            </Badge>
                                        </div>
                                        {bill.invoice_url && (
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {paidBilling.length === 0 && (
                        <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No previous invoices</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
