import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, open, onOpenChange, duration = 3000, children, ...props }, ref) => {
    React.useEffect(() => {
      if (open && duration > 0) {
        const timer = setTimeout(() => {
          onOpenChange?.(false)
        }, duration)
        return () => clearTimeout(timer)
      }
    }, [open, duration, onOpenChange])

    if (!open) return null

    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-4 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-center",
          className
        )}
        {...props}
      >
        <div className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground shadow-lg">
          {children}
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }

