import axios, { type AxiosRequestConfig } from "axios"
import AuthService from "./auth-service"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://https://api-imec-formularios-api.5lsiua.easypanel.host/",
  headers: {
    "Content-Type": "application/json",
  },
})

let isRefreshing = false

let failedQueue: {
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}[] = []


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


api.interceptors.request.use(
  (config) => {
    
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


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        
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
        
        const refreshToken = AuthService.getRefreshToken()

        if (!refreshToken) {
          throw new Error("Refresh token não encontrado")
        }

        const response = await AuthService.refreshToken(refreshToken)

        
        AuthService.saveTokens(response.accessToken, response.refreshToken)

        
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`

        
        processQueue(null, response.accessToken)

        return api(originalRequest)
      } catch (refreshError) {
        
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

