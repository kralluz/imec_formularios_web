import axios, { type AxiosRequestConfig } from "axios"
import AuthService from "./auth-service"

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Flag para controlar se já está tentando atualizar o token
let isRefreshing = false
// Fila de requisições que falharam por token expirado
let failedQueue: {
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}[] = []

// Função para processar a fila de requisições
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Verifica se está no browser antes de acessar localStorage
    if (typeof window !== "undefined") {
      const token = AuthService.getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está atualizando o token, adiciona a requisição à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Tenta obter um novo token usando o refresh token
        const refreshToken = AuthService.getRefreshToken()

        if (!refreshToken) {
          throw new Error("Refresh token não encontrado")
        }

        const response = await AuthService.refreshToken(refreshToken)

        // Salva os novos tokens
        AuthService.saveTokens(response.accessToken, response.refreshToken)

        // Atualiza o header da requisição original
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`

        // Processa a fila de requisições que falharam
        processQueue(null, response.accessToken)

        return api(originalRequest)
      } catch (refreshError) {
        // Se falhar ao atualizar o token, limpa os tokens e redireciona para login
        processQueue(refreshError, null)
        AuthService.removeTokens()

        if (typeof window !== "undefined") {
          window.location.href = "/"
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Logar detalhes do erro para depuração
    if (error.response) {
      console.error("Erro de API:", {
        status: error.response.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
      })
    } else if (error.request) {
      console.error("Erro de rede:", error.request)
    } else {
      console.error("Erro:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api

