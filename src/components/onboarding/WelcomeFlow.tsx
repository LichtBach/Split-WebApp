import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User,
    Mail,
    Phone,
    MessageSquare,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Check,
    Star,
    Bot,
    Zap,
    Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Orange accent color: #FF6B00
const ACCENT_COLOR = '#FF6B00'
const ACCENT_COLOR_RGB = '255, 107, 0'

export type ServiceType = 'voice_agent' | 'automation' | 'both' | null

interface FormData {
    fullName: string
    email: string
    phone: string
    preferredContact: 'email' | 'phone' | null
    serviceType: ServiceType
    expectations: string
    comments: string
}

const steps = [
    { id: 'name', title: "Let's get to know you", subtitle: "What's your name?", icon: User },
    { id: 'email', title: "Stay connected", subtitle: "What's your email address?", icon: Mail },
    { id: 'phone', title: "Direct line", subtitle: "What's your phone number?", icon: Phone },
    { id: 'contact', title: "Your preference", subtitle: "How would you like us to reach you?", icon: MessageSquare },
    { id: 'serviceType', title: "Your solution", subtitle: "What service are you interested in?", icon: Zap },
    { id: 'expectations', title: "Your vision", subtitle: "What are your expectations from us?", icon: Sparkles },
    { id: 'comments', title: "Anything else?", subtitle: "Important mentions or comments", icon: Star },
    { id: 'complete', title: "Welcome aboard", subtitle: "You're all set!", icon: Check },
]

// Creative messages shown after each step completion
const creativeMessages: Record<string, string[]> = {
    name: [
        "Great to meet you! ✨",
        "What a wonderful name!",
        "Perfect, let's continue this journey together.",
    ],
    email: [
        "Excellent! We'll keep your inbox interesting. 📬",
        "Got it! Expect nothing but value.",
        "Perfect, we promise no spam. 💯",
    ],
    phone: [
        "Direct line secured! 📞",
        "We'll only call when it matters.",
        "Great, now we can connect instantly!",
    ],
    contact: [
        "Smart choice! We'll respect your preference. 💬",
        "Noted! Communication your way.",
        "Perfect, we're aligned!",
    ],
    serviceType: [
        "Excellent choice! This will transform your business. 🚀",
        "Amazing! You're going to love what we build together.",
        "Perfect fit! Let's make magic happen. ✨",
    ],
    expectations: [
        "We love your vision! Consider it done. 🎯",
        "This is exactly what we excel at!",
        "Challenge accepted! We're on it. 💪",
    ],
    comments: [
        "Thanks for sharing! This helps us serve you better. 🙏",
        "Noted! Every detail matters to us.",
        "Perfect, we've captured everything!",
    ],
}

// Typewriter Text Component
function TypewriterText({
    text,
    speed = 40,
    delay = 0,
    onComplete
}: {
    text: string
    speed?: number
    delay?: number
    onComplete?: () => void
}) {
    const [displayedText, setDisplayedText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        setDisplayedText('')
        setIsTyping(false)

        const startDelay = setTimeout(() => {
            setIsTyping(true)
            let index = 0

            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    setDisplayedText(text.slice(0, index + 1))
                    index++
                } else {
                    clearInterval(typeInterval)
                    setIsTyping(false)
                    onComplete?.()
                }
            }, speed)

            return () => clearInterval(typeInterval)
        }, delay)

        return () => clearTimeout(startDelay)
    }, [text, speed, delay, onComplete])

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
                    style={{ background: `linear-gradient(to right, ${ACCENT_COLOR}, #FF8C00)` }}
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

// Step indicator dots
function StepDots({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "w-2 h-2 rounded-full transition-all duration-500",
                        i === currentStep
                            ? "w-6"
                            : ""
                    )}
                    style={{
                        backgroundColor: i === currentStep
                            ? ACCENT_COLOR
                            : i < currentStep
                                ? `rgba(${ACCENT_COLOR_RGB}, 0.5)`
                                : 'rgba(255, 255, 255, 0.2)'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                />
            ))}
        </div>
    )
}

