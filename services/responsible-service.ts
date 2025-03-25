import api from "./api"
import type { Responsible, CreateResponsibleDTO, UpdateResponsibleDTO } from "@/types/questionnaire"

const ResponsibleService = {
  // Listar todos os responsáveis
  async getAllResponsibles(): Promise<Responsible[]> {
    try {
      const response = await api.get<Responsible[]>("/responsibles")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar responsáveis:", error)
      return []
    }
  },

  // Criar um responsável
  async createResponsible(data: CreateResponsibleDTO): Promise<Responsible> {
    const response = await api.post<Responsible>("/responsibles", data)
    return response.data
  },

  // Buscar um responsável por ID
  async getResponsibleById(id: string): Promise<Responsible> {
    const response = await api.get<Responsible>(`/responsibles/${id}`)
    return response.data
  },

  // Atualizar um responsável
  async updateResponsible(id: string, data: UpdateResponsibleDTO): Promise<Responsible> {
    const response = await api.put<Responsible>(`/responsibles/${id}`, data)
    return response.data
  },

  // Deletar um responsável
  async deleteResponsible(id: string): Promise<void> {
    await api.delete(`/responsibles/${id}`)
  },
}

export default ResponsibleService

