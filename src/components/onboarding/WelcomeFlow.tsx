import { useState } from 'react'
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
    Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Orange accent color: #FF6B00
const ACCENT_COLOR = '#FF6B00'
const ACCENT_COLOR_RGB = '255, 107, 0'

interface FormData {
    fullName: string
    email: string
    phone: string
    preferredContact: 'email' | 'phone' | null
    expectations: string
    comments: string
}

const steps = [
    { id: 'name', title: "Let's get to know you", subtitle: "What's your name?", icon: User },
    { id: 'email', title: "Stay connected", subtitle: "What's your email address?", icon: Mail },
    { id: 'phone', title: "Direct line", subtitle: "What's your phone number?", icon: Phone },
    { id: 'contact', title: "Your preference", subtitle: "How would you like us to reach you?", icon: MessageSquare },
    { id: 'expectations', title: "Your vision", subtitle: "What are your expectations from us?", icon: Sparkles },
    { id: 'comments', title: "Anything else?", subtitle: "Important mentions or comments", icon: Star },
    { id: 'complete', title: "Welcome aboard", subtitle: "You're all set!", icon: Check },
]

// Floating orb component for background glow - SLOWER animations
function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
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
                duration: 12, // Slower animation
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }}
            className={cn(
                "absolute rounded-full blur-3xl",
                className
            )}
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
                    transition={{ duration: 0.8, ease: "easeOut" }} // Slower
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
                        "w-2 h-2 rounded-full transition-all duration-500", // Slower transition
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
                    transition={{ delay: i * 0.08 }} // Slower stagger
                />
            ))}
        </div>
    )
}

