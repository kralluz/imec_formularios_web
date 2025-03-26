"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthService, {
  type LoginCredentials,
  type RegisterData,
  type User,
} from "@/services/auth-service";
import { notification } from "antd";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus()
      .then(() => setIsLoading(false))
      .catch(() => {
        setIsLoading(false);
        notification.error({
          message: "Erro de autenticação",
          description: "Não foi possível verificar seu status de autenticação.",
          placement: "bottomRight",
        });
      });
  }, []);

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const token = AuthService.getAccessToken();

      if (!token) {
        setUser(null);
        return false;
      }

      const isValid = await AuthService.validateToken();

      if (!isValid) {
        setUser(null);
        AuthService.removeTokens();
        notification.warning({
          message: "Sessão expirada",
          description: "Sua sessão expirou. Por favor, faça login novamente.",
          placement: "bottomRight",
        });
        return false;
      }

      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setUser(null);
      AuthService.removeTokens();
      return false;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      const authResponse = await AuthService.login(credentials);

      if (
        !authResponse ||
        !authResponse.accessToken ||
        !authResponse.refreshToken
      ) {
        throw new Error("Tokens de autenticação não encontrados na resposta");
      }

      AuthService.saveTokens(
        authResponse.accessToken,
        authResponse.refreshToken
      );

      try {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);

        if (userData.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } catch (userError) {
        console.error("Erro ao obter dados do usuário:", userError);
        throw new Error(
          "Não foi possível obter os dados do usuário após login"
        );
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      AuthService.removeTokens();
      const errorMessage =
        error.response?.data?.error || "Ocorreu um erro ao fazer login.";
      notification.error({
        message: "Erro ao fazer login",
        description: errorMessage,
        placement: "bottomRight",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);

    try {
      await AuthService.register(data);

      notification.success({
        message: "Usuário registrado com sucesso",
        description: "O novo usuário foi criado e pode fazer login.",
        placement: "bottomRight",
      });
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Ocorreu um erro ao registrar o usuário.";
      notification.error({
        message: "Erro ao registrar",
        description: errorMessage,
        placement: "bottomRight",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.removeTokens();
    setUser(null);
    router.push("/");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
