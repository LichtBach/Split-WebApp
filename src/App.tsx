import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './router'
import { useEffect } from 'react'
import { useUIStore } from '@/store/uiStore'
import { ProjectDetailModal } from '@/components/projects/ProjectDetailModal'

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
})

function ThemeInitializer() {
    const { theme } = useUIStore()

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
    }, [theme])

    return null
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeInitializer />
            <RouterProvider router={router} />
            <ProjectDetailModal />
        </QueryClientProvider>
    )
}

export default App
