import { apiService } from "./apiService";
import { wrapResponse } from "./ApiServiceConfig";
import type {
  Quiz,
  QuizAttempt,
  GenerateQuizRequest,
  GenerateQuizResponse,
  AnalyzeEssayRequest,
  AnalyzeEssayResponse,
  LearningContent,
  GenerateContentRequest,
  GenerateContentResponse,
  AIAnalysis,
} from "@/model/ai/aiTypes";

export const aiService = {
  // ============ QUIZ GENERATION ============
  
  /** Generate quiz from lesson content using AI */
  generateQuizFromLesson: async (request: GenerateQuizRequest): Promise<GenerateQuizResponse> => {
    try {
      const response = await apiService.privateApiClient.post<GenerateQuizResponse>(
        "/ai/generate-quiz",
        request
      );
      return wrapResponse(response);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      return {
        success: false,
        error: "Failed to generate quiz. Please try again.",
      };
    }
  },

  /** Get all quizzes for a lesson */
  getQuizzesByLesson: async (lessonId: string): Promise<Quiz[]> => {
    const response = await apiService.privateApiClient.get<Quiz[]>(
      `/lessons/${lessonId}/quizzes`
    );
    return wrapResponse(response);
  },

  /** Get quiz by ID */
  getQuizById: async (quizId: string): Promise<Quiz> => {
    const response = await apiService.privateApiClient.get<Quiz>(`/quizzes/${quizId}`);
    return wrapResponse(response);
  },

  /** Update quiz (edit questions, settings) */
  updateQuiz: async (quizId: string, quiz: Partial<Quiz>): Promise<Quiz> => {
    const response = await apiService.privateApiClient.put<Quiz>(
      `/quizzes/${quizId}`,
      quiz
    );
    return wrapResponse(response);
  },

  /** Delete quiz */
  deleteQuiz: async (quizId: string): Promise<void> => {
    const response = await apiService.privateApiClient.delete<void>(`/quizzes/${quizId}`);
    return wrapResponse(response);
  },

  // ============ QUIZ ATTEMPTS (STUDENT) ============
  
  /** Start quiz attempt */
  startQuizAttempt: async (quizId: string): Promise<QuizAttempt> => {
    const response = await apiService.privateApiClient.post<QuizAttempt>(
      `/quizzes/${quizId}/attempts`
    );
    return wrapResponse(response);
  },

  /** Submit quiz answers */
  submitQuizAttempt: async (
    attemptId: string,
    answers: QuizAttempt["answers"]
  ): Promise<QuizAttempt> => {
    const response = await apiService.privateApiClient.post<QuizAttempt>(
      `/quiz-attempts/${attemptId}/submit`,
      { answers }
    );
    return wrapResponse(response);
  },

  /** Get quiz attempt results */
  getQuizAttempt: async (attemptId: string): Promise<QuizAttempt> => {
    const response = await apiService.privateApiClient.get<QuizAttempt>(
      `/quiz-attempts/${attemptId}`
    );
    return wrapResponse(response);
  },

  /** Get all attempts for a quiz (teacher view) */
  getQuizAttempts: async (quizId: string): Promise<QuizAttempt[]> => {
    const response = await apiService.privateApiClient.get<QuizAttempt[]>(
      `/quizzes/${quizId}/attempts`
    );
    return wrapResponse(response);
  },

  // ============ AI CONTENT GENERATION ============
  
  /** Generate structured learning content from lesson materials */
  generateLearningContent: async (
    request: GenerateContentRequest
  ): Promise<GenerateContentResponse> => {
    try {
      const response = await apiService.privateApiClient.post<GenerateContentResponse>(
        "/ai/generate-content",
        request
      );
      return wrapResponse(response);
    } catch (error) {
      console.error("Failed to generate content:", error);
      return {
        success: false,
        error: "Failed to generate content. Please try again.",
      };
    }
  },

  /** Get learning content for a lesson */
  getLearningContent: async (lessonId: string): Promise<LearningContent | null> => {
    try {
      const response = await apiService.privateApiClient.get<LearningContent>(
        `/lessons/${lessonId}/content`
      );
      return wrapResponse(response);
    } catch (error) {
      console.warn("No learning content found for lesson:", lessonId);
      return null;
    }
  },

  // ============ AI ESSAY ANALYSIS ============
  
  /** Analyze student essay and provide feedback */
  analyzeEssay: async (request: AnalyzeEssayRequest): Promise<AnalyzeEssayResponse> => {
    try {
      const response = await apiService.privateApiClient.post<AnalyzeEssayResponse>(
        "/ai/analyze-essay",
        request
      );
      return wrapResponse(response);
    } catch (error) {
      console.error("Failed to analyze essay:", error);
      return {
        success: false,
        error: "Failed to analyze essay. Please try again.",
      };
    }
  },

  /** Get AI analysis for a specific submission */
  getEssayAnalysis: async (submissionId: string): Promise<AIAnalysis> => {
    const response = await apiService.privateApiClient.get<AIAnalysis>(
      `/submissions/${submissionId}/analysis`
    );
    return wrapResponse(response);
  },

  // ============ ANALYTICS ============
  
  /** Get quiz analytics for teacher */
  getQuizAnalytics: async (quizId: string) => {
    const response = await apiService.privateApiClient.get(
      `/quizzes/${quizId}/analytics`
    );
    return wrapResponse(response);
  },

  /** Get student performance analytics */
  getStudentAnalytics: async (studentId: string, lessonId?: string) => {
    const url = lessonId
      ? `/students/${studentId}/analytics?lessonId=${lessonId}`
      : `/students/${studentId}/analytics`;
    const response = await apiService.privateApiClient.get(url);
    return wrapResponse(response);
  },
};

export default aiService;



<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
