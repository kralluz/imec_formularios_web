"use client";

import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuestion } from "@/contexts/question-context";
import QuestionForm from "./question-form";
import type { Question } from "@/types/question";
import { Button, Modal, notification } from "antd";

interface QuestionItemProps {
  question: Question;
  questionnaireId: string;
  onUpdate: () => void;
  level?: number;
}

export default function QuestionItem({
  question,
  questionnaireId,
  onUpdate,
  level = 0,
}: QuestionItemProps) {
  const { deleteQuestion } = useQuestion();

  const [expanded, setExpanded] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const formatQuestionType = (type: string): string => {
    const typeMap: Record<string, string> = {
      text: "Texto",
      textarea: "Área de Texto",
      number: "Número",
      date: "Data",
      radio: "Múltipla Escolha",
      checkbox: "Caixas de Seleção",
      select: "Lista Suspensa",
    };
    return typeMap[type] || type;
  };

  const handleDelete = async () => {
    if (!question.id) return;

    Modal.confirm({
      title: "Confirmação",
      content: `Tem certeza que deseja excluir a questão "${question.text}"?`,
      okText: "Sim",
      cancelText: "Não",
      okButtonProps: {
        style: { backgroundColor: "#805ad5", borderColor: "#805ad5" },
      },
      cancelButtonProps: {
        style: { borderColor: "#805ad5", color: "#805ad5" },
        className: "custom-cancel-btn",
      },
      async onOk() {
        try {
          const success = await deleteQuestion(question.id);
          if (success) {
            notification.success({
              message: "Questão excluída",
              description: "A questão foi excluída com sucesso",
            });
            onUpdate();
          }
        } catch (error) {
          console.error("Erro ao excluir questão:", error);
          notification.error({
            message: "Erro",
            description: "Ocorreu um erro ao excluir a questão",
          });
        }
      },
    });
  };

  return (
    <div className={`mb-4 ${level > 0 ? "ml-6" : ""}`}>
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center">
            {question.childQuestions && question.childQuestions.length > 0 && (
              <Button
                type="text"
                onClick={() => setExpanded(!expanded)}
                className="mr-2 h-6 w-6 p-0"
              >
                {expanded ? (
                  <FaChevronDown size={14} />
                ) : (
                  <FaChevronRight size={14} />
                )}
              </Button>
            )}
            <CardTitle className="text-base text-gray-800 dark:text-white">
              {question.text}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant=""
              className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              {formatQuestionType(question.type)}
            </Badge>
            <div className="flex space-x-1">
              <Button
                type="default"
                onClick={() => setShowEditModal(true)}
                style={{
                  borderColor: "#805ad5",
                  color: "#805ad5",
                }}
                className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <FaEdit className="mr-2" /> Editar
              </Button>
              <Button
                type="default"
                onClick={handleDelete}
                style={{
                  borderColor: "#e53e3e",
                  color: "#e53e3e",
                }}
                className="hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FaTrash className="mr-2" /> Excluir
              </Button>
              <Button
                type="default"
                onClick={() => setShowAddModal(true)}
                style={{
                  borderColor: "#38a169",
                  color: "#38a169",
                }}
                className="hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <FaPlus className="mr-2" /> Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          {expanded &&
            question.childQuestions &&
            question.childQuestions.length > 0 && (
              <div className="mt-2">
                {question.childQuestions.map((childQuestion) => (
                  <QuestionItem
                    key={childQuestion.id}
                    question={childQuestion}
                    questionnaireId={questionnaireId}
                    onUpdate={onUpdate}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
        </CardContent>
      </Card>

      {/* Modal para editar a questão */}
      <Modal
        title="Editar Questão"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        destroyOnClose
      >
        <QuestionForm
          questionnaireId={questionnaireId}
          parentQuestionId={question.parentQuestionId}
          initialValues={question}
          defaultIndex={question.orderIndex}
          onCancel={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onUpdate();
          }}
          getNextIndex={() => question.orderIndex} // Em edição, o índice não é alterado
        />
      </Modal>

      {/* Modal para adicionar uma questão filha */}
      <Modal
        title="Adicionar Questão Filha"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        destroyOnClose
      >
        <QuestionForm
          questionnaireId={questionnaireId}
          parentQuestionId={question.id}
          initialValues={{}}
          defaultIndex={
            question.childQuestions && question.childQuestions.length > 0
              ? Math.max(...question.childQuestions.map((q) => q.orderIndex)) + 1
              : 1
          }
          onCancel={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onUpdate();
          }}
          getNextIndex={() => {
            if (question.childQuestions && question.childQuestions.length > 0) {
              return Math.max(...question.childQuestions.map((q) => q.orderIndex)) + 1;
            }
            return 1;
          }}
        />
      </Modal>
    </div>
  );
}
