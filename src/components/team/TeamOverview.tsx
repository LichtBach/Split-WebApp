import { Mail, Phone, MoreVertical, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TeamMember, TeamRole } from '@/types'
import { cn } from '@/lib/utils'

interface TeamOverviewProps {
    members: TeamMember[]
    title?: string
    compact?: boolean
}

const roleConfig: Record<TeamRole, { label: string; color: string }> = {
    owner: { label: 'Owner', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    project_manager: { label: 'Project Manager', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    developer: { label: 'Developer', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    designer: { label: 'Designer', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
    qa: { label: 'QA', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    support: { label: 'Support', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
}

const statusConfig = {
    active: { label: 'Active', color: 'text-green-500' },
    away: { label: 'Away', color: 'text-yellow-500' },
    offline: { label: 'Offline', color: 'text-gray-500' },
}

interface TeamMemberCardProps {
    member: TeamMember
    compact?: boolean
}

function TeamMemberCard({ member, compact = false }: TeamMemberCardProps) {
    const role = roleConfig[member.role]
    const status = statusConfig[member.status]

    if (compact) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg hover:scale-[1.02] transition-transform will-change-transform cursor-pointer">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <Circle
                        className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-current", status.color)}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.title}</p>
                </div>
                <Badge variant="outline" className={cn('text-[10px] shrink-0', role.color)}>
                    {role.label}
                </Badge>
            </div>
        )
    }

    return (
        <Card className="transition-transform duration-200 hover:scale-[1.02] will-change-transform">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white text-lg font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <Circle
                            className={cn("absolute -bottom-0.5 -right-0.5 h-4 w-4 fill-current", status.color)}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h4 className="font-semibold">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">{member.title}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Assign Task</DropdownMenuItem>
                                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Role & Department */}
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={cn('text-xs', role.color)}>
                                {role.label}
                            </Badge>
                            {member.department && (
                                <span className="text-xs text-muted-foreground">{member.department}</span>
                            )}
                        </div>

                        {/* Skills */}
                        {member.skills && member.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                                {member.skills.slice(0, 4).map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {member.skills.length > 4 && (
                                    <span className="text-[10px] text-muted-foreground">
                                        +{member.skills.length - 4} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Contact */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <a
                                href={`mailto:${member.email}`}
                                className="flex items-center gap-1 hover:text-foreground transition-colors"
                            >
                                <Mail className="h-3 w-3" />
                                <span className="hidden sm:inline">{member.email}</span>
                            </a>
                            {member.phone && (
                                <a
                                    href={`tel:${member.phone}`}
                                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                                >
                                    <Phone className="h-3 w-3" />
                                    <span className="hidden sm:inline">{member.phone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function TeamOverview({ members, title = 'Team Members', compact = false }: TeamOverviewProps) {
    if (members.length === 0) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No team members found</p>
                </CardContent>
            </Card>
        )
    }

    if (compact) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="divide-y">
                        {members.map((member) => (
                            <TeamMemberCard key={member.id} member={member} compact />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{title}</h2>
                <span className="text-sm text-muted-foreground">{members.length} members</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                ))}
            </div>
        </div>
    )
}
