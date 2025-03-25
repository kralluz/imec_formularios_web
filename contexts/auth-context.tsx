"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthService, { type LoginCredentials, type RegisterData, type User } from "@/services/auth-service"
import { useCustomToast } from "@/hooks/use-custom-toast"

// Definição dos tipos
type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  checkAuthStatus: () => Promise<boolean>
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const toast = useCustomToast()

  // Verificar o status de autenticação ao carregar a página
  useEffect(() => {
    checkAuthStatus()
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false)
        toast.error("Erro de autenticação", "Não foi possível verificar seu status de autenticação.")
      })
  }, [])

  // Função para verificar o status de autenticação
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const token = AuthService.getAccessToken()

      if (!token) {
        setUser(null)
        return false
      }

      // Validar o token e obter dados do usuário
      const isValid = await AuthService.validateToken()

      if (!isValid) {
        setUser(null)
        AuthService.removeTokens()
        toast.warning("Sessão expirada", "Sua sessão expirou. Por favor, faça login novamente.")
        return false
      }

      // Obter dados do usuário
      const userData = await AuthService.getCurrentUser()
      setUser(userData)
      return true
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      setUser(null)
      AuthService.removeTokens()
      return false
    }
  }

  // Função de login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true)

    try {
      // Chamar a API de login para obter os tokens
      const authResponse = await AuthService.login(credentials)

      // Verificar se a resposta da API contém os tokens esperados
      if (!authResponse || !authResponse.accessToken || !authResponse.refreshToken) {
        throw new Error("Tokens de autenticação não encontrados na resposta")
      }

      // Salvar os tokens
      AuthService.saveTokens(authResponse.accessToken, authResponse.refreshToken)

      // Obter dados do usuário com o token de acesso
      try {
        const userData = await AuthService.getCurrentUser()
        setUser(userData)

        // Redirecionar com base na role
        if (userData.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } catch (userError) {
        console.error("Erro ao obter dados do usuário:", userError)
        throw new Error("Não foi possível obter os dados do usuário após login")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      AuthService.removeTokens() // Limpar qualquer token que possa ter sido salvo
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função de registro (apenas para administradores)
  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true)

    try {
      // Chamar a API de registro
      await AuthService.register(data)

      // Não faz login automático após registro, apenas retorna sucesso
      toast.success("Usuário registrado com sucesso", "O novo usuário foi criado e pode fazer login.")
    } catch (error) {
      console.error("Erro ao registrar:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função de logout
  const logout = () => {
    AuthService.removeTokens()
    setUser(null)
    router.push("/")
  }

  // Valor do contexto
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}

