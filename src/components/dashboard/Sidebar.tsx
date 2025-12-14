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

// Simple icon without container
function NavIcon({ icon: Icon, isActive }: { icon: React.ElementType; isActive: boolean }) {
    return (
        <Icon
            strokeWidth={2.5}
            className={cn(
                "h-6 w-6 shrink-0 transition-colors duration-200",
                isActive
                    ? "text-orange-500"
                    : "text-gray-200 dark:text-black"
            )}
        />
    )
}

export function Sidebar() {
    const location = useLocation()
    const { sidebarCollapsed, setSidebarCollapsed } = useUIStore()

    return (
        <TooltipProvider delayDuration={0}>
            {/* Wrapper with padding to create offset from edge */}
            <div className="p-3 h-full">
                <div
                    className={cn(
                        "relative flex flex-col h-full rounded-2xl bg-gray-900 dark:bg-white backdrop-blur-lg shadow-2xl border border-gray-700/50 dark:border-gray-300/50 transition-all duration-300",
                        sidebarCollapsed ? "w-[76px]" : "w-[260px]"
                    )}
                >
                    {/* Logo */}
                    <div className="flex h-16 items-center border-b border-gray-700/50 dark:border-gray-300/50 px-4">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                                <span className="text-sm font-bold text-white">AI</span>
                            </div>
                            {!sidebarCollapsed && (
                                <span className="font-semibold text-lg text-white dark:text-gray-800">
                                    Receptionist
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 py-4">
                        <nav className="space-y-1.5 px-3">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href
                                const NavItem = (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-orange-500/15 text-orange-400 dark:text-orange-600"
                                                : "text-gray-300 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900",
                                            sidebarCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <NavIcon icon={item.icon} isActive={isActive} />
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

                        <Separator className="my-4 bg-gray-700/50 dark:bg-gray-300/50" />

                        {/* Admin Section */}
                        {!sidebarCollapsed && (
                            <div className="px-4 mb-2">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Agency Admin
                                </span>
                            </div>
                        )}
                        <nav className="space-y-1.5 px-3">
                            {adminNavigation.map((item) => {
                                const isActive = location.pathname === item.href
                                const NavItem = (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-orange-500/15 text-orange-400 dark:text-orange-600"
                                                : "text-gray-300 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900",
                                            sidebarCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <NavIcon icon={item.icon} isActive={isActive} />
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

                        <Separator className="my-4 bg-gray-700/50 dark:bg-gray-300/50" />

                        <nav className="space-y-1.5 px-3">
                            {secondaryNavigation.map((item) => {
                                const isActive = location.pathname === item.href
                                const NavItem = (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-orange-500/15 text-orange-400 dark:text-orange-600"
                                                : "text-gray-300 dark:text-gray-600 hover:bg-white/5 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900",
                                            sidebarCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <NavIcon icon={item.icon} isActive={isActive} />
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
                    <div className="border-t border-gray-700/50 dark:border-gray-300/50 p-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className={cn(
                                "w-full justify-center text-gray-400 dark:text-gray-600 hover:bg-white/10 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900",
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
