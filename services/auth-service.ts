import api from "./api"

// Tipos
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "COMMON"
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// Serviço de autenticação
const AuthService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials)
    return response.data
  },

  // Registro (apenas para administradores)
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>("/auth/register", data)
    return response.data
  },

  // Obter dados do usuário atual
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>("/auth/user/data")

      // Verificar se a resposta contém os dados esperados
      if (!response || !response.data) {
        throw new Error("Dados do usuário não encontrados na resposta")
      }

      return response.data
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error)
      throw error
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>("/auth/refresh", { refreshToken })
    return response.data
  },

  // Verificar se o token é válido
  async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  },

  // Salvar tokens no localStorage
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
  },

  // Obter access token do localStorage
  getAccessToken(): string | null {
    return localStorage.getItem("access_token")
  },

  // Obter refresh token do localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token")
  },

  // Remover tokens do localStorage
  removeTokens(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  },
}

export default AuthService