// Service Type Option Component
function ServiceTypeOption({
    selected,
    onClick,
    icon: Icon,
    title,
    description
}: {
    type: ServiceType
    selected: boolean
    onClick: () => void
    icon: React.ElementType
    title: string
    description: string
}) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{
                scale: 1.03,
                y: -5,
                boxShadow: selected
                    ? `0 20px 50px rgba(${ACCENT_COLOR_RGB}, 0.4)`
                    : '0 20px 40px rgba(255, 255, 255, 0.05)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "flex-1 p-6 rounded-3xl border-2 relative overflow-hidden text-left",
                selected
                    ? ""
                    : "border-white/10 bg-white/5 hover:border-white/30"
            )}
            style={selected ? {
                borderColor: ACCENT_COLOR,
                backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.15)`,
                boxShadow: `0 10px 40px rgba(${ACCENT_COLOR_RGB}, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
            } : {}}
        >
            {selected && (
                <motion.div
                    className="absolute inset-0 -z-10"
                    style={{
                        background: `radial-gradient(circle at center, rgba(${ACCENT_COLOR_RGB}, 0.2) 0%, transparent 70%)`
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            )}

            <motion.div
                animate={selected ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 0.5 }}
                className="mb-3"
            >
                <Icon
                    className="w-10 h-10 transition-all duration-300"
                    style={{
                        color: selected ? ACCENT_COLOR : 'rgba(255,255,255,0.5)',
                        filter: selected ? `drop-shadow(0 0 10px ${ACCENT_COLOR})` : 'none'
                    }}
                />
            </motion.div>
            <span className={cn(
                "block text-lg font-semibold transition-all duration-300",
                selected ? "text-white" : "text-white/70"
            )}>
                {title}
            </span>
            <span className="block text-sm text-white/40 mt-1">
                {description}
            </span>
        </motion.button>
    )
}

