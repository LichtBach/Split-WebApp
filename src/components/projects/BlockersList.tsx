import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
    AlertOctagon,
    Clock,
    User,
    ArrowRight,
    ExternalLink
} from 'lucide-react'

export interface Blocker {
    id: string
    title: string
    description?: string
    priority: 'urgent' | 'high' | 'medium' | 'low'
    assignee?: {
        name: string
        avatar?: string
    }
    createdAt: string
    daysPending: number
    projectName: string
    clickupUrl?: string
}

interface BlockersListProps {
    blockers: Blocker[]
    title?: string
    onResolve?: (blockerId: string) => void
    onViewDetails?: (blockerId: string) => void
    compact?: boolean
}

const priorityConfig = {
    urgent: {
        label: 'Urgent',
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
    high: {
        label: 'High',
        color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    },
    medium: {
        label: 'Medium',
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    },
    low: {
        label: 'Low',
        color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    },
}

export function BlockerItem({
    blocker,
    onResolve,
    onViewDetails,
    compact = false
}: {
    blocker: Blocker
    onResolve?: (blockerId: string) => void
    onViewDetails?: (blockerId: string) => void
    compact?: boolean
}) {
    const priority = priorityConfig[blocker.priority]

    return (
        <div className={cn(
            "flex items-start gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md",
            blocker.priority === 'urgent' && "border-l-4 border-l-red-500",
            blocker.priority === 'high' && "border-l-4 border-l-orange-500",
        )}>
            <div className="p-2 rounded-lg bg-red-500/10 flex-shrink-0">
                <AlertOctagon className="h-5 w-5 text-red-500" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">{blocker.title}</h4>
                        {!compact && blocker.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {blocker.description}
                            </p>
                        )}
                    </div>
                    <Badge variant="outline" className={cn("flex-shrink-0", priority.color)}>
                        {priority.label}
                    </Badge>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {blocker.daysPending} days pending
                    </span>
                    {blocker.assignee && (
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {blocker.assignee.name}
                        </span>
                    )}
                    <span className="text-muted-foreground/60">
                        {blocker.projectName}
                    </span>
                </div>

                {!compact && (
                    <div className="flex items-center gap-2 mt-3">
                        {blocker.clickupUrl && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => window.open(blocker.clickupUrl, '_blank')}
                            >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Open in ClickUp
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-[#dd3333]"
                            onClick={() => onViewDetails?.(blocker.id)}
                        >
                            View Details
                            <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export function BlockersList({
    blockers,
    title = "Active Blockers",
    onResolve,
    onViewDetails,
    compact = false
}: BlockersListProps) {
    const sortedBlockers = [...blockers].sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <AlertOctagon className="h-5 w-5 text-red-500" />
                        {title}
                        {blockers.length > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {blockers.length}
                            </Badge>
                        )}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {sortedBlockers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <AlertOctagon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No active blockers</p>
                        <p className="text-xs mt-1">All clear! Projects are running smoothly.</p>
                    </div>
                ) : (
                    sortedBlockers.slice(0, compact ? 3 : undefined).map((blocker) => (
                        <BlockerItem
                            key={blocker.id}
                            blocker={blocker}
                            onResolve={onResolve}
                            onViewDetails={onViewDetails}
                            compact={compact}
                        />
                    ))
                )}

                {compact && blockers.length > 3 && (
                    <Button variant="ghost" className="w-full text-[#dd3333]">
                        View all {blockers.length} blockers
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default BlockersList
