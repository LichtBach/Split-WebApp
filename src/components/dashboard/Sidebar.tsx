import { Link, useLocation } from '@tanstack/react-router'
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    BarChart3,
    CreditCard,
    Settings,
    ChevronLeft,
    ChevronRight,
    Users,
    ClipboardList,
    CalendarDays,
    Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUIStore } from '@/store/uiStore'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Metrics', href: '/metrics', icon: BarChart3 },
    { name: 'Billing', href: '/billing', icon: CreditCard },
]

const adminNavigation = [
    { name: 'Task Management', href: '/admin/tasks', icon: ClipboardList },
    { name: 'Client Timeline', href: '/admin/timeline', icon: CalendarDays },
]

const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
    const location = useLocation()
    const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "relative flex flex-col sidebar-glass transition-all duration-300",
                    sidebarCollapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border/30 px-4">
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-violet-500/25">
                            <span className="text-sm font-bold text-white">AI</span>
                        </div>
                        {!sidebarCollapsed && (
                            <span className="font-semibold text-lg gradient-text">
                                Receptionist
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                            const NavItem = (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                                        sidebarCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!sidebarCollapsed && <span>{item.name}</span>}
                                </Link>
                            )

                            if (sidebarCollapsed) {
                                return (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                                        <TooltipContent side="right" className="font-medium">
                                            {item.name}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }

                            return NavItem
                        })}
                    </nav>

                    <Separator className="my-4" />

                    {/* Admin Section */}
                    {!sidebarCollapsed && (
                        <div className="px-4 mb-2">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Agency Admin
                            </span>
                        </div>
                    )}
                    <nav className="space-y-1 px-2">
                        {adminNavigation.map((item) => {
                            const isActive = location.pathname === item.href
                            const NavItem = (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        sidebarCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!sidebarCollapsed && <span>{item.name}</span>}
                                </Link>
                            )

                            if (sidebarCollapsed) {
                                return (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                                        <TooltipContent side="right" className="font-medium">
                                            {item.name}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }

                            return NavItem
                        })}
                    </nav>

                    <Separator className="my-4" />

                    <nav className="space-y-1 px-2">
                        {secondaryNavigation.map((item) => {
                            const isActive = location.pathname === item.href
                            const NavItem = (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        sidebarCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!sidebarCollapsed && <span>{item.name}</span>}
                                </Link>
                            )

                            if (sidebarCollapsed) {
                                return (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                                        <TooltipContent side="right" className="font-medium">
                                            {item.name}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }

                            return NavItem
                        })}
                    </nav>
                </ScrollArea>

                {/* Collapse Button */}
                <div className="border-t p-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={cn(
                            "w-full justify-center",
                            !sidebarCollapsed && "justify-start"
                        )}
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <>
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                <span>Collapse</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    )
}
