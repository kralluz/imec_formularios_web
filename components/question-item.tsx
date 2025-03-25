"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuestion } from "@/contexts/question-context";
import { useCustomToast } from "@/hooks/use-custom-toast";
import QuestionForm from "./question-form";
import type { Question } from "@/types/question";
import { Modal } from "antd";

interface QuestionItemProps {
  question: Question;
  questionnaireId: string;
  onUpdate: () => void;
  level?: number;
}

export default function QuestionItem({ question, questionnaireId, onUpdate, level = 0 }: QuestionItemProps) {
  const { deleteQuestion } = useQuestion();
  const toast = useCustomToast();

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
    if (window.confirm(`Tem certeza que deseja excluir a questão "${question.text}"?`)) {
      try {
        const success = await deleteQuestion(question.id);
        if (success) {
          toast.success("Questão excluída", "A questão foi excluída com sucesso");
          onUpdate();
        }
      } catch (error) {
        console.error("Erro ao excluir questão:", error);
        toast.error("Erro", "Ocorreu um erro ao excluir a questão");
      }
    }
  };

  return (
    <div className={`mb-4 ${level > 0 ? "ml-6" : ""}`}>
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center">
            {question.childQuestions && question.childQuestions.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(!expanded)}
                className="mr-2 h-6 w-6 p-0"
              >
                {expanded ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
              </Button>
            )}
            <CardTitle className="text-base text-gray-800 dark:text-white">{question.text}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {formatQuestionType(question.type)}
            </Badge>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditModal(true)}
                className="h-7 w-7 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
              >
                <FaEdit size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-7 w-7 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <FaTrash size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddModal(true)}
                className="h-7 w-7 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <FaPlus size={14} />
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
          getNextIndex={() => 1}
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
          defaultIndex={1}
          onCancel={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onUpdate();
          }}
          getNextIndex={() => 1}
        />
      </Modal>
    </div>
  );
}
