import api from "./api"
import type { Questionnaire, CreateQuestionnaireDTO, UpdateQuestionnaireDTO } from "@/types/questionnaire"

// Função auxiliar para validar UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

const QuestionnaireService = {
  // Criar um questionário
  async createQuestionnaire(data: CreateQuestionnaireDTO): Promise<Questionnaire> {
    const response = await api.post<Questionnaire>("/questionnaires", data)
    return response.data
  },

  // Listar todos os questionários
  async getAllQuestionnaires(): Promise<Questionnaire[]> {
    try {
      const response = await api.get<Questionnaire[]>("/questionnaires")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar questionários:", error)
      return []
    }
  },

  // Listar questionários por ID de usuário
  async getQuestionnairesByUserId(userId: string): Promise<Questionnaire[]> {
    try {
      if (!isValidUUID(userId)) {
        console.error("ID de usuário inválido:", userId)
        return []
      }

      const response = await api.get<Questionnaire[]>(`/questionnaires/user/${userId}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar questionários do usuário ${userId}:`, error)
      return []
    }
  },

  // Buscar um questionário por ID
  async getQuestionnaireById(id: string): Promise<Questionnaire | null> {
    try {
      // Verificar se o ID é um UUID válido
      if (!isValidUUID(id)) {
        console.error("ID de questionário inválido:", id)
        return null
      }

      const response = await api.get<Questionnaire>(`/questionnaires/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar questionário ${id}:`, error)
      return null
    }
  },

  // Atualizar um questionário
  async updateQuestionnaire(id: string, data: UpdateQuestionnaireDTO): Promise<Questionnaire> {
    if (!isValidUUID(id)) {
      throw new Error("ID de questionário inválido")
    }

    const response = await api.put<Questionnaire>(`/questionnaires/${id}`, data)
    return response.data
  },

  // Deletar um questionário
  async deleteQuestionnaire(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new Error("ID de questionário inválido")
    }

    await api.delete(`/questionnaires/${id}`)
  },
}

export default QuestionnaireService