export function WelcomeFlow({ onComplete }: { onComplete: (data: FormData) => void }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        preferredContact: null,
        expectations: '',
        comments: '',
    })
    const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

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
            case 'expectations':
                return formData.expectations.trim().length >= 10
            case 'comments':
                return true // Optional
            default:
                return true
        }
    }

    const handleNext = () => {
        if (canProceed() && currentStep < steps.length - 1) {
            setDirection(1)
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && canProceed() && !isLastStep) {
            handleNext()
        }
    }

    const handleComplete = () => {
        onComplete(formData)
    }

    // Animation variants - SLOWER transitions
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
                    stiffness: 180, // Softer spring
                    damping: 25,
                    duration: 0.8 // Slower
                }}
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
                onKeyDown={handleKeyDown}
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 120, duration: 0.8 }} // Slower
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
                    transition={{ delay: 0.5, duration: 0.6 }} // Slower
                    className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
                >
                    {currentStepData.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.6 }} // Slower
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
                                {/* Animated background glow when selected */}
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
                                {/* Animated background glow when selected */}
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
                            {/* Premium completion animation - SLOWER */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6, type: "spring", stiffness: 100, duration: 1.2 }} // Slower
                                className="relative inline-block"
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full blur-2xl"
                                    style={{ background: `linear-gradient(to right, ${ACCENT_COLOR}, #FF8C00)` }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} // Slower pulse
                                />
                                <div
                                    className="relative w-24 h-24 rounded-full flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${ACCENT_COLOR}, #FF8C00)` }}
                                >
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.5 }} // Delayed checkmark
                                    >
                                        <Check className="w-12 h-12 text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0, duration: 0.8 }} // Slower
                            >
                                <p className="text-xl text-white/80 mb-2">
                                    Welcome to the future, <span style={{ color: ACCENT_COLOR }} className="font-semibold">{formData.fullName}</span>!
                                </p>
                                <p className="text-white/50">
                                    Your premium AI receptionist experience awaits.
                                </p>
                            </motion.div>

                            {/* Summary card */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4, duration: 0.8 }} // Slower
                                className="mt-8 p-6 rounded-2xl glass-card border border-white/10 text-left max-w-sm mx-auto"
                            >
                                <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Your Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Email</span>
                                        <span className="text-white">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Phone</span>
                                        <span className="text-white">{formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Contact via</span>
                                        <span style={{ color: ACCENT_COLOR }} className="capitalize">{formData.preferredContact}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.8, duration: 0.6 }} // Slower, more delayed
                            >
                                <Button
                                    onClick={handleComplete}
                                    size="xl"
                                    className="mt-4 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${ACCENT_COLOR}, #FF8C00)`,
                                        boxShadow: `0 4px 20px rgba(${ACCENT_COLOR_RGB}, 0.4)`
                                    }}
                                >
                                    Enter Dashboard
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] overflow-hidden">
            {/* Animated background orbs for glassmorphism visibility - ORANGE */}
            <FloatingOrb
                className="w-96 h-96 -top-48 -left-48"
                delay={0}
            />
            <FloatingOrb
                className="w-[500px] h-[500px] top-1/4 -right-64"
                delay={3}
            />
            <FloatingOrb
                className="w-80 h-80 bottom-0 left-1/4"
                delay={6}
            />
            <FloatingOrb
                className="w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                delay={1.5}
            />

            {/* Orange glow orbs */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] -top-64 -left-64"
                style={{ backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.3)` }}
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bottom-0 right-0"
                style={{ backgroundColor: `rgba(${ACCENT_COLOR_RGB}, 0.25)` }}
                animate={{
                    opacity: [0.15, 0.35, 0.15],
                    scale: [1, 1.15, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute w-[300px] h-[300px] rounded-full blur-[80px] top-1/3 right-1/4"
                style={{ backgroundColor: `rgba(255, 140, 0, 0.2)` }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Progress bar */}
            {!isComplete && (
                <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
            )}

            {/* Main content area */}
            <div className="relative h-full flex items-center justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                    {renderStepContent()}
                </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            {!isComplete && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-6 z-20">
                    {currentStep > 0 && (
                        <motion.button
                            onClick={handlePrev}
                            initial={{ opacity: 0, x: -30, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                            whileHover={{
                                scale: 1.05,
                                x: -3,
                                boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 rounded-2xl font-medium text-white/80 
                                       bg-white/5 backdrop-blur-md border border-white/10 
                                       hover:bg-white/10 hover:border-white/20 hover:text-white
                                       transition-colors duration-300 overflow-hidden"
                        >
                            {/* Shimmer effect on hover */}
                            <motion.div
                                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                whileHover={{ translateX: '200%' }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                            <span className="relative flex items-center gap-2">
                                <motion.span
                                    initial={{ x: 0 }}
                                    whileHover={{ x: -4 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </motion.span>
                                Back
                            </span>
                        </motion.button>
                    )}

                    <motion.button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 150, delay: 0.1 }}
                        whileHover={canProceed() ? {
                            scale: 1.05,
                            x: 3,
                            boxShadow: `0 8px 40px rgba(${ACCENT_COLOR_RGB}, 0.5)`,
                        } : {}}
                        whileTap={canProceed() ? { scale: 0.95 } : {}}
                        className={`group relative px-10 py-4 rounded-2xl font-semibold text-white min-w-[180px]
                                    overflow-hidden transition-all duration-500
                                    ${!canProceed() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{
                            background: canProceed()
                                ? `linear-gradient(135deg, ${ACCENT_COLOR} 0%, #FF8C00 50%, #FFA500 100%)`
                                : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: canProceed()
                                ? `0 4px 25px rgba(${ACCENT_COLOR_RGB}, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)`
                                : 'none'
                        }}
                    >
                        {/* Animated gradient overlay */}
                        {canProceed() && (
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                style={{
                                    background: `linear-gradient(135deg, #FFA500 0%, ${ACCENT_COLOR} 50%, #FF8C00 100%)`
                                }}
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            />
                        )}

                        {/* Shimmer effect */}
                        {canProceed() && (
                            <motion.div
                                className="absolute inset-0 -translate-x-full"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                                }}
                                animate={{ translateX: ['calc(-100%)', 'calc(200%)'] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                    ease: "easeInOut"
                                }}
                            />
                        )}

                        {/* Glow ring on hover */}
                        {canProceed() && (
                            <motion.div
                                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 -z-10"
                                style={{
                                    background: `linear-gradient(135deg, ${ACCENT_COLOR}, #FFA500)`,
                                    filter: 'blur(12px)'
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        )}

                        <span className="relative flex items-center justify-center gap-2">
                            {currentStep === steps.length - 2 ? 'Complete' : 'Continue'}
                            <motion.span
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.span>
                        </span>
                    </motion.button>
                </div>
            )}

            {/* Step dots */}
            <StepDots currentStep={currentStep} totalSteps={steps.length} />

            {/* Skip button */}
            {currentStep < steps.length - 1 && currentStepData.id === 'comments' && (
                <button
                    onClick={handleNext}
                    className="absolute top-8 right-8 text-white/40 hover:text-white/60 text-sm transition-colors duration-300 z-20"
                >
                    Skip this step
                </button>
            )}
        </div>
    )
}
