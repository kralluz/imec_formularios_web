"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import QuestionnaireService from "@/services/questionnaire-service"
import ResponsibleService from "@/services/responsible-service"
import { useCustomToast } from "@/hooks/use-custom-toast"
import type {
  Questionnaire,
  Responsible,
  CreateQuestionnaireDTO,
  UpdateQuestionnaireDTO,
  CreateResponsibleDTO,
  UpdateResponsibleDTO,
} from "@/types/questionnaire"

type QuestionnaireContextType = {
  questionnaires: Questionnaire[]
  responsibles: Responsible[]
  isLoading: boolean
  error: string | null

  // Métodos para questionários
  loadQuestionnaires: () => Promise<Questionnaire[]>
  loadUserQuestionnaires: (userId: string) => Promise<Questionnaire[]>
  getQuestionnaire: (id: string) => Promise<Questionnaire | null>
  createQuestionnaire: (data: CreateQuestionnaireDTO) => Promise<Questionnaire | null>
  updateQuestionnaire: (id: string, data: UpdateQuestionnaireDTO) => Promise<Questionnaire | null>
  deleteQuestionnaire: (id: string) => Promise<boolean>

  // Métodos para responsáveis
  loadResponsibles: () => Promise<void>
  getResponsible: (id: string) => Promise<Responsible | null>
  createResponsible: (data: CreateResponsibleDTO) => Promise<Responsible | null>
  updateResponsible: (id: string, data: UpdateResponsibleDTO) => Promise<Responsible | null>
  deleteResponsible: (id: string) => Promise<boolean>
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined)

export function QuestionnaireProvider({ children }: { children: React.ReactNode }) {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [responsibles, setResponsibles] = useState<Responsible[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useCustomToast()

  // Métodos para questionários
  const loadQuestionnaires = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await QuestionnaireService.getAllQuestionnaires()
      setQuestionnaires(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao carregar questionários"
      setError(errorMessage)
      console.error("Erro ao carregar questionários:", err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadUserQuestionnaires = useCallback(async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await QuestionnaireService.getQuestionnairesByUserId(userId)
      setQuestionnaires(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao carregar questionários do usuário"
      setError(errorMessage)
      console.error(`Erro ao carregar questionários do usuário ${userId}:`, err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getQuestionnaire = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await QuestionnaireService.getQuestionnaireById(id)
        return data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao buscar questionário"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const createQuestionnaire = useCallback(
    async (data: CreateQuestionnaireDTO) => {
      setIsLoading(true)
      setError(null)

      try {
        const newQuestionnaire = await QuestionnaireService.createQuestionnaire(data)
        setQuestionnaires((prev) => [...prev, newQuestionnaire])
        toast.success("Sucesso", "Questionário criado com sucesso")
        return newQuestionnaire
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao criar questionário"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const updateQuestionnaire = useCallback(
    async (id: string, data: UpdateQuestionnaireDTO) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedQuestionnaire = await QuestionnaireService.updateQuestionnaire(id, data)
        setQuestionnaires((prev) => prev.map((q) => (q.id === id ? updatedQuestionnaire : q)))
        toast.success("Sucesso", "Questionário atualizado com sucesso")
        return updatedQuestionnaire
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao atualizar questionário"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const deleteQuestionnaire = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await QuestionnaireService.deleteQuestionnaire(id)
        setQuestionnaires((prev) => prev.filter((q) => q.id !== id))
        toast.success("Sucesso", "Questionário excluído com sucesso")
        return true
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao excluir questionário"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // Métodos para responsáveis
  const loadResponsibles = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await ResponsibleService.getAllResponsibles()
      setResponsibles(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao carregar responsáveis"
      setError(errorMessage)
      toast.error("Erro", errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const getResponsible = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await ResponsibleService.getResponsibleById(id)
        return data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao buscar responsável"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const createResponsible = useCallback(
    async (data: CreateResponsibleDTO) => {
      setIsLoading(true)
      setError(null)

      try {
        const newResponsible = await ResponsibleService.createResponsible(data)
        setResponsibles((prev) => [...prev, newResponsible])
        toast.success("Sucesso", "Responsável criado com sucesso")
        return newResponsible
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao criar responsável"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const updateResponsible = useCallback(
    async (id: string, data: UpdateResponsibleDTO) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedResponsible = await ResponsibleService.updateResponsible(id, data)
        setResponsibles((prev) => prev.map((r) => (r.id === id ? updatedResponsible : r)))
        toast.success("Sucesso", "Responsável atualizado com sucesso")
        return updatedResponsible
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao atualizar responsável"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const deleteResponsible = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await ResponsibleService.deleteResponsible(id)
        setResponsibles((prev) => prev.filter((r) => r.id !== id))
        toast.success("Sucesso", "Responsável excluído com sucesso")
        return true
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erro ao excluir responsável"
        setError(errorMessage)
        toast.error("Erro", errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const value = {
    questionnaires,
    responsibles,
    isLoading,
    error,
    loadQuestionnaires,
    loadUserQuestionnaires,
    getQuestionnaire,
    createQuestionnaire,
    updateQuestionnaire,
    deleteQuestionnaire,
    loadResponsibles,
    getResponsible,
    createResponsible,
    updateResponsible,
    deleteResponsible,
  }

  return <QuestionnaireContext.Provider value={value}>{children}</QuestionnaireContext.Provider>
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext)

  if (context === undefined) {
    throw new Error("useQuestionnaire deve ser usado dentro de um QuestionnaireProvider")
  }

  return context
}

