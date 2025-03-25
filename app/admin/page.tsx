"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FaUsers, FaFileAlt, FaDownload } from "react-icons/fa"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import UserService from "@/services/user-service"
import { useCustomToast } from "@/hooks/use-custom-toast"

export default function AdminPage() {
  const { user } = useAuth()
  const [userCount, setUserCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useCustomToast()

  useEffect(() => {
    const loadUserCount = async () => {
      try {
        const users = await UserService.getAllUsers()
        setUserCount(users.length)
        toast.success("Dados carregados", "Painel administrativo atualizado com sucesso.")
      } catch (error) {
        console.error("Erro ao carregar contagem de usuários:", error)
        toast.error("Erro ao carregar dados", "Não foi possível carregar as estatísticas do sistema.")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserCount()
  }, [toast])

  return (
    <div className="animate-slide-up opacity-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">Painel Administrativo</span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Bem-vindo, {user?.name}. Gerencie seu sistema a partir daqui.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users">
          <Card className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 transition-all hover:shadow-md hover-lift">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <FaUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Usuários</h2>
                {isLoading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{userCount}</p>
                )}
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Total de usuários cadastrados</p>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 transition-all hover:shadow-md hover-lift">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <FaFileAlt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Formulários</h2>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">156</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Total de formulários no sistema</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 transition-all hover:shadow-md hover-lift">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <FaDownload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Downloads</h2>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">89</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Downloads realizados hoje</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

