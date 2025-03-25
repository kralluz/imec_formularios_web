"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import QuestionnaireQuestions from "@/components/questionnaire-questions";
import { useQuestionnaire } from "@/contexts/questionnaire-context";
import { message } from "antd";

export default function QuestionnaireDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const questionnaireId = params.id as string;
  const { getQuestionnaire, isLoading } = useQuestionnaire();

  const [title, setTitle] = useState("");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      console.log("Iniciando busca do questionário:", questionnaireId);
      try {
        const questionnaire = await getQuestionnaire(questionnaireId);
        if (questionnaire) {
          setTitle(questionnaire.title);
          console.log("Questionário carregado:", questionnaire.title);
          setShowContent(true);
        } else {
          console.error("Questionário não encontrado:", questionnaireId);
          message.error("Questionário não encontrado");
          router.push("/admin/questionnaires");
        }
      } catch (error) {
        console.error("Erro ao carregar questionário:", error);
        message.error("Não foi possível carregar os detalhes do questionário");
        router.push("/admin/questionnaires");
      }
    };

    fetchQuestionnaire();
  }, [questionnaireId]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`animate-scale-in transition-opacity duration-500 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/admin/questionnaires")}
            className="h-8 w-8"
          >
            <FaArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            <span className="text-purple-600 dark:text-purple-400">
              {title}
            </span>
          </h1>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gerencie as questões deste questionário
        </p>
      </div>
      <QuestionnaireQuestions questionnaireId={questionnaireId} title={title} />
    </div>
  );
}
