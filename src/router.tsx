import {
    createRouter,
    createRootRoute,
    createRoute,
    Outlet,
    redirect,
} from '@tanstack/react-router'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { LoginPage } from '@/pages/Login'
import { SignupPage } from '@/pages/Signup'
import { Dashboard } from '@/pages/Dashboard'
import { DeliverablesPage } from '@/pages/DeliverablesPage'
import { TasksPage } from '@/pages/TasksPage'
import { BillingPage } from '@/pages/BillingPage'
import { TeamPage } from '@/pages/TeamPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { WelcomePage } from '@/pages/WelcomePage'
import { ProfilePage } from '@/pages/ProfilePage'

// Root route
const rootRoute = createRootRoute({
    component: () => <Outlet />,
})

// Public routes - login page 
const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
})

// Welcome/onboarding flow - standalone page
const welcomeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/welcome',
    component: WelcomePage,
})

// Signup page
const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: SignupPage,
})

// Dashboard layout wrapper route - NO AUTH REQUIRED FOR NOW
const dashboardLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'dashboard-layout',
    component: DashboardLayout,
})

// Dashboard routes (children of layout)
const dashboardRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/dashboard',
    component: Dashboard,
})

const deliverablesRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/deliverables',
    component: DeliverablesPage,
})

const tasksRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/tasks',
    component: TasksPage,
})

const billingRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/billing',
    component: BillingPage,
})

const teamRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/team',
    component: TeamPage,
})

const calendarRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/calendar',
    component: CalendarPage,
})

const profileRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: '/profile',
    component: ProfilePage,
})

// Index redirect - go directly to dashboard
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({ to: '/dashboard' })
    },
})

// Not found route
const notFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '*',
    component: () => (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-muted-foreground">Page not found</p>
            </div>
        </div>
    ),
})

// Build route tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    signupRoute,
    welcomeRoute,
    dashboardLayoutRoute.addChildren([
        dashboardRoute,
        deliverablesRoute,
        tasksRoute,
        calendarRoute,
        billingRoute,
        teamRoute,
        profileRoute,
    ]),
    notFoundRoute,
])

// Create router
export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
})

// Type declarations for TypeScript
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
