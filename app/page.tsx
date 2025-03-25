"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user } = useAuth()

  // Garantir que o componente só tenta acessar o contexto após a montagem no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Se já estiver autenticado, redirecionar para a página apropriada
    if (mounted && isAuthenticated) {
      if (user?.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, router, user, mounted])

  // Não renderizar nada até que o componente esteja montado
  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md animate-scale-in opacity-0">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              <span className="text-purple-600 dark:text-purple-400">IMEC</span> Formulários
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Sistema de gerenciamento de documentos</p>
          </div>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}

