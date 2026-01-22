import { CreditCard, DollarSign, Package, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MetricCard } from '@/components/metrics/MetricCard'
import { InvoicesList, type Invoice } from '@/components/billing/InvoicesList'
import { formatCurrency } from '@/lib/utils'

// Mock Data
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
        issueDate: 'Jan 18, 2026',
        dueDate: 'Jan 25, 2026',
        downloadUrl: '#',
    }
]

const services = [
    { name: 'Comprehensive GTM & GA4 Setup', fee: 8500, type: 'one-time' },
    { name: 'Analytics Maintenance & Reporting', fee: 1500, type: 'monthly' },
]

export function BillingPage() {
    // Calculate totals
    const pendingAmount = mockInvoices
        .filter(i => i.status === 'sent' || i.status === 'overdue')
        .reduce((sum, i) => sum + i.amount, 0)

    const totalPaid = mockInvoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.amount, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
                <p className="text-muted-foreground">
                    Manage your invoices and view service details.
                </p>
            </div>

            {/* Scorecards */}
            <div className="grid gap-4 md:grid-cols-2">
                <MetricCard
                    title="Pending Amount"
                    value={formatCurrency(pendingAmount)}
                    icon={CreditCard}
                    description="Total amount due"
                />
                <MetricCard
                    title="Total Paid (All Time)"
                    value={formatCurrency(totalPaid)}
                    icon={DollarSign}
                    description="Lifetime payments"
                />
            </div>

            {/* Active Services */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-[#dd3333]" />
                        <CardTitle>Active Services</CardTitle>
                    </div>
                    <CardDescription>Breakdown of your current engagement services</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {services.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{service.name}</h4>
                                        <p className="text-xs text-muted-foreground capitalize">{service.type} fee</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{formatCurrency(service.fee)}</p>
                                    <span className="text-xs text-muted-foreground">({service.type})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Invoice History */}
            <InvoicesList invoices={mockInvoices} title="Invoice History" />
        </div>
    )
}
