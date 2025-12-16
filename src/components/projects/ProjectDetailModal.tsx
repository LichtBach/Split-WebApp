import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Calendar,
    Users,
    Clock,
    Tag,
    MessageSquare,
    Plus,
    Link2,
    CheckSquare,
    Paperclip,
    MoreHorizontal,
    DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useProjectStore } from '@/store/projectStore'
import { mockTeamMembers } from '@/services/mockData'
import { formatDate, formatCurrency, cn } from '@/lib/utils'
import type { ProjectActivity } from '@/types'

const statusColors: Record<string, string> = {
    'active': 'bg-green-500/20 text-green-400 border-green-500/30',
    'on-hold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'archived': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const activityIcons: Record<ProjectActivity['action'], string> = {
    'created': '🎉',
    'updated': '✏️',
    'commented': '💬',
    'status_changed': '🔄',
    'assigned': '👤',
    'completed': '✅',
}

export function ProjectDetailModal() {
    const { selectedProject, isDetailModalOpen, closeProjectDetail, getProjectActivities } = useProjectStore()

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isDetailModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isDetailModalOpen])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeProjectDetail()
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [closeProjectDetail])

    if (!selectedProject || !isDetailModalOpen) return null

    const activities = getProjectActivities(selectedProject.id)
    const assignedMembers = mockTeamMembers.filter(m =>
        selectedProject.assigned_members?.includes(m.id)
    )

    return (
        <AnimatePresence>
            {isDetailModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProjectDetail}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal - Properly centered */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl border border-border/50 bg-card/95 backdrop-blur-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex h-[85vh] max-h-[85vh]">
                                {/* Main Content - Left Side */}
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    {/* Header */}
                                    <div className="p-6 border-b border-border/50">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge
                                                        className={cn(
                                                            "uppercase text-xs font-bold border",
                                                            statusColors[selectedProject.status]
                                                        )}
                                                    >
                                                        {selectedProject.status.replace('-', ' ')}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        #{selectedProject.id.slice(-6)}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-foreground">
                                                    {selectedProject.name}
                                                </h2>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={closeProjectDetail}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <ScrollArea className="flex-1 p-6">
                                        {/* Properties Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                                            {/* Assignees */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span>Assignees</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {assignedMembers.length > 0 ? (
                                                        <div className="flex -space-x-2">
                                                            {assignedMembers.slice(0, 3).map((member) => (
                                                                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                                                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ))}
                                                            {assignedMembers.length > 3 && (
                                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                                                    +{assignedMembers.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Unassigned</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Start Date */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Start Date</span>
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {selectedProject.start_date
                                                        ? formatDate(selectedProject.start_date, 'MMM d, yyyy')
                                                        : 'Not set'}
                                                </div>
                                            </div>

                                            {/* Due Date */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Due Date</span>
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {selectedProject.end_date
                                                        ? formatDate(selectedProject.end_date, 'MMM d, yyyy')
                                                        : 'Not set'}
                                                </div>
                                            </div>

                                            {/* Budget */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>Budget</span>
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {selectedProject.budget
                                                        ? formatCurrency(selectedProject.budget)
                                                        : 'Not set'}
                                                </div>
                                            </div>

                                            {/* Spent */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>Spent</span>
                                                </div>
                                                <div className="text-sm font-medium text-blue-400">
                                                    {formatCurrency(selectedProject.spent)}
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Tag className="h-4 w-4" />
                                                    <span>Tags</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Badge variant="outline" className="text-xs">AI</Badge>
                                                    <Badge variant="outline" className="text-xs">Receptionist</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        {/* Description */}
                                        <div className="mb-8">
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Description</h3>
                                            <div className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-4">
                                                {selectedProject.description || (
                                                    <span className="text-muted-foreground italic">
                                                        No description provided. Click to add one.
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            <ActionButton icon={CheckSquare} label="Add subtask" />
                                            <ActionButton icon={Link2} label="Relate items or add dependencies" />
                                            <ActionButton icon={Plus} label="Create checklist" />
                                            <ActionButton icon={Paperclip} label="Attach file" />
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Activity Sidebar - Right Side */}
                                <div className="w-80 border-l border-border/50 bg-background/50 flex flex-col">
                                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                                        <h3 className="font-semibold">Activity</h3>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <ScrollArea className="flex-1 p-4">
                                        <AnimatePresence>
                                            {activities.length > 0 ? (
                                                <div className="space-y-4">
                                                    {activities.map((activity, index) => (
                                                        <motion.div
                                                            key={activity.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="flex gap-3"
                                                        >
                                                            <div className="text-lg">
                                                                {activityIcons[activity.action]}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm">
                                                                    <span className="font-medium">{activity.user_name}</span>
                                                                    {' '}
                                                                    <span className="text-muted-foreground">
                                                                        {activity.description.toLowerCase()}
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {formatDate(activity.timestamp, 'MMM d, h:mm a')}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-muted-foreground text-sm py-8">
                                                    No activity yet
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </ScrollArea>

                                    {/* Comment Input */}
                                    <div className="p-4 border-t border-border/50">
                                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

function ActionButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <button className="flex items-center gap-3 w-full p-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group">
            <Icon className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span>{label}</span>
        </button>
    )
}
