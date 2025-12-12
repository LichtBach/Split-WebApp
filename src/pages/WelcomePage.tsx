import { useNavigate } from '@tanstack/react-router'
import { WelcomeFlow } from '@/components/onboarding/WelcomeFlow'

export function WelcomePage() {
    const navigate = useNavigate()

    const handleComplete = (data: {
        fullName: string
        email: string
        phone: string
        preferredContact: 'email' | 'phone' | null
        expectations: string
        comments: string
    }) => {
        // In a real app, you'd save this data to your backend
        console.log('Onboarding completed:', data)

        // Store in localStorage for now
        localStorage.setItem('onboarding_data', JSON.stringify(data))
        localStorage.setItem('onboarding_completed', 'true')

        // Navigate to dashboard
        navigate({ to: '/dashboard' })
    }

    return <WelcomeFlow onComplete={handleComplete} />
}
