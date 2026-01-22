import { useState } from 'react'
import { Users, Mail, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    departmentConfig,
    getTeamMembersByDepartment,
    type Department,
    type DepartmentTeamMember
} from '@/services/mockData'
import { cn } from '@/lib/utils'

const departments: Department[] = ['DATA', 'PMK', 'SEO', 'SM', 'CONTENT']

const statusColors = {
    active: 'bg-emerald-500',
    busy: 'bg-yellow-500',
    away: 'bg-gray-400',
}

function TeamMemberCard({ member }: { member: DepartmentTeamMember }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all">
            {/* Avatar */}
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#dd3333] to-[#b52828] flex items-center justify-center text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div
                    className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        statusColors[member.status as keyof typeof statusColors] || statusColors.away
                    )}
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm truncate">{member.name}</h4>
                    {member.role === 'owner' || member.role === 'project_manager' ? (
                        <Badge variant="outline" className="text-xs bg-[#dd3333]/10 text-[#dd3333] border-[#dd3333]/20">
                            Lead
                        </Badge>
                    ) : null}
                </div>
                <p className="text-xs text-muted-foreground truncate">{member.title}</p>

            </div>

            {/* Contact */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => window.location.href = `mailto:${member.email}`}
                    title={`Email ${member.name}`}
                >
                    <Mail className="h-4 w-4" />
                </Button>

            </div>
        </div>
    )
}

interface DepartmentTeamSectionProps {
    department: Department
}

function DepartmentTeamSection({ department }: DepartmentTeamSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const config = departmentConfig[department]
    const members = getTeamMembersByDepartment(department)

    if (members.length === 0) return null

    const leadCount = members.filter(m => m.role === 'owner' || m.role === 'project_manager').length

    return (
        <Card className="overflow-hidden">
            <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors py-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${config.color}15` }}
                        >
                            {config.icon}
                        </div>
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {config.name}
                                <span className="text-sm font-normal text-muted-foreground">
                                    ({members.length} {members.length === 1 ? 'member' : 'members'})
                                </span>
                            </CardTitle>
                            {leadCount > 0 && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {leadCount} team {leadCount === 1 ? 'lead' : 'leads'}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent className="pt-0 pb-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        {members.map((member) => (
                            <TeamMemberCard key={member.id} member={member} />
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export function TeamPage() {

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-[#dd3333]/10 p-3">
                        <Users className="h-6 w-6 text-[#dd3333]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Your Team</h1>
                        <p className="text-muted-foreground">
                            Meet the specialists working on your project
                        </p>
                    </div>
                </div>
                <div>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = 'mailto:team@datarevolt.agency'}
                        className="gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        Email Team
                    </Button>
                </div>
            </div>

            {/* Teams by Department */}
            <div className="space-y-4">
                {departments.map((department) => (
                    <DepartmentTeamSection key={department} department={department} />
                ))}
            </div>
        </div>
    )
}
