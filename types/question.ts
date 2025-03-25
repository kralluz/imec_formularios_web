import type { Questionnaire } from "./questionnaire"

export type QuestionType = "text" | "radio" | "checkbox" | "select" | "textarea" | "number" | "date"

export interface QuestionOption {
  id?: string
  questionId?: string
  label: string
  value: string
  createdAt?: string
}

export interface Question {
  id?: string
  questionnaireId: string
  parentQuestionId?: string | null
  triggerValue?: string | null
  orderIndex: number
  text: string
  type: QuestionType
  createdAt?: string
  options?: QuestionOption[]
  childQuestions?: Question[]
}

export interface CreateQuestionDTO {
  questionnaireId: string
  parentQuestionId?: string | null
  triggerValue?: string | null
  orderIndex: number
  text: string
  type: QuestionType
  options: Omit<QuestionOption, "id" | "questionId" | "createdAt">[]
}

export interface UpdateQuestionDTO {
  text?: string
  type?: QuestionType
  orderIndex?: number
  triggerValue?: string | null
  options?: Omit<QuestionOption, "id" | "questionId" | "createdAt">[]
}

export interface GetQuestionsByQuestionnaireDTO {
  questionnaireId: string
}

export interface QuestionnaireWithQuestions extends Questionnaire {
  questions: Question[]
}

