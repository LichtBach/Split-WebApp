import { useNavigate } from '@tanstack/react-router'
import { WelcomeFlow } from '@/components/onboarding/WelcomeFlow'

interface ContactPerson {
    name: string
    email: string
}

interface TechStack {
    website: string[]
    mobileApp: string[]
    crm: string[]
    cookieManagement: string[]
}

interface FormData {
    name: string
    email: string
    phone: string
    companyName: string
    otherContacts: ContactPerson[]
    techStack: TechStack
    objective: string
}

export function WelcomePage() {
    const navigate = useNavigate()

    const handleComplete = (data: FormData) => {
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
