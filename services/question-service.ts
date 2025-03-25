import api from "./api"
import type { Question, CreateQuestionDTO, UpdateQuestionDTO, GetQuestionsByQuestionnaireDTO } from "@/types/question"

// Função auxiliar para validar UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

const QuestionService = {
  // Obter todas as questões de um questionário
  async getQuestionsByQuestionnaire(data: GetQuestionsByQuestionnaireDTO): Promise<Question[]> {
    try {
      if (!isValidUUID(data.questionnaireId)) {
        console.error("ID de questionário inválido:", data.questionnaireId)
        return []
      }

      const response = await api.post<Question[]>("/questions/by-questionnaire", data)
      return response.data
    } catch (error) {
      console.error("Erro ao buscar questões do questionário:", error)
      return []
    }
  },

  // Criar uma questão
  async createQuestion(data: CreateQuestionDTO): Promise<Question> {
    const response = await api.post<Question>("/questions", data)
    return response.data
  },

  // Obter uma questão por ID
  async getQuestionById(id: string): Promise<Question | null> {
    try {
      if (!isValidUUID(id)) {
        console.error("ID de questão inválido:", id)
        return null
      }

      const response = await api.get<Question>(`/questions/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar questão ${id}:`, error)
      return null
    }
  },

  // Atualizar uma questão
  async updateQuestion(id: string, data: UpdateQuestionDTO): Promise<Question> {
    if (!isValidUUID(id)) {
      throw new Error("ID de questão inválido")
    }

    const response = await api.put<Question>(`/questions/${id}`, data)
    return response.data
  },

  // Deletar uma questão
  async deleteQuestion(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new Error("ID de questão inválido")
    }

    await api.delete(`/questions/${id}`)
  },

  // Organizar questões em hierarquia (questões pai e filhas)
  organizeQuestionsHierarchy(questions: Question[]): Question[] {
    // Primeiro, criamos um mapa de todas as questões por ID
    const questionsMap = new Map<string, Question>()
    questions.forEach((question) => {
      if (question.id) {
        questionsMap.set(question.id, { ...question, childQuestions: [] })
      }
    })

    // Agora, organizamos as questões em uma estrutura hierárquica
    const rootQuestions: Question[] = []

    questionsMap.forEach((question) => {
      if (!question.parentQuestionId) {
        // Esta é uma questão raiz
        rootQuestions.push(question)
      } else {
        // Esta é uma questão filha
        const parent = questionsMap.get(question.parentQuestionId)
        if (parent) {
          if (!parent.childQuestions) {
            parent.childQuestions = []
          }
          parent.childQuestions.push(question)
        } else {
          // Se o pai não for encontrado, tratamos como questão raiz
          rootQuestions.push(question)
        }
      }
    })

    // Ordenar questões por orderIndex
    const sortQuestions = (questions: Question[]): Question[] => {
      return questions
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((q) => ({
          ...q,
          childQuestions: q.childQuestions ? sortQuestions(q.childQuestions) : [],
        }))
    }

    return sortQuestions(rootQuestions)
  },
}

export default QuestionService

