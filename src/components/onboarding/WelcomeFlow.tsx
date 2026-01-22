import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Mail,
    Phone,
    Building2,
    Users,
    Layers,
    Target,
    ChevronRight,
    ChevronLeft,
    Check,
    Globe,
    Smartphone,
    Database,
    Cookie,
    Plus,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// DRA Brand Colors
const ACCENT_COLOR = '#dd3333'
const ACCENT_COLOR_RGB = '221, 51, 51'
const ACCENT_DARK = '#b52828'

// Technology stack options by category
const techStackOptions = {
    website: {
        label: 'Website Platform',
        icon: Globe,
        options: [
            'WordPress',
            'Shopify',
            'WooCommerce',
            'Magento',
            'PrestaShop',
            'Wix',
            'Squarespace',
            'Webflow',
            'Custom HTML/CSS',
            'Next.js',
            'React',
            'Vue.js',
            'Angular',
            'Nothing',
            'Custom'
        ]
    },
    mobileApp: {
        label: 'Mobile App',
        icon: Smartphone,
        options: [
            'iOS Native',
            'Android Native',
            'React Native',
            'Flutter',
            'Ionic',
            'PWA',
            'Nothing',
            'Custom'
        ]
    },
    crm: {
        label: 'CRM System',
        icon: Database,
        options: [
            'Salesforce',
            'HubSpot',
            'Zoho CRM',
            'Pipedrive',
            'Monday.com',
            'Freshsales',
            'Microsoft Dynamics',
            'SAP CRM',
            'Nothing',
            'Custom'
        ]
    },
    cookieManagement: {
        label: 'Cookie Management',
        icon: Cookie,
        options: [
            'Cookiebot',
            'OneTrust',
            'CookieYes',
            'Termly',
            'Complianz',
            'Cookie Script',
            'Osano',
            'Nothing',
            'Custom'
        ]
    }
}

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

const steps = [
    { id: 'name', title: "Let's get started", subtitle: "What's your name?", icon: User },
    { id: 'email', title: "Stay connected", subtitle: "What's your email address?", icon: Mail },
    { id: 'phone', title: "Direct line", subtitle: "What's your phone number?", icon: Phone },
    { id: 'company', title: "Your company", subtitle: "What's your company name?", icon: Building2 },
    { id: 'contacts', title: "Team contacts", subtitle: "Add other contact persons (optional)", icon: Users },
    { id: 'techStack', title: "Your tech stack", subtitle: "What technologies do you use?", icon: Layers },
    { id: 'objective', title: "Your goals", subtitle: "What do you want to achieve?", icon: Target },
    { id: 'complete', title: "Welcome aboard!", subtitle: "You're all set!", icon: Check },
]

// Creative messages shown after each step completion
const creativeMessages: Record<string, string[]> = {
    name: [
        "Great to meet you! ✨",
        "What a wonderful name!",
        "Perfect, let's continue this journey together.",
    ],
    email: [
        "Perfect! We'll keep you updated. 📧",
        "Great, now we can stay in touch!",
        "Your inbox is about to get more interesting!",
    ],
    phone: [
        "Direct line secured! 📞",
        "We'll only call when it matters.",
        "Great, now we can connect instantly!",
    ],
    company: [
        "Exciting! We love working with great companies. 🏢",
        "Noted! Let's make your company shine.",
        "Perfect, we can't wait to help you grow!",
    ],
    contacts: [
        "Team coordination is key! 👥",
        "Great, everyone will be in the loop.",
        "Perfect team setup!",
    ],
    techStack: [
        "Excellent tech choices! 🛠️",
        "We know these tools well!",
        "Perfect, we'll integrate seamlessly!",
    ],
    objective: [
        "We love your vision! Consider it done. 🎯",
        "This is exactly what we excel at!",
        "Challenge accepted! We're on it. 💪",
    ],
}

// Floating orb component for background glow
function FloatingOrb({ className, delay = 0, color }: { className?: string; delay?: number; color?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [0.8, 1.2, 0.8],
                y: [0, -40, 0],
                x: [0, 30, 0]
            }}
            transition={{
                duration: 12,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }}
            className={cn(
                "absolute rounded-full blur-3xl",
                className
            )}
            style={{ backgroundColor: color }}
        />
    )
}

