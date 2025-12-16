import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/store/uiStore'

interface DashboardLayoutProps {
    title?: string
    subtitle?: string
}

export function DashboardLayout({ title, subtitle }: DashboardLayoutProps) {
    const { theme } = useUIStore()
    const isLight = theme === 'light'

    return (
        <div className="relative flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Subtle background for dark mode only */}
            {!isLight && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 80% 50% at 20% 10%, rgba(255, 107, 0, 0.08) 0%, transparent 50%),
                            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(255, 140, 0, 0.06) 0%, transparent 50%)
                        `
                    }}
                />
            )}

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="relative flex flex-1 flex-col overflow-hidden z-10">
                {/* Header */}
                <Header title={title} subtitle={subtitle} />

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
