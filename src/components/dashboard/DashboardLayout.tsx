import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
    title?: string
    subtitle?: string
}

export function DashboardLayout({ title, subtitle }: DashboardLayoutProps) {
    return (
        <div className="relative flex h-screen overflow-hidden">
            {/* Optimized gradient background with flares - using CSS only, no blur filters */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 50% at 20% 10%, rgba(255, 107, 0, 0.12) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 40% at 80% 20%, rgba(255, 140, 0, 0.10) 0%, transparent 50%),
                        radial-gradient(ellipse 50% 60% at 10% 80%, rgba(255, 107, 0, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse 70% 50% at 90% 70%, rgba(255, 165, 0, 0.08) 0%, transparent 50%),
                        linear-gradient(180deg, hsl(225 15% 8%) 0%, hsl(225 15% 6%) 50%, hsl(225 15% 10%) 100%)
                    `
                }}
            />

            {/* Static flare accents - no animations, uses will-change for GPU acceleration */}
            <div
                className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none z-0 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 107, 0, 0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    transform: 'translateZ(0)' // Force GPU layer
                }}
            />
            <div
                className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full pointer-events-none z-0 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 140, 0, 0.12) 0%, transparent 70%)',
                    filter: 'blur(35px)',
                    transform: 'translateZ(0)'
                }}
            />

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
