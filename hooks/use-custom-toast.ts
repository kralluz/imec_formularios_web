"use client"

import { useToast } from "@/hooks/use-toast"

type ToastVariant = "default" | "success" | "error" | "warning" | "info"

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export function useCustomToast() {
  const { toast } = useToast()

  const showToast = ({ title, description, variant = "default", duration = 5000 }: ToastOptions) => {
    return toast({
      title,
      description,
      variant: variant === "default" ? undefined : variant,
      duration,
    })
  }

  const success = (title: string, description?: string, duration?: number) => {
    return showToast({ title, description, variant: "success", duration })
  }

  const error = (title: string, description?: string, duration?: number) => {
    return showToast({ title, description, variant: "destructive", duration })
  }

  const warning = (title: string, description?: string, duration?: number) => {
    return showToast({ title, description, variant: "warning", duration })
  }

  const info = (title: string, description?: string, duration?: number) => {
    return showToast({ title, description, variant: "info", duration })
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
  }
}

