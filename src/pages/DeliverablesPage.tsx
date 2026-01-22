import { useState } from 'react'
import { Search, FileText, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Deliverable {
    id: string
    name: string
    description?: string
    type: 'document' | 'design' | 'code' | 'video' | 'report' | 'other'
    status: 'pending' | 'in_review' | 'approved' | 'delivered'
    category: string
    dueDate?: string
    deliveredDate?: string
    fileUrl?: string
    previewUrl?: string
    size?: string
}

const typeConfig = {
    document: { icon: '📄', label: 'Document', color: 'bg-blue-500' },
    design: { icon: '🎨', label: 'Design', color: 'bg-purple-500' },
    code: { icon: '💻', label: 'Code', color: 'bg-green-500' },
    video: { icon: '🎬', label: 'Video', color: 'bg-red-500' },
    report: { icon: '📊', label: 'Report', color: 'bg-orange-500' },
    other: { icon: '📦', label: 'File', color: 'bg-gray-500' },
}

const statusConfig = {
    pending: { label: 'Pending', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
    in_review: { label: 'In Review', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    approved: { label: 'Approved', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    delivered: { label: 'Delivered', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
}

// Mock deliverables data
const mockDeliverables: Deliverable[] = [
    {
        id: '1',
        name: 'GA4 Audit Report',
        description: 'Comprehensive audit of current analytics implementation with recommendations',
        type: 'report',
        status: 'delivered',
        category: 'Analytics',
        dueDate: 'Jan 15, 2026',
        deliveredDate: 'Jan 14, 2026',
        fileUrl: 'https://docs.google.com/document/d/example1',
        size: '2.4 MB',
    },
    {
        id: '2',
        name: 'GTM Container Export',
        description: 'Production-ready GTM container with all tracking tags and triggers',
        type: 'code',
        status: 'in_review',
        category: 'Tag Management',
        dueDate: 'Feb 5, 2026',
        fileUrl: 'https://tagmanager.google.com/export/example',
    },
    {
        id: '3',
        name: 'Looker Studio Dashboard',
        description: 'Executive KPI dashboard with e-commerce metrics and marketing attribution',
        type: 'report',
        status: 'pending',
        category: 'Reporting',
        dueDate: 'Feb 20, 2026',
        fileUrl: 'https://lookerstudio.google.com/reporting/example',
    },
    {
        id: '4',
        name: 'Revenue Lost Due to Out of Stock Analysis',
        description: 'Data analysis identifying revenue impact from out-of-stock products',
        type: 'document',
        status: 'pending',
        category: 'Analytics',
        dueDate: 'Feb 25, 2026',
    },
    {
        id: '5',
        name: 'E-commerce Tracking Documentation',
        description: 'Technical documentation for all e-commerce tracking events',
        type: 'document',
        status: 'delivered',
        category: 'Documentation',
        dueDate: 'Jan 20, 2026',
        deliveredDate: 'Jan 19, 2026',
        fileUrl: 'https://docs.google.com/document/d/example2',
        size: '1.8 MB',
    },
    {
        id: '6',
        name: 'Cookie Consent Implementation Guide',
        description: 'Step-by-step guide for implementing cookie consent with GTM',
        type: 'document',
        status: 'approved',
        category: 'Compliance',
        dueDate: 'Jan 25, 2026',
        fileUrl: 'https://docs.google.com/document/d/example3',
        size: '956 KB',
    },
]



function DeliverableCard({ deliverable }: { deliverable: Deliverable }) {
    const type = typeConfig[deliverable.type]
    const status = statusConfig[deliverable.status]
    const hasLink = deliverable.fileUrl || deliverable.previewUrl

    const handleClick = () => {
        if (deliverable.fileUrl) {
            window.open(deliverable.fileUrl, '_blank')
        } else if (deliverable.previewUrl) {
            window.open(deliverable.previewUrl, '_blank')
        }
    }

    return (
        <Card
            className={cn(
                "transition-all duration-200",
                hasLink && "cursor-pointer hover:shadow-lg hover:scale-[1.02]",
                deliverable.status === 'delivered' && "border-l-4 border-l-emerald-500"
            )}
            onClick={hasLink ? handleClick : undefined}
        >
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                        "bg-muted"
                    )}>
                        {type.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-base truncate">{deliverable.name}</h3>
                                    {hasLink && (
                                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                </div>
                                {deliverable.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {deliverable.description}
                                    </p>
                                )}
                            </div>
                            <Badge variant="outline" className={cn("flex-shrink-0", status.color)}>
                                {status.label}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <span className={cn("w-2 h-2 rounded-full", type.color)} />
                                {type.label}
                            </span>
                            <span>{deliverable.category}</span>
                            {deliverable.deliveredDate ? (
                                <span className="text-emerald-500">Delivered {deliverable.deliveredDate}</span>
                            ) : deliverable.dueDate && (
                                <span>Due {deliverable.dueDate}</span>
                            )}
                            {deliverable.size && (
                                <span>{deliverable.size}</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function DeliverablesPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredDeliverables = mockDeliverables.filter((deliverable) => {
        const matchesSearch = deliverable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            deliverable.description?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    // Stats
    const delivered = mockDeliverables.filter(d => d.status === 'delivered').length
    const total = mockDeliverables.length

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Deliverables</h1>
                    <p className="text-muted-foreground">
                        Access all your project documents and materials
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                        <span className="font-semibold text-foreground">{delivered}</span> of {total} delivered
                    </span>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search deliverables..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Deliverables Grid */}
            {filteredDeliverables.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredDeliverables.map((deliverable) => (
                        <DeliverableCard key={deliverable.id} deliverable={deliverable} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No deliverables found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? 'Try adjusting your search query'
                            : 'Deliverables will appear here as they are created'}
                    </p>
                </div>
            )}
        </div>
    )
}
