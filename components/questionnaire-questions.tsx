"use client"

import { useState, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuestion } from "@/contexts/question-context"
import { useCustomToast } from "@/hooks/use-custom-toast"
import QuestionForm from "@/components/question-form"
import QuestionItem from "@/components/question-item"

interface QuestionnaireQuestionsProps {
  questionnaireId: string
  title: string
}

export default function QuestionnaireQuestions({ questionnaireId, title }: QuestionnaireQuestionsProps) {
  const { loadQuestionsByQuestionnaire, hierarchicalQuestions, isLoading } = useQuestion()
  const toast = useCustomToast()

  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchQuestions = async () => {
      console.log("Carregando questões para o questionário:", questionnaireId, "RefreshKey:", refreshKey)
      try {
        await loadQuestionsByQuestionnaire(questionnaireId)
        console.log("Questões carregadas com sucesso.")
      } catch (error) {
        console.error("Erro ao carregar questões:", error)
        toast.error("Erro", "Não foi possível carregar as questões do questionário")
      }
    }
    fetchQuestions()
    // O efeito roda apenas quando questionnaireId ou refreshKey mudar
  }, [questionnaireId, refreshKey])

  const handleUpdate = () => {
    console.log("Atualizando lista de questões")
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <Card className="border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl text-gray-800 dark:text-white">Questões - {title}</CardTitle>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          <FaPlus className="mr-2" /> Nova Questão
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-6">
            <QuestionForm
              questionnaireId={questionnaireId}
              onCancel={() => setShowAddForm(false)}
              onSuccess={() => {
                console.log("Questão adicionada com sucesso")
                setShowAddForm(false)
                handleUpdate()
              }}
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
          </div>
        ) : hierarchicalQuestions.length > 0 ? (
          <div className="space-y-2">
            {hierarchicalQuestions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                questionnaireId={questionnaireId}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-gray-200 p-6 text-center dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Este questionário ainda não possui questões. Clique em "Nova Questão" para adicionar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
