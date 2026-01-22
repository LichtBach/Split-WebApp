import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
    FileText,
    Download,
    Eye,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink
} from 'lucide-react'

export interface Deliverable {
    id: string
    name: string
    description?: string
    type: 'document' | 'design' | 'code' | 'video' | 'other'
    status: 'pending' | 'in_review' | 'approved' | 'delivered'
    dueDate?: string
    deliveredDate?: string
    fileUrl?: string
    previewUrl?: string
    size?: string
}

interface DeliverablesListProps {
    deliverables: Deliverable[]
    title?: string
    onDownload?: (deliverableId: string) => void
    onPreview?: (deliverableId: string) => void
    compact?: boolean
}

const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        icon: Clock,
    },
    in_review: {
        label: 'In Review',
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: Eye,
    },
    approved: {
        label: 'Approved',
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: CheckCircle2,
    },
    delivered: {
        label: 'Delivered',
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: CheckCircle2,
    },
}

const typeConfig = {
    document: { icon: '📄', label: 'Document' },
    design: { icon: '🎨', label: 'Design' },
    code: { icon: '💻', label: 'Code' },
    video: { icon: '🎬', label: 'Video' },
    other: { icon: '📦', label: 'File' },
}

export function DeliverableItem({
    deliverable,
    onDownload,
    onPreview,
    compact = false
}: {
    deliverable: Deliverable
    onDownload?: () => void
    onPreview?: () => void
    compact?: boolean
}) {
    const status = statusConfig[deliverable.status]
    const type = typeConfig[deliverable.type]
    const StatusIcon = status.icon

    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md",
            deliverable.status === 'delivered' && "border-l-4 border-l-blue-500"
        )}>
            <div className="text-2xl flex-shrink-0">
                {type.icon}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{deliverable.name}</h4>
                        {!compact && deliverable.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {deliverable.description}
                            </p>
                        )}
                    </div>
                    <Badge variant="outline" className={cn("flex-shrink-0 gap-1", status.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                    </Badge>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {deliverable.dueDate && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due {deliverable.dueDate}
                        </span>
                    )}
                    {deliverable.deliveredDate && (
                        <span className="flex items-center gap-1 text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Delivered {deliverable.deliveredDate}
                        </span>
                    )}
                    {deliverable.size && (
                        <span>{deliverable.size}</span>
                    )}
                </div>
            </div>

            {!compact && (deliverable.fileUrl || deliverable.previewUrl) && (
                <div className="flex items-center gap-1">
                    {deliverable.previewUrl && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-[#dd3333]"
                            onClick={onPreview}
                            title="Preview"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}
                    {deliverable.fileUrl && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-[#dd3333]"
                            onClick={onDownload}
                            title="Download"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

export function DeliverablesList({
    deliverables,
    title = "Deliverables",
    onDownload,
    onPreview,
    compact = false
}: DeliverablesListProps) {
    // Sort by status (pending first, then in_review, approved, delivered)
    const statusOrder = ['pending', 'in_review', 'approved', 'delivered']
    const sortedDeliverables = [...deliverables].sort((a, b) =>
        statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    )

    const displayDeliverables = compact ? sortedDeliverables.slice(0, 4) : sortedDeliverables

    const delivered = deliverables.filter(d => d.status === 'delivered').length
    const total = deliverables.length

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#dd3333]" />
                        {title}
                        <Badge variant="secondary" className="ml-2">
                            {delivered}/{total}
                        </Badge>
                    </CardTitle>
                    {!compact && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[#dd3333] border-[#dd3333]/30 hover:bg-[#dd3333]/10"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View All Files
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {displayDeliverables.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No deliverables yet</p>
                        <p className="text-xs mt-1">Deliverables will appear here as they are created</p>
                    </div>
                ) : (
                    displayDeliverables.map((deliverable) => (
                        <DeliverableItem
                            key={deliverable.id}
                            deliverable={deliverable}
                            onDownload={() => onDownload?.(deliverable.id)}
                            onPreview={() => onPreview?.(deliverable.id)}
                            compact={compact}
                        />
                    ))
                )}

                {compact && deliverables.length > 4 && (
                    <Button variant="ghost" className="w-full text-muted-foreground">
                        View all {deliverables.length} deliverables
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default DeliverablesList
