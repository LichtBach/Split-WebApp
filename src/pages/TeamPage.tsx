import { Users } from 'lucide-react'
import { TeamOverview } from '@/components/team/TeamOverview'
import { mockTeamMembers } from '@/services/mockData'

export function TeamPage() {
    // Group members by role
    const ownerAndManagers = mockTeamMembers.filter(m =>
        m.role === 'owner' || m.role === 'project_manager'
    )
    const developers = mockTeamMembers.filter(m =>
        m.role === 'developer' || m.role === 'designer'
    )
    const supportTeam = mockTeamMembers.filter(m =>
        m.role === 'qa' || m.role === 'support'
    )

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Team</h1>
                    <p className="text-muted-foreground">
                        Manage your team members and their roles
                    </p>
                </div>
            </div>

            {/* Leadership */}
            <TeamOverview
                members={ownerAndManagers}
                title="Leadership & Project Management"
            />

            {/* Development */}
            {developers.length > 0 && (
                <TeamOverview
                    members={developers}
                    title="Development & Design"
                />
            )}

            {/* Support */}
            {supportTeam.length > 0 && (
                <TeamOverview
                    members={supportTeam}
                    title="QA & Customer Success"
                />
            )}
        </div>
    )
}
