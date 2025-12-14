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
            {/* Wrapper with padding to create offset from edge */}
            <div className="p-3 h-full">
                <div
                    className={cn(
                        "relative flex flex-col h-full rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all duration-300",
                        sidebarCollapsed ? "w-[70px]" : "w-[250px]"
                    )}
                >
                    {/* Logo */}
                    <div className="flex h-16 items-center border-b border-gray-200/50 dark:border-slate-700/50 px-4">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
                                <span className="text-sm font-bold text-white">AI</span>
                            </div>
                            {!sidebarCollapsed && (
                                <span className="font-semibold text-lg text-gray-800 dark:text-white">
                                    Receptionist
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 py-4">
                        <nav className="space-y-1 px-3">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href
                                const NavItem = (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-sm"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700",
                                            sidebarCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" />
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

                        <Separator className="my-4 bg-gray-200/50 dark:bg-slate-700/50" />

                        {/* Admin Section */}
                        {!sidebarCollapsed && (
                            <div className="px-4 mb-2">
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    Agency Admin
                                </span>
                            </div>
                        )}
                        <nav className="space-y-1 px-3">
                            {adminNavigation.map((item) => {
                                const isActive = location.pathname === item.href
                                const NavItem = (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700",
                                            sidebarCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" />
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

                        <Separator className="my-4 bg-gray-200/50 dark:bg-slate-700/50" />

                        <nav className="space-y-1 px-3">
                            {secondaryNavigation.map((item) => {
                                const isActive = location.pathname === item.href
                                const NavItem = (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700",
                                            sidebarCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <item.icon className="h-6 w-6 shrink-0" />
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
                    <div className="border-t border-gray-200/50 dark:border-slate-700/50 p-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className={cn(
                                "w-full justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700",
                                !sidebarCollapsed && "justify-start"
                            )}
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <>
                                    <ChevronLeft className="h-5 w-5 mr-2" />
                                    <span>Collapse</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}
