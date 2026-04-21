import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  className?: string
}

function LoadingSpinner({ className }: LoadingSpinnerProps): React.JSX.Element {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
    </div>
  )
}

export { LoadingSpinner };

