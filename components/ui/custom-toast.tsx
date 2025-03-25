import type { ReactNode } from "react"
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from "react-icons/fa"
import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"

interface CustomToastProps {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  onOpenChange?: (open: boolean) => void
}

export function CustomToast({ id, title, description, variant = "default", onOpenChange }: CustomToastProps) {
  // Definir ícone com base na variante
  const getIcon = (): ReactNode => {
    switch (variant) {
      case "success":
        return <FaCheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <FaTimesCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <FaInfoCircle className="h-5 w-5 text-blue-500" />
      default:
        return <FaInfoCircle className="h-5 w-5 text-purple-500" />
    }
  }

  // Definir classes com base na variante
  const getClasses = (): string => {
    const baseClasses =
      "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-bounce-in"

    switch (variant) {
      case "success":
        return `${baseClasses} bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800`
      case "error":
        return `${baseClasses} bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800`
      case "warning":
        return `${baseClasses} bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800`
      case "info":
        return `${baseClasses} bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800`
      default:
        return `${baseClasses} bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700`
    }
  }

  return (
    <Toast id={id} className={getClasses()} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <div className="flex-1">
          <ToastTitle className="text-gray-900 dark:text-gray-100">{title}</ToastTitle>
          {description && (
            <ToastDescription className="text-gray-700 dark:text-gray-300">{description}</ToastDescription>
          )}
        </div>
      </div>
      <ToastClose />
    </Toast>
  )
}

