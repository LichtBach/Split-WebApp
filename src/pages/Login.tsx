import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { hasSupabaseCredentials } from '@/services/supabase'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { login, isLoading, error } = useAuthStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: hasSupabaseCredentials ? '' : 'demo@agency.com',
            password: hasSupabaseCredentials ? '' : 'demo123',
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password)
            const authState = useAuthStore.getState()
            if (authState.isAuthenticated) {
                navigate({ to: '/dashboard' })
            }
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#dd3333]/10 via-transparent to-[#dd3333]/10 pointer-events-none" />

            <div className="w-full max-w-md relative animate-fade-in">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#dd3333] to-[#b52828] shadow-lg shadow-red-500/25">
                        <span className="text-sm font-bold text-white">DRA</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#dd3333] to-[#b52828] bg-clip-text text-transparent">Onboarding</span>
                </div>

                <Card className="border shadow-xl">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to your dashboard to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        className="pl-10"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Demo Notice */}
                        {!hasSupabaseCredentials && (
                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <p className="text-xs text-center text-muted-foreground">
                                    <strong>Demo Mode:</strong> Click Sign In to access the dashboard with sample data.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Footer - Removed Sign Up link */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    New client?{' '}
                    <a href="/welcome" className="text-primary hover:underline font-medium">
                        Start Onboarding
                    </a>
                </p>
            </div>
        </div>
    )
}
