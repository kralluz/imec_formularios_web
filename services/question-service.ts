import api from "./api";
import type {
  Question,
  CreateQuestionDTO,
  UpdateQuestionDTO,
  GetQuestionsByQuestionnaireDTO,
} from "@/types/question";

// Função auxiliar para validar UUID
const isValidUUID = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const QuestionService = {
  /**
   * Obter todas as questões de um questionário.
   * Utiliza o endpoint POST /questions/by-questionnaire.
   */
  async getQuestionsByQuestionnaire(
    data: GetQuestionsByQuestionnaireDTO
  ): Promise<Question[]> {
    if (!isValidUUID(data.questionnaireId)) {
      console.error("ID de questionário inválido:", data.questionnaireId);
      return [];
    }
    try {
      const response = await api.post<Question[]>(
        "/questions/by-questionnaire",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar questões do questionário:", error);
      return [];
    }
  },

  /**
   * Cria uma nova questão.
   * Endpoint: POST /questions/
   */
  async createQuestion(data: CreateQuestionDTO): Promise<Question> {
    try {
      const response = await api.post<Question>("/questions", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar questão:", error);
      throw error;
    }
  },

  /**
   * Obtém uma questão pelo ID.
   * Endpoint: GET /questions/{id}
   */
  async getQuestionById(id: string): Promise<Question | null> {
    if (!isValidUUID(id)) {
      console.error("ID de questão inválido:", id);
      return null;
    }
    try {
      const response = await api.get<Question>(`/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar questão ${id}:`, error);
      return null;
    }
  },

  /**
   * Atualiza uma questão.
   * Endpoint: PUT /questions/{id}
   */
  async updateQuestion(id: string, data: UpdateQuestionDTO): Promise<Question> {
    if (!isValidUUID(id)) {
      throw new Error("ID de questão inválido");
    }
    try {
      const response = await api.put<Question>(`/questions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar questão ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deleta uma questão.
   * Endpoint: DELETE /questions/{id}
   */
  async deleteQuestion(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new Error("ID de questão inválido");
    }
    try {
      await api.delete(`/questions/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar questão ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza uma opção de questão.
   * Endpoint: PUT /questions/options/{id}
   */
  async updateQuestionOption(id: string, data: any): Promise<any> {
    if (!isValidUUID(id)) {
      throw new Error("ID da opção de questão inválido");
    }
    try {
      const response = await api.put<any>(`/questions/options/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar opção da questão ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deleta uma opção de questão.
   * Endpoint: DELETE /questions/options/{id}
   */
  async deleteQuestionOption(id: string): Promise<void> {
    if (!isValidUUID(id)) {
      throw new Error("ID da opção de questão inválido");
    }
    try {
      await api.delete(`/questions/options/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar opção da questão ${id}:`, error);
      throw error;
    }
  },

  /**
   * Organiza uma lista de questões em hierarquia (questões pai e filhas).
   */
  organizeQuestionsHierarchy(questions: Question[]): Question[] {
    // Cria um mapa de todas as questões por ID, garantindo que cada questão tenha a propriedade childQuestions definida.
    const questionsMap = new Map<
      string,
      Question & { childQuestions: Question[] }
    >();
    questions.forEach((question) => {
      if (question.id) {
        // Se childQuestions não estiver definido, utiliza um array vazio.
        questionsMap.set(question.id, {
          ...question,
          childQuestions: question.childQuestions ?? [],
        });
      }
    });

    // Organiza as questões em uma estrutura hierárquica.
    const rootQuestions: (Question & { childQuestions: Question[] })[] = [];
    questionsMap.forEach((question) => {
      if (!question.parentQuestionId) {
        // Questão raiz.
        rootQuestions.push(question);
      } else {
        // Questão filha.
        const parent = questionsMap.get(question.parentQuestionId);
        if (parent) {
          parent.childQuestions.push(question);
        } else {
          // Se o pai não for encontrado, trata como questão raiz.
          rootQuestions.push(question);
        }
      }
    });

    // Função recursiva para ordenar as questões por orderIndex.
    const sortQuestions = (questions: Question[]): Question[] => {
      return questions
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((q) => ({
          ...q,
          childQuestions: q.childQuestions
            ? sortQuestions(q.childQuestions)
            : [],
        }));
    };

    return sortQuestions(rootQuestions);
  },
};

export default QuestionService;
