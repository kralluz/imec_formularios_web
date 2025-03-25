"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import QuestionnaireService from "@/services/questionnaire-service";
import ResponsibleService from "@/services/responsible-service";
import { useCustomToast } from "@/hooks/use-custom-toast";
import type {
  Questionnaire,
  Responsible,
  CreateQuestionnaireDTO,
  UpdateQuestionnaireDTO,
  CreateResponsibleDTO,
  UpdateResponsibleDTO,
} from "@/types/questionnaire";

type QuestionnaireContextType = {
  questionnaires: Questionnaire[];
  responsibles: Responsible[];
  isLoading: boolean;
  error: string | null;

  // Métodos para questionários
  loadQuestionnaires: () => Promise<Questionnaire[]>;
  loadUserQuestionnaires: (userId: string) => Promise<Questionnaire[]>;
  getQuestionnaire: (id: string) => Promise<Questionnaire | null>;
  createQuestionnaire: (
    data: CreateQuestionnaireDTO
  ) => Promise<Questionnaire | null>;
  updateQuestionnaire: (
    id: string,
    data: UpdateQuestionnaireDTO
  ) => Promise<Questionnaire | null>;
  deleteQuestionnaire: (id: string) => Promise<boolean>;

  // Métodos para responsáveis
  loadResponsibles: () => Promise<void>;
  getResponsible: (id: string) => Promise<Responsible | null>;
  createResponsible: (
    data: CreateResponsibleDTO
  ) => Promise<Responsible | null>;
  updateResponsible: (
    id: string,
    data: UpdateResponsibleDTO
  ) => Promise<Responsible | null>;
  deleteResponsible: (id: string) => Promise<boolean>;
};

const QuestionnaireContext = createContext<
  QuestionnaireContextType | undefined
>(undefined);

