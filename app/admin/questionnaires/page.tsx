"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaEdit, FaTrash, FaPlus, FaFileAlt, FaList } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuestionnaire } from "@/contexts/questionnaire-context"
import { useAuth } from "@/contexts/auth-context"
import { useCustomToast } from "@/hooks/use-custom-toast"

export default function QuestionnairesPage() {
  const { questionnaires, loadQuestionnaires, deleteQuestionnaire, isLoading } = useQuestionnaire()
  const { user } = useAuth()
  const router = useRouter()
  const toast = useCustomToast()
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Evitar múltiplas chamadas à API
    if (!hasLoaded) {
      const fetchData = async () => {
        try {
          await loadQuestionnaires()
        } catch (error) {
          console.error("Erro ao carregar questionários:", error)
          toast.error("Erro", "Não foi possível carregar os questionários. Tente novamente mais tarde.")
        } finally {
          setHasLoaded(true)
        }
      }

      fetchData()
    }
  }, [loadQuestionnaires, hasLoaded, toast])

  const handleDeleteQuestionnaire = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o questionário "${title}"?`)) {
      try {
        const success = await deleteQuestionnaire(id)
        if (success) {
          toast.success("Questionário excluído", `O questionário "${title}" foi excluído com sucesso.`)
        }
      } catch (error) {
        console.error("Erro ao excluir questionário:", error)
        toast.error("Erro", "Não foi possível excluir o questionário. Tente novamente mais tarde.")
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="animate-slide-up opacity-0">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">Gerenciar Questionários</span>
        </h1>
        <Button
          className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 transition-all hover-lift"
          onClick={() => router.push("/admin/questionnaires/new")}
        >
          <FaPlus className="mr-2" />
          Novo Questionário
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
                    <TableHead className="text-gray-700 dark:text-gray-300">Título</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Responsáveis</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Data de Criação</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionnaires && questionnaires.length > 0 ? (
                    questionnaires.map((questionnaire) => (
                      <TableRow
                        key={questionnaire.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                      >
                        <TableCell className="font-medium text-gray-800 dark:text-gray-300">
                          <div className="flex items-center">
                            {questionnaire.icon ? (
                              <span className="w-6 h-6 mr-2 flex items-center justify-center">
                                <FaFileAlt className="text-purple-600 dark:text-purple-400" />
                              </span>
                            ) : (
                              <FaFileAlt className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                            )}
                            {questionnaire.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {questionnaire.responsibles?.length || 0} responsáveis
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-400">
                          {formatDate(questionnaire.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/questionnaires/${questionnaire.id}`)}
                              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift"
                              title="Gerenciar Questões"
                            >
                              <FaList className="text-purple-600 dark:text-purple-400" />
                              <span className="sr-only">Questões</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/questionnaires/edit/${questionnaire.id}`)}
                              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift"
                              title="Editar Questionário"
                            >
                              <FaEdit className="text-purple-600 dark:text-purple-400" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuestionnaire(questionnaire.id!, questionnaire.title)}
                              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover-lift"
                              title="Excluir Questionário"
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
                      <TableCell colSpan={4} className="h-24 text-center text-gray-700 dark:text-gray-400">
                        Nenhum questionário encontrado.
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

