"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuestion } from "@/contexts/question-context";
import { message, Modal } from "antd";
import QuestionForm from "@/components/question-form";
import QuestionItem from "@/components/question-item";

interface QuestionnaireQuestionsProps {
  questionnaireId: string;
  title: string;
}

export default function QuestionnaireQuestions({
  questionnaireId,
  title,
}: QuestionnaireQuestionsProps) {
  const { loadQuestionsByQuestionnaire, hierarchicalQuestions, isLoading } =
    useQuestion();
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log(
        "Carregando questões para o questionário:",
        questionnaireId,
        "RefreshKey:",
        refreshKey
      );
      try {
        await loadQuestionsByQuestionnaire(questionnaireId);
        console.log("Questões carregadas com sucesso.");
      } catch (error) {
        console.error("Erro ao carregar questões:", error);
        message.error("Não foi possível carregar as questões do questionário");
      }
    };
    fetchQuestions();
  }, [questionnaireId, refreshKey]);

  const handleUpdate = () => {
    console.log("Atualizando lista de questões");
    setRefreshKey((prev) => prev + 1);
  };

  const getNextIndex = (parentId?: string): number => {
    if (!parentId) {
      const topQuestions = hierarchicalQuestions.filter(
        (q: any) => !q.parentId
      );
      if (topQuestions.length === 0) return 1;
      return Math.max(...topQuestions.map((q: any) => q.index || 0)) + 1;
    } else {
      const parent = hierarchicalQuestions.find((q: any) => q.id === parentId);
      const children = parent?.children || [];
      if (children.length === 0) return 1;
      return Math.max(...children.map((child: any) => child.index || 0)) + 1;
    }
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setModalVisible(true);
  };

  const openEditModal = (question: any) => {
    setEditingQuestion(question);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingQuestion(null);
  };

  const handleModalSuccess = () => {
    message.success(
      editingQuestion
        ? "Pergunta atualizada com sucesso"
        : "Pergunta adicionada com sucesso"
    );
    setModalVisible(false);
    setEditingQuestion(null);
    handleUpdate();
  };

  return (
    <>
      <Card className="border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl text-gray-800 dark:text-white">
            Questões - {title}
          </CardTitle>
          <Button
            onClick={openAddModal}
            className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            <FaPlus className="mr-2" /> Nova Questão
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
            </div>
          ) : hierarchicalQuestions.length > 0 ? (
            <div className="space-y-2">
              {hierarchicalQuestions.map((question: any) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  questionnaireId={questionnaireId}
                  onUpdate={handleUpdate}
                  onEdit={openEditModal}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 p-6 text-center dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Este questionário ainda não possui questões. Clique em "Nova
                Questão" para adicionar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        title={editingQuestion ? "Editar Pergunta" : "Adicionar Nova Pergunta"}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose
      >
        <QuestionForm
          questionnaireId={questionnaireId}
          defaultIndex={
            editingQuestion ? editingQuestion.index : getNextIndex()
          }
          initialValues={editingQuestion || {}}
          onCancel={handleModalCancel}
          onSuccess={handleModalSuccess}
          getNextIndex={getNextIndex}
        />
      </Modal>
    </>
  );
}
