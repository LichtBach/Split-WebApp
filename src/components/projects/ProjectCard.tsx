import { ArrowRight, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types'
import { cn, formatCurrency, formatDate, getStatusColor, calculateProgress } from '@/lib/utils'
import { getProjectTasks } from '@/services/mockData'
import { useProjectStore } from '@/store/projectStore'

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const { openProjectDetail } = useProjectStore()
    const tasks = getProjectTasks(project.id)
    const completedTasks = tasks.filter(t => t.status === 'done').length
    const progressPercent = calculateProgress(completedTasks, tasks.length)
    const budgetPercent = project.budget
        ? calculateProgress(project.spent, project.budget)
        : 0

    const handleClick = () => {
        openProjectDetail(project)
    }

    return (
        <Card
            className="transition-all duration-200 hover:shadow-lg hover:border-primary/30 group cursor-pointer"
            onClick={handleClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold line-clamp-1">
                            {project.name}
                        </CardTitle>
                        {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.description}
                            </p>
                        )}
                    </div>
                    <Badge
                        variant="outline"
                        className={cn('shrink-0', getStatusColor(project.status))}
                    >
                        {project.status.replace('-', ' ')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completedTasks}/{tasks.length} tasks</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                </div>

                {/* Budget */}
                {project.budget && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <DollarSign className="h-3.5 w-3.5" />
                                Budget
                            </span>
                            <span className="font-medium">
                                {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                            </span>
                        </div>
                        <Progress
                            value={budgetPercent}
                            className="h-2"
                            indicatorClassName={budgetPercent > 80 ? 'bg-blue-500' : undefined}
                        />
                    </div>
                )}

                {/* Dates */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                            {project.start_date ? formatDate(project.start_date, 'MMM d, yyyy') : 'No start date'}
                        </span>
                    </div>
                </div>

                {/* Action */}
                <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-accent"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleClick()
                    }}
                >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </CardContent>
        </Card>
    )
}

interface ProjectListProps {
    projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
    if (projects.length === 0) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No projects found</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}
