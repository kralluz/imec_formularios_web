"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UserService from "@/services/user-service"
import type { User } from "@/services/auth-service"
import { useCustomToast } from "@/hooks/use-custom-toast"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useCustomToast()
  const router = useRouter()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await UserService.getAllUsers()
      setUsers(data)
      toast.success("Usuários carregados", `${data.length} usuários encontrados.`)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      toast.error("Erro ao carregar usuários", "Não foi possível carregar a lista de usuários.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${name}?`)) {
      try {
        await UserService.deleteUser(id)
        setUsers(users.filter((user) => user.id !== id))
        toast.success("Usuário excluído", `O usuário ${name} foi excluído com sucesso.`)
      } catch (error) {
        console.error("Erro ao excluir usuário:", error)
        toast.error("Erro ao excluir usuário", "Não foi possível excluir o usuário.")
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="animate-slide-up opacity-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">Gerenciar Usuários</span>
        </h1>
        <Button
          className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all hover-lift"
          onClick={() => router.push("/register")}
        >
          <FaUserPlus className="mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card className="overflow-hidden border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-800">
        <div className="p-4">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Função</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Data de Criação</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-300">{user.name}</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">{user.email}</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toast.info(
                                  "Funcionalidade em desenvolvimento",
                                  "Esta funcionalidade estará disponível em breve.",
                                )
                              }
                              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift"
                            >
                              <FaEdit className="text-purple-600 dark:text-purple-400" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift"
                            >
                              <FaTrash className="text-red-600 dark:text-red-400" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-gray-700 dark:text-gray-400">
                        Nenhum usuário encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