export function WelcomeFlow({ onComplete }: { onComplete: (data: FormData) => void }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        preferredContact: null,
        serviceType: null,
        expectations: '',
        comments: '',
    })
    const [direction, setDirection] = useState(1)
    const [showMessage, setShowMessage] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')

    const currentStepData = steps[currentStep]
    const isLastStep = currentStep === steps.length - 1
    const isComplete = currentStep === steps.length - 1

    const canProceed = () => {
        switch (currentStepData.id) {
            case 'name':
                return formData.fullName.trim().length >= 2
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
            case 'phone':
                return formData.phone.trim().length >= 6
            case 'contact':
                return formData.preferredContact !== null
            case 'serviceType':
                return formData.serviceType !== null
            case 'expectations':
                return formData.expectations.trim().length >= 10
            case 'comments':
                return true
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
            // Show creative message first
            const stepId = currentStepData.id
            if (creativeMessages[stepId]) {
                setCurrentMessage(getRandomMessage(stepId))
                setShowMessage(true)

                // Wait for message to display, then advance
                setTimeout(() => {
                    setShowMessage(false)
                    setTimeout(() => {
                        setDirection(1)
                        setCurrentStep(prev => prev + 1)
                    }, 300)
                }, 2500)
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
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
                onKeyDown={handleKeyDown}
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 120, duration: 0.8 }}
                    className="mb-8"
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
                    className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
                >
                    {currentStepData.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.6 }}
                    className="text-lg text-white/60 mb-8 text-center"
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
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="h-16 md:h-18 text-xl md:text-2xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all rounded-2xl px-6 focus:border-orange-500/60 focus:ring-orange-500/30"
                        />
                    )}

                    {currentStepData.id === 'email' && (
                        <Input
                            autoFocus
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-16 md:h-18 text-xl md:text-2xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all rounded-2xl px-6 focus:border-orange-500/60 focus:ring-orange-500/30"
                        />
                    )}

                    {currentStepData.id === 'phone' && (
                        <Input
                            autoFocus
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-16 md:h-18 text-xl md:text-2xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all rounded-2xl px-6 focus:border-orange-500/60 focus:ring-orange-500/30"
                        />
                    )}

                    {currentStepData.id === 'contact' && (
                        <div className="flex flex-col sm:flex-row gap-6">
                            <motion.button
                                onClick={() => setFormData({ ...formData, preferredContact: 'email' })}
                                whileHover={{
                                    scale: 1.03,
                                    y: -5,
                                    boxShadow: formData.preferredContact === 'email'
                                        ? `0 20px 50px rgba(${ACCENT_COLOR_RGB}, 0.4)`
                                        : '0 20px 40px rgba(255, 255, 255, 0.05)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={cn(
                                    "flex-1 p-10 rounded-3xl border-2 relative overflow-hidden",
                                    formData.preferredContact === 'email'
                                        ? ""
                                        : "border-white/10 bg-white/5 hover:border-white/30"
                                )}
                                style={formData.preferredContact === 'email' ? {
                                    borderColor: ACCENT_COLOR,
                                    backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.15)`,
                                    boxShadow: `0 10px 40px rgba(${ACCENT_COLOR_RGB}, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                                } : {}}
                            >
                                {formData.preferredContact === 'email' && (
                                    <motion.div
                                        className="absolute inset-0 -z-10"
                                        style={{
                                            background: `radial-gradient(circle at center, rgba(${ACCENT_COLOR_RGB}, 0.2) 0%, transparent 70%)`
                                        }}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}

                                <motion.div
                                    animate={formData.preferredContact === 'email' ? {
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Mail
                                        className="w-14 h-14 mb-4 mx-auto transition-all duration-300"
                                        style={{
                                            color: formData.preferredContact === 'email' ? ACCENT_COLOR : 'rgba(255,255,255,0.5)',
                                            filter: formData.preferredContact === 'email' ? `drop-shadow(0 0 10px ${ACCENT_COLOR})` : 'none'
                                        }}
                                    />
                                </motion.div>
                                <span className={cn(
                                    "block text-xl font-semibold transition-all duration-300",
                                    formData.preferredContact === 'email' ? "text-white" : "text-white/70"
                                )}>
                                    Email
                                </span>
                                <span className="block text-sm text-white/40 mt-2">
                                    We'll send updates via email
                                </span>
                            </motion.button>

                            <motion.button
                                onClick={() => setFormData({ ...formData, preferredContact: 'phone' })}
                                whileHover={{
                                    scale: 1.03,
                                    y: -5,
                                    boxShadow: formData.preferredContact === 'phone'
                                        ? `0 20px 50px rgba(${ACCENT_COLOR_RGB}, 0.4)`
                                        : '0 20px 40px rgba(255, 255, 255, 0.05)'
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={cn(
                                    "flex-1 p-10 rounded-3xl border-2 relative overflow-hidden",
                                    formData.preferredContact === 'phone'
                                        ? ""
                                        : "border-white/10 bg-white/5 hover:border-white/30"
                                )}
                                style={formData.preferredContact === 'phone' ? {
                                    borderColor: ACCENT_COLOR,
                                    backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.15)`,
                                    boxShadow: `0 10px 40px rgba(${ACCENT_COLOR_RGB}, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                                } : {}}
                            >
                                {formData.preferredContact === 'phone' && (
                                    <motion.div
                                        className="absolute inset-0 -z-10"
                                        style={{
                                            background: `radial-gradient(circle at center, rgba(${ACCENT_COLOR_RGB}, 0.2) 0%, transparent 70%)`
                                        }}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.8, 0.5]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}

                                <motion.div
                                    animate={formData.preferredContact === 'phone' ? {
                                        scale: [1, 1.1, 1],
                                        rotate: [0, -5, 5, 0]
                                    } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Phone
                                        className="w-14 h-14 mb-4 mx-auto transition-all duration-300"
                                        style={{
                                            color: formData.preferredContact === 'phone' ? ACCENT_COLOR : 'rgba(255,255,255,0.5)',
                                            filter: formData.preferredContact === 'phone' ? `drop-shadow(0 0 10px ${ACCENT_COLOR})` : 'none'
                                        }}
                                    />
                                </motion.div>
                                <span className={cn(
                                    "block text-xl font-semibold transition-all duration-300",
                                    formData.preferredContact === 'phone' ? "text-white" : "text-white/70"
                                )}>
                                    Phone
                                </span>
                                <span className="block text-sm text-white/40 mt-2">
                                    We'll call you directly
                                </span>
                            </motion.button>
                        </div>
                    )}

                    {/* Service Type Selection - NEW */}
                    {currentStepData.id === 'serviceType' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <ServiceTypeOption
                                type="voice_agent"
                                selected={formData.serviceType === 'voice_agent'}
                                onClick={() => setFormData({ ...formData, serviceType: 'voice_agent' })}
                                icon={Bot}
                                title="AI Voice Agent"
                                description="Intelligent phone handling & conversations"
                            />
                            <ServiceTypeOption
                                type="automation"
                                selected={formData.serviceType === 'automation'}
                                onClick={() => setFormData({ ...formData, serviceType: 'automation' })}
                                icon={Zap}
                                title="Automation"
                                description="Workflow & process automation"
                            />
                            <ServiceTypeOption
                                type="both"
                                selected={formData.serviceType === 'both'}
                                onClick={() => setFormData({ ...formData, serviceType: 'both' })}
                                icon={Layers}
                                title="Both"
                                description="Complete AI-powered solution"
                            />
                        </div>
                    )}

                    {currentStepData.id === 'expectations' && (
                        <Textarea
                            autoFocus
                            placeholder="Tell us about your goals and what you hope to achieve..."
                            value={formData.expectations}
                            onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                            rows={6}
                            className="text-xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all resize-none rounded-2xl p-5 focus:border-orange-500/60 focus:ring-orange-500/30 min-h-[200px]"
                        />
                    )}

                    {currentStepData.id === 'comments' && (
                        <Textarea
                            autoFocus
                            placeholder="Any additional information you'd like to share? (Optional)"
                            value={formData.comments}
                            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                            rows={6}
                            className="text-xl bg-white/5 border-white/20 text-white placeholder:text-white/40 transition-all resize-none rounded-2xl p-5 focus:border-orange-500/60 focus:ring-orange-500/30 min-h-[200px]"
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
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-white/60 text-lg"
                            >
                                Thank you, <span className="text-white font-semibold">{formData.fullName}</span>!<br />
                                We're excited to work with you.
                            </motion.p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] overflow-hidden">
            {/* Animated Background */}
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
                    color="rgba(139, 92, 246, 0.08)"
                    delay={4}
                />
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
                                style={{ background: `linear-gradient(to right, ${ACCENT_COLOR}, #FF8C00)` }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 2.2, ease: "easeInOut" }}
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
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
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

                    {!isComplete && (
                        <motion.div
                            whileHover={{ scale: canProceed() ? 1.05 : 1 }}
                            whileTap={{ scale: canProceed() ? 0.95 : 1 }}
                        >
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="text-white rounded-xl h-14 px-8 text-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: canProceed()
                                        ? `linear-gradient(135deg, ${ACCENT_COLOR} 0%, #FF8C00 100%)`
                                        : 'rgba(255, 255, 255, 0.1)',
                                    boxShadow: canProceed()
                                        ? `0 10px 40px rgba(${ACCENT_COLOR_RGB}, 0.4)`
                                        : 'none'
                                }}
                            >
                                Continue
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}

                    {isComplete && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                onClick={handleComplete}
                                className="text-white rounded-xl h-14 px-10 text-lg font-medium"
                                style={{
                                    background: `linear-gradient(135deg, ${ACCENT_COLOR} 0%, #FF8C00 100%)`,
                                    boxShadow: `0 10px 40px rgba(${ACCENT_COLOR_RGB}, 0.4)`
                                }}
                            >
                                Go to Dashboard
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Step Dots */}
            <StepDots currentStep={currentStep} totalSteps={steps.length} />
        </div>
    )
}

export default WelcomeFlow
