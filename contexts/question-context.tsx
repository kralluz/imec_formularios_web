"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import QuestionService from "@/services/question-service";
import { useCustomToast } from "@/hooks/use-custom-toast";
import type {
  Question,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from "@/types/question";

type QuestionContextType = {
  questions: Question[];
  hierarchicalQuestions: Question[];
  isLoading: boolean;
  error: string | null;
  selectedQuestionnaireId: string | null;
  loadQuestionsByQuestionnaire: (questionnaireId: string) => Promise<void>;
  getQuestion: (id: string) => Promise<Question | null>;
  createQuestion: (data: CreateQuestionDTO) => Promise<Question | null>;
  updateQuestion: (
    id: string,
    data: UpdateQuestionDTO
  ) => Promise<Question | null>;
  deleteQuestion: (id: string) => Promise<boolean>;
  setSelectedQuestionnaireId: (id: string | null) => void;
};

const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

export function QuestionProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hierarchicalQuestions, setHierarchicalQuestions] = useState<
    Question[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<
    string | null
  >(null);
  const toast = useCustomToast();

  // Método para carregar questões de um questionário
  const loadQuestionsByQuestionnaire = useCallback(
    async (questionnaireId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await QuestionService.getQuestionsByQuestionnaire({
          questionnaireId,
        });
        setQuestions(data);
        const organized = QuestionService.organizeQuestionsHierarchy(data);
        setHierarchicalQuestions(organized);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao carregar questões";
        setError(errorMessage);
        console.error("Erro ao carregar questões:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Método para buscar uma questão por ID
  const getQuestion = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await QuestionService.getQuestionById(id);
        return data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao buscar questão";
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Método para criar uma questão
  const createQuestion = useCallback(
    async (data: CreateQuestionDTO) => {
      setIsLoading(true);
      setError(null);
      try {
        const newQuestion = await QuestionService.createQuestion(data);
        setQuestions((prev) => [...prev, newQuestion]);
        const updatedQuestions = [...questions, newQuestion];
        const organized =
          QuestionService.organizeQuestionsHierarchy(updatedQuestions);
        setHierarchicalQuestions(organized);
        toast.success("Sucesso", "Questão criada com sucesso");
        return newQuestion;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao criar questão";
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, questions]
  );

  // Método para atualizar uma questão
  const updateQuestion = useCallback(
    async (id: string, data: UpdateQuestionDTO) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedQuestion = await QuestionService.updateQuestion(id, data);
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? updatedQuestion : q))
        );
        const updatedQuestions = questions.map((q) =>
          q.id === id ? updatedQuestion : q
        );
        const organized =
          QuestionService.organizeQuestionsHierarchy(updatedQuestions);
        setHierarchicalQuestions(organized);
        toast.success("Sucesso", "Questão atualizada com sucesso");
        return updatedQuestion;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao atualizar questão";
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, questions]
  );

  // Método para excluir uma questão
  const deleteQuestion = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await QuestionService.deleteQuestion(id);
        const updatedQuestions = questions.filter((q) => q.id !== id);
        setQuestions(updatedQuestions);
        const organized =
          QuestionService.organizeQuestionsHierarchy(updatedQuestions);
        setHierarchicalQuestions(organized);
        toast.success("Sucesso", "Questão excluída com sucesso");
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao excluir questão";
        setError(errorMessage);
        toast.error("Erro", errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, questions]
  );

  const value = {
    questions,
    hierarchicalQuestions,
    isLoading,
    error,
    selectedQuestionnaireId,
    loadQuestionsByQuestionnaire,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    setSelectedQuestionnaireId,
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestion() {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error("useQuestion deve ser usado dentro de um QuestionProvider");
  }
  return context;
}
