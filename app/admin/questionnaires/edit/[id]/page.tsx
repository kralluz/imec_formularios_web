"use client"

import { useParams } from "next/navigation"
import QuestionnaireForm from "@/components/questionnaire-form"

export default function EditQuestionnairePage() {
  const params = useParams()
  const questionnaireId = params.id as string

  return (
    <div className="animate-scale-in opacity-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">Editar Questionário</span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Atualize as informações do questionário</p>
      </div>

      <QuestionnaireForm questionnaireId={questionnaireId} />
    </div>
  )
}

