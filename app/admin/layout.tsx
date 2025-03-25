"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar se o usuário está autenticado e tem a role ADMIN
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/")
      } else if (user?.role !== "ADMIN") {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, router, user, toast])

  // Mostrar nada enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
      </div>
    )
  }

  // Se não estiver autenticado ou não for admin, não renderiza nada (será redirecionado)
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  // Se estiver autenticado e for admin, renderiza o layout
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

