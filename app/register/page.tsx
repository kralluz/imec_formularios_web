"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import RegisterForm from "@/components/register-form"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useCustomToast } from "@/hooks/use-custom-toast"

export default function RegisterPage() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()
  const toast = useCustomToast()

  useEffect(() => {
    // Verificar se o usuário está autenticado e é um administrador
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error("Acesso negado", "Você precisa estar autenticado para acessar esta página.")
        router.push("/")
      } else if (user?.role !== "ADMIN") {
        toast.error("Acesso negado", "Apenas administradores podem criar novas contas.")
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, router, user, toast])

  // Mostrar nada enquanto verifica a autenticação
  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md animate-scale-in opacity-0">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              <span className="text-purple-600 dark:text-purple-400">IMEC</span> Formulários
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Criar nova conta de usuário</p>
          </div>
          <RegisterForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

