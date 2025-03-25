import api from "./api"
import type { Sector, CreateSectorDTO, UpdateSectorDTO } from "@/types/sector"

// Função auxiliar para validar UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

const SectorService = {
  // Listar todos os setores
  async getAllSectors(): Promise<Sector[]> {
    try {
      const response = await api.get<Sector[]>("/sectors")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar setores:", error)
      return []
    }
  },

  // Criar um setor
  async createSector(data: CreateSectorDTO): Promise<Sector> {
    const response = await api.post<Sector>("/sectors", data)
    return response.data
  },

  // Buscar um setor por ID
  async getSectorById(id: string): Promise<Sector | null> {
    try {
      if (!isValidUUID(id)) {
        console.error("ID de setor inválido:", id)
        return null
      }

      const response = await api.get<Sector>(`/sectors/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar setor ${id}:`, error)
      return null
    }
  },

  // Atualizar um setor
  async updateSector(id: string, data: UpdateSectorDTO): Promise<Sector> {
    if (!isValidUUID(id)) {
      throw new Error("ID de setor inválido")
    }

    const response = await api.put<Sector>(`/sectors/${id}`, data)
    return response.data
  },

  // Deletar um setor
  async deleteSector(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new Error("ID de setor inválido")
    }

    await api.delete(`/sectors/${id}`)
  },
}

export default SectorService

