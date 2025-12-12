import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { mockUser } from '@/services/mockData'

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean

    // Actions
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            }),

            setLoading: (isLoading) => set({ isLoading }),

            login: async (email: string, _password: string) => {
                set({ isLoading: true })

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800))

                // For development: use mock user
                // In production: replace with Supabase auth
                const user = { ...mockUser, email }

                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false
                })
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                })
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
