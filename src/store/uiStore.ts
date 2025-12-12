import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Toast } from '@/types'
import { generateId } from '@/lib/utils'

interface UIState {
    sidebarOpen: boolean
    sidebarCollapsed: boolean
    theme: 'light' | 'dark'
    toasts: Toast[]

    // Actions
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    setSidebarCollapsed: (collapsed: boolean) => void
    toggleTheme: () => void
    setTheme: (theme: 'light' | 'dark') => void
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            sidebarOpen: true,
            sidebarCollapsed: false,
            theme: 'dark',
            toasts: [],

            toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

            setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

            setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

            toggleTheme: () => {
                const newTheme = get().theme === 'dark' ? 'light' : 'dark'
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add(newTheme)
                set({ theme: newTheme })
            },

            setTheme: (theme) => {
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add(theme)
                set({ theme })
            },

            addToast: (toast) => {
                const id = generateId()
                const newToast = { ...toast, id }
                set(state => ({ toasts: [...state.toasts, newToast] }))

                // Auto-remove after duration (default 5s)
                const duration = toast.duration ?? 5000
                setTimeout(() => {
                    set(state => ({
                        toasts: state.toasts.filter(t => t.id !== id)
                    }))
                }, duration)
            },

            removeToast: (id) => set(state => ({
                toasts: state.toasts.filter(t => t.id !== id)
            })),
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({
                theme: state.theme,
                sidebarCollapsed: state.sidebarCollapsed,
            }),
        }
    )
)

// Initialize theme on load
if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('ui-storage')
    if (stored) {
        try {
            const { state } = JSON.parse(stored)
            if (state?.theme) {
                document.documentElement.classList.add(state.theme)
            }
        } catch {
            document.documentElement.classList.add('dark')
        }
    }
}
