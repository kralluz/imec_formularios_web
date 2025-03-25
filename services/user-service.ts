import api from "./api"
import type { User } from "./auth-service"

// Tipos
export interface UserUpdateData {
  name?: string
  email?: string
  password?: string
}

// Serviço de usuários
const UserService = {
  // Listar todos os usuários
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users")
    return response.data
  },

  // Obter usuário por ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  // Atualizar usuário
  async updateUser(id: string, data: UserUpdateData): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data)
    return response.data
  },

  // Excluir usuário
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}

export default UserService

