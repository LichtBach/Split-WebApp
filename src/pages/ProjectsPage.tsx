import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectList } from '@/components/projects/ProjectCard'
import { mockProjects } from '@/services/mockData'
import type { ProjectStatus } from '@/types'

const statusFilters: { label: string; value: ProjectStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'On Hold', value: 'on-hold' },
    { label: 'Completed', value: 'completed' },
    { label: 'Archived', value: 'archived' },
]

export function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')

    const filteredProjects = mockProjects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage your AI receptionist projects and track their progress.
                    </p>
                </div>
                <Button variant="gradient" className="shrink-0">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    {statusFilters.map((filter) => (
                        <Button
                            key={filter.value}
                            variant={statusFilter === filter.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter(filter.value)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Project List */}
            <ProjectList projects={filteredProjects} />

            {/* Empty State */}
            {filteredProjects.length === 0 && searchQuery && (
                <div className="text-center py-12">
                    <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search or filter to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    )
}
