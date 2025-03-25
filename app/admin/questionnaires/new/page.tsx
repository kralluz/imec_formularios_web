"use client"

import QuestionnaireForm from "@/components/questionnaire-form"

export default function NewQuestionnairePage() {
  return (
    <div className="animate-scale-in opacity-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-600 dark:text-purple-400">Novo Questionário</span>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Crie um novo questionário e adicione responsáveis</p>
      </div>

      {/* Não passamos questionnaireId para indicar que é um novo questionário */}
      <QuestionnaireForm />
    </div>
  )
}

