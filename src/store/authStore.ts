import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import * as authService from '@/services/auth'
import { hasSupabaseCredentials } from '@/services/supabase'
import { mockUser } from '@/services/mockData'

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null

    // Actions
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string, agencyName: string) => Promise<void>
    loginWithGoogle: () => Promise<void>
    logout: () => Promise<void>
    checkSession: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false,
                error: null,
            }),

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error, isLoading: false }),

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null })

                // Use mock data if no Supabase credentials
                if (!hasSupabaseCredentials) {
                    await new Promise(resolve => setTimeout(resolve, 800))
                    set({
                        user: { ...mockUser, email },
                        isAuthenticated: true,
                        isLoading: false,
                    })
                    return
                }

                const { user, error } = await authService.signIn(email, password)

                if (error) {
                    set({ error, isLoading: false })
                    return
                }

                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                })
            },

            signup: async (email: string, password: string, agencyName: string) => {
                set({ isLoading: true, error: null })

                if (!hasSupabaseCredentials) {
                    set({
                        error: 'Supabase not configured. Please add credentials to .env',
                        isLoading: false
                    })
                    return
                }

                const { user, error } = await authService.signUp(email, password, agencyName)

                if (error) {
                    set({ error, isLoading: false })
                    return
                }

                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                })
            },

            loginWithGoogle: async () => {
                set({ isLoading: true, error: null })

                if (!hasSupabaseCredentials) {
                    set({
                        error: 'Supabase not configured. Please add credentials to .env',
                        isLoading: false
                    })
                    return
                }

                const { error } = await authService.signInWithGoogle()

                if (error) {
                    set({ error, isLoading: false })
                }
                // OAuth redirects, so we don't need to set user here
            },

            logout: async () => {
                set({ isLoading: true })

                if (hasSupabaseCredentials) {
                    await authService.signOut()
                }

                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                })
            },

            checkSession: async () => {
                set({ isLoading: true })

                if (!hasSupabaseCredentials) {
                    // Keep existing persisted user if no credentials
                    set({ isLoading: false })
                    return
                }

                const { user, error } = await authService.getCurrentUser()

                if (error) {
                    console.error('Session check error:', error)
                    set({ isLoading: false })
                    return
                }

                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                })
            },

            resetPassword: async (email: string) => {
                set({ isLoading: true, error: null })

                if (!hasSupabaseCredentials) {
                    set({
                        error: 'Supabase not configured',
                        isLoading: false
                    })
                    return
                }

                const { error } = await authService.resetPassword(email)

                if (error) {
                    set({ error, isLoading: false })
                    return
                }

                set({ isLoading: false })
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            version: 2,
        }
    )
)

// Initialize auth state listener
if (hasSupabaseCredentials) {
    authService.onAuthStateChange((user) => {
        useAuthStore.getState().setUser(user)
    })
}