export function QuestionnaireProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useCustomToast();

  // Métodos para questionários
  const loadQuestionnaires = useCallback(async () => {
    console.log("Carregando todos os questionários");
    setIsLoading(true);
    setError(null);
    try {
      const data = await QuestionnaireService.getAllQuestionnaires();
      console.log("Questionários carregados:", data);
      setQuestionnaires(data);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar questionários";
      console.error("Erro ao carregar questionários:", errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserQuestionnaires = useCallback(async (userId: string) => {
    console.log(`Carregando questionários do usuário ${userId}`);
    setIsLoading(true);
    setError(null);
    try {
      const data = await QuestionnaireService.getQuestionnairesByUserId(userId);
      console.log("Questionários do usuário carregados:", data);
      setQuestionnaires(data);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Erro ao carregar questionários do usuário";
      console.error(
        `Erro ao carregar questionários do usuário ${userId}:`,
        errorMessage
      );
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getQuestionnaire = useCallback(
    async (id: string) => {
      console.log("Buscando questionário:", id);
      setIsLoading(true);
      setError(null);
      try {
        const data = await QuestionnaireService.getQuestionnaireById(id);
        console.log("Resultado da busca do questionário:", data);
        return data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao buscar questionário";
        console.error("Erro ao buscar questionário:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    // Se possível, garanta que o retorno de useCustomToast seja estável para não forçar a recriação da função
    [toast]
  );

  const createQuestionnaire = useCallback(
    async (data: CreateQuestionnaireDTO) => {
      console.log("Criando questionário:", data);
      setIsLoading(true);
      setError(null);
      try {
        const newQuestionnaire = await QuestionnaireService.createQuestionnaire(
          data
        );
        console.log("Questionário criado com sucesso:", newQuestionnaire);
        setQuestionnaires((prev) => [...prev, newQuestionnaire]);
        toast.success("Sucesso", "Questionário criado com sucesso");
        return newQuestionnaire;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao criar questionário";
        console.error("Erro ao criar questionário:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const updateQuestionnaire = useCallback(
    async (id: string, data: UpdateQuestionnaireDTO) => {
      console.log(`Atualizando questionário ${id} com dados:`, data);
      setIsLoading(true);
      setError(null);
      try {
        const updatedQuestionnaire =
          await QuestionnaireService.updateQuestionnaire(id, data);
        console.log("Questionário atualizado:", updatedQuestionnaire);
        setQuestionnaires((prev) =>
          prev.map((q) => (q.id === id ? updatedQuestionnaire : q))
        );
        toast.success("Sucesso", "Questionário atualizado com sucesso");
        return updatedQuestionnaire;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao atualizar questionário";
        console.error("Erro ao atualizar questionário:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const deleteQuestionnaire = useCallback(
    async (id: string) => {
      console.log("Excluindo questionário:", id);
      setIsLoading(true);
      setError(null);
      try {
        await QuestionnaireService.deleteQuestionnaire(id);
        console.log("Questionário excluído com sucesso:", id);
        setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
        toast.success("Sucesso", "Questionário excluído com sucesso");
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao excluir questionário";
        console.error("Erro ao excluir questionário:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Métodos para responsáveis
  const loadResponsibles = useCallback(async () => {
    console.log("Carregando responsáveis");
    setIsLoading(true);
    setError(null);
    try {
      const data = await ResponsibleService.getAllResponsibles();
      console.log("Responsáveis carregados:", data);
      setResponsibles(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar responsáveis";
      console.error("Erro ao carregar responsáveis:", errorMessage);
      setError(errorMessage);
      toast.error("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getResponsible = useCallback(
    async (id: string) => {
      console.log("Buscando responsável:", id);
      setIsLoading(true);
      setError(null);
      try {
        const data = await ResponsibleService.getResponsibleById(id);
        console.log("Responsável encontrado:", data);
        return data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao buscar responsável";
        console.error("Erro ao buscar responsável:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const createResponsible = useCallback(
    async (data: CreateResponsibleDTO) => {
      console.log("Criando responsável:", data);
      setIsLoading(true);
      setError(null);
      try {
        const newResponsible = await ResponsibleService.createResponsible(data);
        console.log("Responsável criado com sucesso:", newResponsible);
        setResponsibles((prev) => [...prev, newResponsible]);
        toast.success("Sucesso", "Responsável criado com sucesso");
        return newResponsible;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao criar responsável";
        console.error("Erro ao criar responsável:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const updateResponsible = useCallback(
    async (id: string, data: UpdateResponsibleDTO) => {
      console.log(`Atualizando responsável ${id} com dados:`, data);
      setIsLoading(true);
      setError(null);
      try {
        const updatedResponsible = await ResponsibleService.updateResponsible(
          id,
          data
        );
        console.log("Responsável atualizado:", updatedResponsible);
        setResponsibles((prev) =>
          prev.map((r) => (r.id === id ? updatedResponsible : r))
        );
        toast.success("Sucesso", "Responsável atualizado com sucesso");
        return updatedResponsible;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao atualizar responsável";
        console.error("Erro ao atualizar responsável:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const deleteResponsible = useCallback(
    async (id: string) => {
      console.log("Excluindo responsável:", id);
      setIsLoading(true);
      setError(null);
      try {
        await ResponsibleService.deleteResponsible(id);
        console.log("Responsável excluído com sucesso:", id);
        setResponsibles((prev) => prev.filter((r) => r.id !== id));
        toast.success("Sucesso", "Responsável excluído com sucesso");
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao excluir responsável";
        console.error("Erro ao excluir responsável:", errorMessage);
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const value = {
    questionnaires,
    responsibles,
    isLoading,
    error,
    loadQuestionnaires,
    loadUserQuestionnaires,
    getQuestionnaire,
    createQuestionnaire,
    updateQuestionnaire,
    deleteQuestionnaire,
    loadResponsibles,
    getResponsible,
    createResponsible,
    updateResponsible,
    deleteResponsible,
  };

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error(
      "useQuestionnaire deve ser usado dentro de um QuestionnaireProvider"
    );
  }
  return context;
}
