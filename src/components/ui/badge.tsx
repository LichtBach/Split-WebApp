import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary/90 text-primary-foreground shadow-sm hover:bg-primary",
                secondary:
                    "border-transparent bg-secondary/80 text-secondary-foreground backdrop-blur-sm hover:bg-secondary",
                destructive:
                    "border-transparent bg-destructive/90 text-destructive-foreground shadow-sm hover:bg-destructive",
                outline: "text-foreground border-border/50 bg-background/30 backdrop-blur-sm",
                success:
                    "border-transparent bg-green-500/15 text-green-400 border border-green-500/30",
                warning:
                    "border-transparent bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
                info:
                    "border-transparent bg-blue-500/15 text-blue-400 border border-blue-500/30",
                purple:
                    "border-transparent bg-violet-500/15 text-violet-400 border border-violet-500/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
