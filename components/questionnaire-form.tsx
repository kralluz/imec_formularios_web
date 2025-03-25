"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaPlus, FaTrash } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuestionnaire } from "@/contexts/questionnaire-context"
import { useAuth } from "@/contexts/auth-context"
import { useCustomToast } from "@/hooks/use-custom-toast"
import type { Responsible, ResponsibleRole, RegistrationType } from "@/types/questionnaire"

interface QuestionnaireFormProps {
  questionnaireId?: string
}

export default function QuestionnaireForm({ questionnaireId }: QuestionnaireFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { createQuestionnaire, updateQuestionnaire, getQuestionnaire, isLoading } = useQuestionnaire()
  const toast = useCustomToast()

  const [title, setTitle] = useState("")
  const [icon, setIcon] = useState("")
  const [responsibles, setResponsibles] = useState<Omit<Responsible, "id" | "createdAt" | "updatedAt">[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  // Verificar se estamos no modo de criação ou edição
  const isCreationMode = !questionnaireId || questionnaireId === "new"

  // Carregar dados do questionário se estiver editando
  useEffect(() => {
    const loadQuestionnaireData = async () => {
      // Se estiver no modo de criação, apenas inicialize o formulário
      if (isCreationMode) {
        if (responsibles.length === 0) {
          addResponsible()
        }
        setIsDataLoaded(true)
        return
      }

      // Se estiver no modo de edição e os dados ainda não foram carregados
      if (!isDataLoaded) {
        try {
          const questionnaire = await getQuestionnaire(questionnaireId)
          if (questionnaire) {
            setTitle(questionnaire.title || "")
            setIcon(questionnaire.icon || "")

            // Mapear responsáveis para o formato esperado pelo formulário
            if (questionnaire.responsibles && Array.isArray(questionnaire.responsibles)) {
              const mappedResponsibles = questionnaire.responsibles.map((r) => ({
                name: r.name || "",
                role: r.role || ("OUTRO" as ResponsibleRole),
                registrationType: r.registrationType || ("OUTRO" as RegistrationType),
                registrationId: r.registrationId || "",
              }))
              setResponsibles(mappedResponsibles.length > 0 ? mappedResponsibles : [])
            } else {
              // Se não houver responsáveis, adicione um vazio
              addResponsible()
            }
          } else {
            // Se não encontrar o questionário, adicione um responsável vazio
            addResponsible()
          }
        } catch (error) {
          console.error("Erro ao carregar dados do questionário:", error)
          toast.error("Erro", "Não foi possível carregar os dados do questionário")
          // Em caso de erro, adicione um responsável vazio
          addResponsible()
        } finally {
          setIsDataLoaded(true)
        }
      }
    }

    loadQuestionnaireData()
  }, [questionnaireId, getQuestionnaire, isDataLoaded, toast, responsibles.length, isCreationMode])

  const addResponsible = () => {
    setResponsibles([
      ...responsibles,
      {
        name: "",
        role: "OUTRO" as ResponsibleRole,
        registrationType: "OUTRO" as RegistrationType,
        registrationId: "",
      },
    ])
  }

  const removeResponsible = (index: number) => {
    setResponsibles(responsibles.filter((_, i) => i !== index))
  }

  const updateResponsible = (
    index: number,
    field: keyof Omit<Responsible, "id" | "createdAt" | "updatedAt">,
    value: string,
  ) => {
    const updatedResponsibles = [...responsibles]
    updatedResponsibles[index] = {
      ...updatedResponsibles[index],
      [field]: value,
    }
    setResponsibles(updatedResponsibles)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar campos
      if (!title.trim()) {
        toast.error("Erro", "O título do questionário é obrigatório")
        setIsSubmitting(false)
        return
      }

      // Validar responsáveis
      for (const responsible of responsibles) {
        if (!responsible.name.trim() || !responsible.registrationId.trim()) {
          toast.error("Erro", "Todos os campos dos responsáveis são obrigatórios")
          setIsSubmitting(false)
          return
        }
      }

      if (!isCreationMode) {
        // Atualizar questionário existente
        await updateQuestionnaire(questionnaireId, { title, icon })
        toast.success("Sucesso", "Questionário atualizado com sucesso")
      } else {
        // Criar novo questionário
        if (!user?.id) {
          toast.error("Erro", "Usuário não identificado")
          setIsSubmitting(false)
          return
        }

        await createQuestionnaire({
          title,
          icon,
          userId: user.id,
          responsibles,
        })
        toast.success("Sucesso", "Questionário criado com sucesso")
      }

      // Redirecionar para a lista de questionários
      router.push("/admin/questionnaires")
    } catch (error) {
      console.error("Erro ao salvar questionário:", error)
      toast.error("Erro", "Ocorreu um erro ao salvar o questionário")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mostrar loading enquanto carrega os dados
  if (!isDataLoaded) {
    return (
      <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-gray-800 dark:text-white">
          {isCreationMode ? "Novo Questionário" : "Editar Questionário"}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {isCreationMode
            ? "Preencha os dados para criar um novo questionário"
            : "Atualize as informações do questionário"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do questionário"
              className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon" className="text-gray-700 dark:text-gray-300">
              Ícone
            </Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Nome do ícone (ex: scan, form, document)"
              className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 dark:text-gray-300">Responsáveis</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addResponsible}
                className="text-purple-600 border-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-900/20"
              >
                <FaPlus className="mr-1 h-3 w-3" /> Adicionar
              </Button>
            </div>

            {responsibles.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Nenhum responsável adicionado. Clique em "Adicionar" para incluir responsáveis.
              </p>
            ) : (
              <div className="space-y-4">
                {responsibles.map((responsible, index) => (
                  <div key={index} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Responsável #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResponsible(index)}
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <FaTrash className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`} className="text-gray-700 dark:text-gray-300">
                          Nome
                        </Label>
                        <Input
                          id={`name-${index}`}
                          value={responsible.name}
                          onChange={(e) => updateResponsible(index, "name", e.target.value)}
                          placeholder="Nome do responsável"
                          className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`role-${index}`} className="text-gray-700 dark:text-gray-300">
                          Função
                        </Label>
                        <Select
                          value={responsible.role}
                          onValueChange={(value) => updateResponsible(index, "role", value as ResponsibleRole)}
                        >
                          <SelectTrigger
                            id={`role-${index}`}
                            className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                          >
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MEDICO">Médico</SelectItem>
                            <SelectItem value="ENFERMEIRA">Enfermeira</SelectItem>
                            <SelectItem value="TECNICO">Técnico</SelectItem>
                            <SelectItem value="OUTRO">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`registrationType-${index}`} className="text-gray-700 dark:text-gray-300">
                          Tipo de Registro
                        </Label>
                        <Select
                          value={responsible.registrationType}
                          onValueChange={(value) =>
                            updateResponsible(index, "registrationType", value as RegistrationType)
                          }
                        >
                          <SelectTrigger
                            id={`registrationType-${index}`}
                            className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                          >
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CRM">CRM</SelectItem>
                            <SelectItem value="COREN">COREN</SelectItem>
                            <SelectItem value="OUTRO">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`registrationId-${index}`} className="text-gray-700 dark:text-gray-300">
                          Número de Registro
                        </Label>
                        <Input
                          id={`registrationId-${index}`}
                          value={responsible.registrationId}
                          onChange={(e) => updateResponsible(index, "registrationId", e.target.value)}
                          placeholder="Número do registro profissional"
                          className="border-gray-300 focus:border-purple-500 dark:border-gray-700 dark:focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/questionnaires")}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            {isSubmitting ? "Salvando..." : isCreationMode ? "Criar" : "Atualizar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

