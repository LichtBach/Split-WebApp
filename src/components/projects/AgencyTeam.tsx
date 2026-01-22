import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
    Mail,
    Phone,
    MessageSquare,
    Users,
    Crown
} from 'lucide-react'

export interface TeamMember {
    id: string
    name: string
    role: string
    email: string
    phone?: string
    avatar?: string
    isLead?: boolean
    status: 'active' | 'busy' | 'away'
}

interface AgencyTeamProps {
    members: TeamMember[]
    title?: string
    onContactMember?: (memberId: string, method: 'email' | 'phone' | 'message') => void
    compact?: boolean
}

const statusConfig = {
    active: {
        label: 'Available',
        color: 'bg-emerald-500',
    },
    busy: {
        label: 'Busy',
        color: 'bg-yellow-500',
    },
    away: {
        label: 'Away',
        color: 'bg-gray-400',
    },
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function TeamMemberCard({
    member,
    onContact,
    compact = false
}: {
    member: TeamMember
    onContact?: (method: 'email' | 'phone' | 'message') => void
    compact?: boolean
}) {
    const status = statusConfig[member.status]

    return (
        <div className={cn(
            "flex items-center gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md",
            member.isLead && "border-[#dd3333]/30 bg-[#dd3333]/5"
        )}>
            <div className="relative">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#dd3333] to-[#b52828] text-white">
                        {getInitials(member.name)}
                    </AvatarFallback>
                </Avatar>
                <span className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                    status.color
                )} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{member.name}</h4>
                    {member.isLead && (
                        <Crown className="h-4 w-4 text-[#dd3333] flex-shrink-0" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>

            {!compact && (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-[#dd3333]"
                        onClick={() => onContact?.('email')}
                        title="Send Email"
                    >
                        <Mail className="h-4 w-4" />
                    </Button>
                    {member.phone && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-[#dd3333]"
                            onClick={() => onContact?.('phone')}
                            title="Call"
                        >
                            <Phone className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-[#dd3333]"
                        onClick={() => onContact?.('message')}
                        title="Send Message"
                    >
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}

export function AgencyTeam({
    members,
    title = "Your Team",
    onContactMember,
    compact = false
}: AgencyTeamProps) {
    // Sort to show lead first, then by name
    const sortedMembers = [...members].sort((a, b) => {
        if (a.isLead && !b.isLead) return -1
        if (!a.isLead && b.isLead) return 1
        return a.name.localeCompare(b.name)
    })

    const displayMembers = compact ? sortedMembers.slice(0, 4) : sortedMembers

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#dd3333]" />
                        {title}
                        <Badge variant="secondary" className="ml-2">
                            {members.length}
                        </Badge>
                    </CardTitle>
                    {!compact && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[#dd3333] border-[#dd3333]/30 hover:bg-[#dd3333]/10"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Team
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {displayMembers.map((member) => (
                    <TeamMemberCard
                        key={member.id}
                        member={member}
                        onContact={(method) => onContactMember?.(member.id, method)}
                        compact={compact}
                    />
                ))}

                {compact && members.length > 4 && (
                    <Button variant="ghost" className="w-full text-muted-foreground">
                        View all {members.length} team members
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default AgencyTeam
