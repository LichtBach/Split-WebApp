import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    ChevronRight,
    Folder
} from 'lucide-react'

export interface ProjectStatus {
    id: string
    name: string
    phase: string
    progress: number
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    blockedTasks: number
    dueDate?: string
    health: 'on_track' | 'at_risk' | 'blocked' | 'completed'
}

interface ProjectStatusCardProps {
    project: ProjectStatus
    onViewDetails?: () => void
    className?: string
}

const healthConfig = {
    on_track: {
        label: 'On Track',
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: CheckCircle2,
    },
    at_risk: {
        label: 'At Risk',
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: Clock,
    },
    blocked: {
        label: 'Blocked',
        color: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: AlertTriangle,
    },
    completed: {
        label: 'Completed',
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: CheckCircle2,
    },
}

export function ProjectStatusCard({ project, onViewDetails, className }: ProjectStatusCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const health = healthConfig[project.health]
    const HealthIcon = health.icon

    return (
        <Card
            className={cn(
                "transition-all duration-300 cursor-pointer",
                isHovered && "shadow-lg scale-[1.02]",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onViewDetails}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#dd3333]/10">
                            <Folder className="h-5 w-5 text-[#dd3333]" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{project.phase}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className={cn("gap-1", health.color)}>
                        <HealthIcon className="h-3 w-3" />
                        {health.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#dd3333] to-[#b52828] transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </div>

                {/* Task Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-semibold text-emerald-500">{project.completedTasks}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-semibold text-blue-500">{project.inProgressTasks}</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                        <p className="text-lg font-semibold text-red-500">{project.blockedTasks}</p>
                        <p className="text-xs text-muted-foreground">Blocked</p>
                    </div>
                </div>

                {/* Due Date & Action */}
                <div className="flex items-center justify-between pt-2 border-t">
                    {project.dueDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Due {project.dueDate}</span>
                        </div>
                    )}
                    <Button variant="ghost" size="sm" className="ml-auto text-[#dd3333] hover:text-[#b52828]">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

interface ProjectStatusListProps {
    projects: ProjectStatus[]
    title?: string
    onViewProject?: (projectId: string) => void
}

export function ProjectStatusList({ projects, title = "Active Projects", onViewProject }: ProjectStatusListProps) {
    return (
        <div className="space-y-4">
            {title && (
                <h2 className="text-lg font-semibold">{title}</h2>
            )}
            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                    <ProjectStatusCard
                        key={project.id}
                        project={project}
                        onViewDetails={() => onViewProject?.(project.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ProjectStatusCard
