import api from "./api";
import type { Sector, CreateSectorDTO, UpdateSectorDTO } from "@/types/sector";
import { User } from "./auth-service";

// Função auxiliar para validar UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const SectorService = {
  // Listar todos os setores
  async getAllSectors(): Promise<Sector[]> {
    try {
      const response = await api.get<Sector[]>("/sectors");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
      return [];
    }
  },

  // Criar um setor
  async createSector(data: CreateSectorDTO): Promise<Sector> {
    const response = await api.post<Sector>("/sectors", data);
    return response.data;
  },

  // Buscar um setor por ID
  async getSectorById(id: string): Promise<Sector | null> {
    try {
      if (!isValidUUID(id)) {
        console.error("ID de setor inválido:", id);
        return null;
      }

      const response = await api.get<Sector>(`/sectors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar setor ${id}:`, error);
      return null;
    }
  },

  // Atualizar um setor
  async updateSector(id: string, data: UpdateSectorDTO): Promise<Sector> {
    if (!isValidUUID(id)) {
      throw new Error("ID de setor inválido");
    }

    const response = await api.put<Sector>(`/sectors/${id}`, data);
    return response.data;
  },

  // Deletar um setor
  async deleteSector(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new Error("ID de setor inválido");
    }

    await api.delete(`/sectors/${id}`);
  },

  // Associar um setor a um usuário
  async associateUserToSector(userId: string, sectorId: string): Promise<User> {
    if (!isValidUUID(sectorId)) {
      throw new Error("ID de setor inválido");
    }
    // Atualizado: envia PUT para /sectors/users/{userId} com body contendo userId e sectorId
    const response = await api.put<User>(`/sectors/users/${userId}`, {
      userId,
      sectorId,
    });
    return response.data;
  },

  // Desassociar o setor de um usuário
  async disassociateUserFromSector(userId: string): Promise<User> {
    // Aqui enviamos null ou uma propriedade específica para remover a associação
    const response = await api.put<User>(`/sectors/users/${userId}`, {
      sectorId: null,
    });
    return response.data;
  },

  // Buscar todos os usuários de um setor
  async getUsersBySector(sectorId: string): Promise<User[]> {
    if (!isValidUUID(sectorId)) {
      throw new Error("ID de setor inválido");
    }
    // Assumindo que a API possui um endpoint GET /sectors/{id}/users
    const response = await api.get<User[]>(`/sectors/${sectorId}/users`);
    return response.data;
  },
};

export default SectorService;