// Progress indicator
function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    const progress = ((currentStep) / (totalSteps - 1)) * 100

    return (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 z-20">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    className="h-full"
                    style={{ background: `linear-gradient(to right, ${ACCENT_COLOR}, ${ACCENT_DARK})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-xs text-white/50">Step {currentStep + 1}</span>
                <span className="text-xs text-white/50">{totalSteps} total</span>
            </div>
        </div>
    )
}

// Typewriter Text Component
function TypewriterText({
    text,
    speed = 40,
}: {
    text: string
    speed?: number
}) {
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(true)

    useState(() => {
        let index = 0
        setIsTyping(true)
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1))
                index++
            } else {
                clearInterval(typeInterval)
                setIsTyping(false)
            }
        }, speed)
        return () => clearInterval(typeInterval)
    })

    return (
        <span className="inline">
            {displayedText}
            {isTyping && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-current ml-0.5 align-middle"
                />
            )}
        </span>
    )
}

// Tech Stack Option Chip
function TechChip({
    label,
    selected,
    onClick
}: {
    label: string
    selected: boolean
    onClick: () => void
}) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                selected
                    ? "text-white border-transparent"
                    : "text-white/70 border-white/20 bg-white/5 hover:border-white/40"
            )}
            style={selected ? {
                backgroundColor: ACCENT_COLOR,
                boxShadow: `0 4px 15px rgba(${ACCENT_COLOR_RGB}, 0.4)`
            } : {}}
        >
            {label}
        </motion.button>
    )
}

// Tech Category Section
function TechCategory({
    category,
    label,
    icon: Icon,
    options,
    selected,
    onToggle
}: {
    category: string
    label: string
    icon: React.ElementType
    options: string[]
    selected: string[]
    onToggle: (option: string) => void
}) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
                <span className="text-white font-medium">{label}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <TechChip
                        key={`${category}-${option}`}
                        label={option}
                        selected={selected.includes(option)}
                        onClick={() => onToggle(option)}
                    />
                ))}
            </div>
        </div>
    )
}

export function WelcomeFlow({ onComplete }: { onComplete: (data: FormData) => void }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        otherContacts: [],
        techStack: {
            website: [],
            mobileApp: [],
            crm: [],
            cookieManagement: []
        },
        objective: '',
    })
    const [direction, setDirection] = useState(1)
    const [showMessage, setShowMessage] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [newContact, setNewContact] = useState<ContactPerson>({ name: '', email: '' })

    const currentStepData = steps[currentStep]
    const isLastStep = currentStep === steps.length - 1
    const isComplete = currentStep === steps.length - 1

    const canProceed = () => {
        switch (currentStepData.id) {
            case 'name':
                return formData.name.trim().length >= 2
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
            case 'phone':
                return formData.phone.trim().length >= 6
            case 'company':
                return formData.companyName.trim().length >= 2
            case 'contacts':
                return true // Optional step
            case 'techStack':
                return true // Optional but encouraged
            case 'objective':
                return formData.objective.trim().length >= 10
            default:
                return true
        }
    }

    const getRandomMessage = (stepId: string) => {
        const messages = creativeMessages[stepId] || []
        return messages[Math.floor(Math.random() * messages.length)] || ''
    }

    const handleNext = () => {
        if (canProceed() && currentStep < steps.length - 1) {
            const stepId = currentStepData.id
            if (creativeMessages[stepId]) {
                setCurrentMessage(getRandomMessage(stepId))
                setShowMessage(true)

                setTimeout(() => {
                    setShowMessage(false)
                    setTimeout(() => {
                        setDirection(1)
                        setCurrentStep(prev => prev + 1)
                    }, 300)
                }, 2000)
            } else {
                setDirection(1)
                setCurrentStep(prev => prev + 1)
            }
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setShowMessage(false)
            setDirection(-1)
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && canProceed() && !isLastStep && !showMessage) {
            handleNext()
        }
    }

    const handleComplete = () => {
        onComplete(formData)
    }

    const addContact = () => {
        if (newContact.name.trim() && newContact.email.trim()) {
            setFormData({
                ...formData,
                otherContacts: [...formData.otherContacts, { ...newContact }]
            })
            setNewContact({ name: '', email: '' })
        }
    }

    const removeContact = (index: number) => {
        setFormData({
            ...formData,
            otherContacts: formData.otherContacts.filter((_, i) => i !== index)
        })
    }

    const toggleTechOption = (category: keyof TechStack, option: string) => {
        const current = formData.techStack[category]
        const updated = current.includes(option)
            ? current.filter(o => o !== option)
            : [...current, option]
        setFormData({
            ...formData,
            techStack: { ...formData.techStack, [category]: updated }
        })
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 400 : -400,
            opacity: 0,
            scale: 0.85,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 400 : -400,
            opacity: 0,
            scale: 0.85,
        }),
    }

    const renderStepContent = () => {
        const StepIcon = currentStepData.icon

        return (
            <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 25,
                    duration: 0.8
                }}
                className="absolute inset-0 flex flex-col items-center justify-center px-4 overflow-y-auto py-20"
                onKeyDown={handleKeyDown}
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 120, duration: 0.8 }}
                    className="mb-8 flex-shrink-0"
                >
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-full blur-xl"
                            style={{
                                backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.4)`,
                                animation: 'pulse 3s ease-in-out infinite'
                            }}
                        />
                        <div
                            className="relative w-20 h-20 rounded-full glass-card flex items-center justify-center"
                            style={{ borderColor: `rgba(${ACCENT_COLOR_RGB}, 0.3)`, borderWidth: '1px' }}
                        >
                            <StepIcon className="w-8 h-8" style={{ color: ACCENT_COLOR }} />
                        </div>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-2 text-center flex-shrink-0"
                >
                    {currentStepData.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.6 }}
                    className="text-lg text-white/60 mb-8 text-center flex-shrink-0"
                >
                    {currentStepData.subtitle}
                </motion.p>

                {/* Input Field */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="w-full max-w-xl px-4"
                >
                    {currentStepData.id === 'name' && (
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-16 md:h-18 text-xl md:text-2xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all rounded-2xl px-6 focus:border-[#dd3333]/60 focus:ring-[#dd3333]/30"
                        />
                    )}

                    {currentStepData.id === 'email' && (
                        <Input
                            autoFocus
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-16 md:h-18 text-xl md:text-2xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all rounded-2xl px-6 focus:border-[#dd3333]/60 focus:ring-[#dd3333]/30"
                        />
                    )}

                    {currentStepData.id === 'phone' && (
                        <Input
                            autoFocus
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-16 md:h-18 text-xl md:text-2xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all rounded-2xl px-6 focus:border-[#dd3333]/60 focus:ring-[#dd3333]/30"
                        />
                    )}

                    {currentStepData.id === 'company' && (
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Your company name"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="h-16 md:h-18 text-xl md:text-2xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all rounded-2xl px-6 focus:border-[#dd3333]/60 focus:ring-[#dd3333]/30"
                        />
                    )}

                    {currentStepData.id === 'contacts' && (
                        <div className="space-y-4">
                            {/* Existing contacts */}
                            {formData.otherContacts.map((contact, index) => (
                                <div key={index} className="flex items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{contact.name}</p>
                                        <p className="text-white/60 text-sm">{contact.email}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeContact(index)}
                                        className="text-white/50 hover:text-white hover:bg-white/10"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {/* Add new contact form */}
                            <div className="space-y-3">
                                <Input
                                    type="text"
                                    placeholder="Contact name"
                                    value={newContact.name}
                                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                    className="h-14 text-lg bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-xl px-4 focus:border-[#dd3333]/60 focus:ring-[#dd3333]/30"
                                />
                                <Input
                                    type="email"
                                    placeholder="Contact email"
                                    value={newContact.email}
                                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                    className="h-14 text-lg bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-xl px-4 focus:border-[#dd3333]/60 focus:ring-[#dd3333]/30"
                                />
                                <Button
                                    onClick={addContact}
                                    disabled={!newContact.name.trim() || !newContact.email.trim()}
                                    className="w-full h-12 rounded-xl"
                                    style={{ backgroundColor: ACCENT_COLOR }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Contact
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStepData.id === 'techStack' && (
                        <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-2">
                            {Object.entries(techStackOptions).map(([key, { label, icon, options }]) => (
                                <TechCategory
                                    key={key}
                                    category={key}
                                    label={label}
                                    icon={icon}
                                    options={options}
                                    selected={formData.techStack[key as keyof TechStack]}
                                    onToggle={(option) => toggleTechOption(key as keyof TechStack, option)}
                                />
                            ))}
                        </div>
                    )}

                    {currentStepData.id === 'objective' && (
                        <Textarea
                            autoFocus
                            placeholder="Tell us about your goals and what you hope to achieve with Data Revolt Agency..."
                            value={formData.objective}
                            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                            rows={6}
                            className="text-xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all resize-none rounded-2xl p-5 focus:border-[#dd3333]/60 focus:ring-[#dd3333]/30 min-h-[200px]"
                        />
                    )}

                    {currentStepData.id === 'complete' && (
                        <div className="text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                className="relative inline-block"
                            >
                                <div
                                    className="absolute inset-0 rounded-full blur-2xl animate-pulse"
                                    style={{ backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.5)` }}
                                />
                                <div
                                    className="relative w-24 h-24 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: ACCENT_COLOR }}
                                >
                                    <Check className="w-12 h-12 text-white" />
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                <p className="text-white/60 text-lg">
                                    Thank you, <span className="text-white font-semibold">{formData.name}</span>!<br />
                                    We're excited to work with <span className="text-white font-semibold">{formData.companyName}</span>.
                                </p>
                                <p className="text-white/40 text-base">
                                    Our team will review your submission and get back to you shortly.
                                </p>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] overflow-hidden">
            {/* Animated Background with DRA Red */}
            <div className="absolute inset-0">
                <FloatingOrb
                    className="w-[600px] h-[600px] top-[-200px] left-[-200px]"
                    color={`rgba(${ACCENT_COLOR_RGB}, 0.15)`}
                />
                <FloatingOrb
                    className="w-[500px] h-[500px] bottom-[-150px] right-[-100px]"
                    color={`rgba(${ACCENT_COLOR_RGB}, 0.12)`}
                    delay={2}
                />
                <FloatingOrb
                    className="w-[400px] h-[400px] top-[30%] right-[10%]"
                    color="rgba(181, 40, 40, 0.08)"
                    delay={4}
                />
            </div>

            {/* DRA Logo */}
            <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dd3333] to-[#b52828] shadow-lg shadow-red-500/30">
                    <span className="text-xs font-bold text-white">DRA</span>
                </div>
                <span className="font-semibold text-lg text-white">Onboarding</span>
            </div>

            {/* Progress Bar */}
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

            {/* Creative Message Overlay */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: -20 }}
                            className="text-center px-8"
                        >
                            <div
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                style={{ textShadow: `0 0 40px rgba(${ACCENT_COLOR_RGB}, 0.5)` }}
                            >
                                <TypewriterText text={currentMessage} speed={35} />
                            </div>
                            <motion.div
                                className="h-1 w-32 mx-auto rounded-full mt-6"
                                style={{ background: `linear-gradient(to right, ${ACCENT_COLOR}, ${ACCENT_DARK})` }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.8, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="relative h-full flex flex-col items-center justify-center z-10">
                <AnimatePresence mode="wait" custom={direction}>
                    {renderStepContent()}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            {!showMessage && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                    {currentStep > 0 && !isComplete && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={handlePrev}
                                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-14 px-6"
                            >
                                <ChevronLeft className="mr-2 h-5 w-5" />
                                Back
                            </Button>
                        </motion.div>
                    )}

                    {!isLastStep ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="rounded-xl h-14 px-8 text-white font-semibold shadow-lg disabled:opacity-50"
                                style={{
                                    background: `linear-gradient(to right, ${ACCENT_COLOR}, ${ACCENT_DARK})`,
                                    boxShadow: canProceed() ? `0 10px 30px rgba(${ACCENT_COLOR_RGB}, 0.4)` : 'none'
                                }}
                            >
                                Continue
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button
                                size="lg"
                                onClick={handleComplete}
                                className="rounded-xl h-14 px-8 text-white font-semibold shadow-lg"
                                style={{
                                    background: `linear-gradient(to right, ${ACCENT_COLOR}, ${ACCENT_DARK})`,
                                    boxShadow: `0 10px 30px rgba(${ACCENT_COLOR_RGB}, 0.4)`
                                }}
                            >
                                Go to Dashboard
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    )
}

export default WelcomeFlow
