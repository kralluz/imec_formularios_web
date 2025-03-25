export type ResponsibleRole = "MEDICO" | "ENFERMEIRA" | "TECNICO" | "OUTRO"
export type RegistrationType = "CRM" | "COREN" | "OUTRO"

export interface Responsible {
  id?: string
  name: string
  role: ResponsibleRole
  registrationType: RegistrationType
  registrationId: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface QuestionOption {
  id?: string
  questionId?: string
  label: string
  value: string
  createdAt?: string
}

export interface Question {
  id?: string
  questionnaireId?: string
  parentQuestionId?: string | null
  triggerValue?: string | null
  orderIndex: number
  text: string
  type: "text" | "radio" | "checkbox" | "select" | "textarea" | "number" | "date"
  createdAt?: string
  options?: QuestionOption[]
  childQuestions?: Question[]
}

export interface Questionnaire {
  id?: string
  title: string
  icon: string
  userId: string
  responsibles: Responsible[]
  createdAt?: string
  updatedAt?: string
  questions?: Question[]
}

export interface CreateQuestionnaireDTO {
  title: string
  icon: string
  userId: string
  responsibles: Omit<Responsible, "id" | "createdAt" | "updatedAt" | "deletedAt">[]
}

export interface UpdateQuestionnaireDTO {
  title?: string
  icon?: string
}

export interface CreateResponsibleDTO {
  name: string
  role: ResponsibleRole
  registrationType: RegistrationType
  registrationId: string
}

export interface UpdateResponsibleDTO {
  name?: string
  role?: ResponsibleRole
  registrationType?: RegistrationType
  registrationId?: string
}

