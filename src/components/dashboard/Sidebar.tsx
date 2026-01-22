import { Link, useLocation } from '@tanstack/react-router'
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    CreditCard,
    UserCircle,
    ChevronLeft,
    ChevronRight,
    Users,
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
    { name: 'Deliverables', href: '/deliverables', icon: FileText },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Billing', href: '/billing', icon: CreditCard },
]



const secondaryNavigation = [
    { name: 'Profile', href: '/profile', icon: UserCircle },
]

// Simple icon without container
function NavIcon({ icon: Icon, isActive }: { icon: React.ElementType; isActive: boolean }) {
    return (
        <Icon
            strokeWidth={2.5}
            className={cn(
                "h-6 w-6 shrink-0 transition-colors duration-200",
                isActive
                    ? "text-[#dd3333]"
                    : "text-gray-600 dark:text-gray-300"
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
                        "relative flex flex-col h-full rounded-2xl bg-white dark:bg-[#141414] shadow-xl border border-gray-200 dark:border-gray-700/50 transition-all duration-300",
                        sidebarCollapsed ? "w-[76px]" : "w-[260px]"
                    )}
                >
                    {/* Logo */}
                    <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700/50 px-4">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <img
                                src="/logo.jpg"
                                alt="demoAgency"
                                className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-black/10"
                            />
                            {!sidebarCollapsed && (
                                <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                    Client portal
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
                                                ? "bg-[#dd3333]/15 text-[#dd3333]"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
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

                        <Separator className="my-4 bg-gray-200 dark:bg-gray-700/50" />

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
                                                ? "bg-[#dd3333]/15 text-[#dd3333]"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
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
                                "w-full justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white",
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
