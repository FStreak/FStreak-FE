/** AI-Generated Content Types */

// Quiz Question Types
export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  ESSAY = "essay",
}

export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  points: number;
  options?: string[]; // For multiple choice
  correctAnswer?: string | string[]; // For auto-grading
  explanation?: string; // AI-generated explanation
  topic?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  totalPoints: number;
  timeLimit?: number; // in minutes
  passingScore?: number;
  isPublished: boolean;
  generatedByAI: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Student Quiz Attempt
export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  timeSpent?: number; // seconds
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: QuizAnswer[];
  score?: number;
  maxScore: number;
  percentage?: number;
  status: "in_progress" | "submitted" | "graded";
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
}

// AI Analysis Results
export interface AIAnalysis {
  id: string;
  content: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    grammarErrors?: Array<{
      text: string;
      correction: string;
      explanation: string;
    }>;
    contentScore?: number; // 0-100
    clarityScore?: number;
    grammarScore?: number;
    overallScore?: number;
  };
  generatedAt: string;
}

// AI Content Generation Request/Response
export interface GenerateQuizRequest {
  lessonId: string;
  contentText?: string;
  documentUrl?: string;
  numberOfQuestions: number;
  difficulty?: QuestionDifficulty;
  questionTypes?: QuestionType[];
  topics?: string[];
}

export interface GenerateQuizResponse {
  success: boolean;
  quiz?: Quiz;
  message?: string;
  error?: string;
}

export interface AnalyzeEssayRequest {
  essayText: string;
  questionPrompt?: string;
  rubric?: string;
  studentId?: string;
}

export interface AnalyzeEssayResponse {
  success: boolean;
  analysis?: AIAnalysis;
  suggestions?: string[];
  estimatedScore?: number;
  message?: string;
  error?: string;
}

// Learning Content Structure
export interface LearningContent {
  id: string;
  lessonId: string;
  sections: Array<{
    title: string;
    content: string;
    order: number;
    keyPoints: string[];
    examples?: string[];
  }>;
  summary: string;
  keyTakeaways: string[];
  generatedByAI: boolean;
  createdAt: string;
}

export interface GenerateContentRequest {
  lessonId: string;
  documentUrl?: string;
  videoTranscript?: string;
  targetAudience?: "beginner" | "intermediate" | "advanced";
  contentLength?: "short" | "medium" | "long";
}

export interface GenerateContentResponse {
  success: boolean;
  content?: LearningContent;
  message?: string;
  error?: string;
}




