import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
    Receipt,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    DollarSign
} from 'lucide-react'

export interface Invoice {
    id: string
    invoiceNumber: string
    description: string
    amount: number
    currency: string
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
    issueDate: string
    dueDate: string
    paidDate?: string
    paymentUrl?: string
    downloadUrl?: string
}

interface InvoicesListProps {
    invoices: Invoice[]
    title?: string
    onDownload?: (invoiceId: string) => void
    compact?: boolean
}

const statusConfig = {
    draft: {
        label: 'Draft',
        color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        icon: Clock,
    },
    sent: {
        label: 'Pending',
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: Clock,
    },
    paid: {
        label: 'Paid',
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: CheckCircle2,
    },
    overdue: {
        label: 'Overdue',
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: AlertCircle,
    },
    cancelled: {
        label: 'Cancelled',
        color: 'bg-gray-500/10 text-gray-500 border-gray-500/20 line-through',
        icon: AlertCircle,
    },
}

function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount)
}

export function InvoiceItem({
    invoice,
    onDownload,
    compact = false
}: {
    invoice: Invoice
    onDownload?: () => void
    compact?: boolean
}) {
    const status = statusConfig[invoice.status]
    const StatusIcon = status.icon

    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md",
            invoice.status === 'overdue' && "border-l-4 border-l-red-500",
            invoice.status === 'paid' && "border-l-4 border-l-emerald-500"
        )}>
            <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                invoice.status === 'paid' ? "bg-emerald-500/10" : "bg-muted"
            )}>
                <Receipt className={cn(
                    "h-5 w-5",
                    invoice.status === 'paid' ? "text-emerald-500" : "text-muted-foreground"
                )} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{invoice.invoiceNumber}</h4>
                            <Badge variant="outline" className={cn("gap-1", status.color)}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                            </Badge>
                        </div>
                        {!compact && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {invoice.description}
                            </p>
                        )}
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-lg">
                            {formatCurrency(invoice.amount, invoice.currency)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Issued {invoice.issueDate}</span>
                    <span>Due {invoice.dueDate}</span>
                    {invoice.paidDate && (
                        <span className="text-emerald-500">Paid {invoice.paidDate}</span>
                    )}
                </div>
            </div>

            {!compact && invoice.downloadUrl && (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-[#dd3333]"
                        onClick={onDownload}
                        title="Download PDF"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}

export function InvoicesList({
    invoices,
    title = "Invoices",
    onDownload,
    compact = false
}: InvoicesListProps) {
    // Sort by status (overdue first, then sent, draft, paid, cancelled)
    const statusOrder = ['overdue', 'sent', 'draft', 'paid', 'cancelled']
    const sortedInvoices = [...invoices].sort((a, b) =>
        statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    )

    const displayInvoices = compact ? sortedInvoices.slice(0, 3) : sortedInvoices

    const pendingAmount = invoices
        .filter(i => i.status === 'sent' || i.status === 'overdue')
        .reduce((sum, i) => sum + i.amount, 0)

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-[#dd3333]" />
                        {title}
                    </CardTitle>
                    {pendingAmount > 0 && (
                        <span className="text-yellow-500 text-sm">
                            {formatCurrency(pendingAmount, 'USD')} pending
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {displayInvoices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Receipt className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No invoices yet</p>
                        <p className="text-xs mt-1">Invoices will appear here when generated</p>
                    </div>
                ) : (
                    displayInvoices.map((invoice) => (
                        <InvoiceItem
                            key={invoice.id}
                            invoice={invoice}
                            onDownload={() => onDownload?.(invoice.id)}
                            compact={compact}
                        />
                    ))
                )}

                {compact && invoices.length > 3 && (
                    <Button variant="ghost" className="w-full text-muted-foreground">
                        View all {invoices.length} invoices
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default InvoicesList
