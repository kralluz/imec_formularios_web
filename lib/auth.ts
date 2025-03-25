// Função para verificar se o usuário está autenticado
export function isAuthenticated() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    return !!token
  }
  return false
}

// Função para verificar a role do usuário
export function getUserRole() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (!token) return null

    try {
      // Em uma aplicação real, você decodificaria o token JWT
      // Aqui estamos simulando a decodificação
      return "USER" // ou "ADMIN" dependendo do token
    } catch (error) {
      console.error("Erro ao decodificar token:", error)
      return null
    }
  }
  return null
}

// Função para fazer logout
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

