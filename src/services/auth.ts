import { supabase } from './supabase'
import type { User } from '@/types'

export interface AuthResponse {
    user: User | null
    error: string | null
}

// Sign up with email and password
export async function signUp(email: string, password: string, agencyName: string): Promise<AuthResponse> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    agency_name: agencyName,
                }
            }
        })

        if (error) throw error

        if (data.user) {
            // Create profile in our profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    email: data.user.email,
                    agency_name: agencyName,
                    role: 'admin',
                })

            if (profileError) {
                console.error('Profile creation error:', profileError)
            }

            return {
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                    agency_name: agencyName,
                    role: 'admin',
                    timezone: 'UTC',
                    notification_email: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                error: null
            }
        }

        return { user: null, error: 'Signup failed' }
    } catch (error) {
        return { user: null, error: (error as Error).message }
    }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResponse> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        if (data.user) {
            // Fetch profile from our profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single()

            if (profileError) {
                console.error('Profile fetch error:', profileError)
            }

            return {
                user: profile as User || {
                    id: data.user.id,
                    email: data.user.email!,
                    agency_name: '',
                    role: 'viewer',
                    timezone: 'UTC',
                    notification_email: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                error: null
            }
        }

        return { user: null, error: 'Login failed' }
    } catch (error) {
        return { user: null, error: (error as Error).message }
    }
}

// Sign in with Google OAuth
export async function signInWithGoogle(): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            }
        })

        if (error) throw error
        return { error: null }
    } catch (error) {
        return { error: (error as Error).message }
    }
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { error: null }
    } catch (error) {
        return { error: (error as Error).message }
    }
}

// Get current session
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
}

// Get current user with profile
export async function getCurrentUser(): Promise<AuthResponse> {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) throw error
        if (!user) return { user: null, error: null }

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
            // Profile might not exist yet, return basic user
            return {
                user: {
                    id: user.id,
                    email: user.email!,
                    agency_name: user.user_metadata?.agency_name || '',
                    role: 'viewer',
                    timezone: 'UTC',
                    notification_email: true,
                    created_at: user.created_at,
                    updated_at: user.updated_at || user.created_at,
                },
                error: null
            }
        }

        return { user: profile as User, error: null }
    } catch (error) {
        return { user: null, error: (error as Error).message }
    }
}

// Update user profile
export async function updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return { user: data as User, error: null }
    } catch (error) {
        return { user: null, error: (error as Error).message }
    }
}

// Password reset
export async function resetPassword(email: string): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        return { error: null }
    } catch (error) {
        return { error: (error as Error).message }
    }
}

// Auth state change listener
export function onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
            const { user } = await getCurrentUser()
            callback(user)
        } else {
            callback(null)
        }
    })
}
