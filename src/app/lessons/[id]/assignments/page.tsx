"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { useLesson } from "@/hooks/useLesson";
import { aiService } from "@/services/aiService";
import type { Quiz, GenerateQuizRequest } from "@/model/ai/aiTypes";
import { QuestionDifficulty, QuestionType } from "@/model/ai/aiTypes";
import { toast } from "@/lib/toast";

export default function AssignmentsPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { lesson, isLoading: lessonLoading } = useLesson(lessonId);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  
  // Quiz generation settings
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(QuestionDifficulty.MEDIUM);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.TRUE_FALSE,
    QuestionType.SHORT_ANSWER,
  ]);

  // Load existing quizzes
  useEffect(() => {
    const loadQuizzes = async () => {
      if (!lessonId) return;

      try {
        setIsLoadingQuizzes(true);
        const quizList = await aiService.getQuizzesByLesson(lessonId);
        setQuizzes(quizList);
      } catch (error) {
        console.error("Error loading quizzes:", error);
      } finally {
        setIsLoadingQuizzes(false);
      }
    };

    loadQuizzes();
  }, [lessonId]);

  // Generate quiz with AI
  const generateQuiz = async () => {
    if (!lesson || !lessonId) {
      toast.error("Lesson information not available");
      return;
    }

    if (!lesson.documentUrl && !lesson.videoUrl) {
      toast.error("Please upload a document or video to generate assignments");
      return;
    }

    try {
      setIsGenerating(true);
      const request: GenerateQuizRequest = {
        lessonId: lessonId,
        documentUrl: lesson.documentUrl,
        numberOfQuestions,
        difficulty,
        questionTypes,
      };

      const response = await aiService.generateQuizFromLesson(request);

      if (response.success && response.quiz) {
        setQuizzes((prev) => [response.quiz!, ...prev]);
        setShowGenerator(false);
        toast.success("Assignment generated successfully!");
      } else {
        toast.error(response.error || "Failed to generate assignment");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate assignment");
    } finally {
      setIsGenerating(false);
    }
  };

  if (lessonLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-600 dark:text-gray-400 py-10">
          Loading lesson...
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-600 dark:text-gray-400 py-10">
          Lesson not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Assignments
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {lesson.title}
            </p>
          </div>
          {(lesson.documentUrl || lesson.videoUrl) && (
            <Button
              onClick={() => setShowGenerator(!showGenerator)}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {showGenerator ? "Cancel" : "Generate Assignment with AI"}
            </Button>
          )}
        </div>

        {/* Quiz Generator Form */}
        {showGenerator && (
          <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                AI Assignment Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value={QuestionDifficulty.EASY}>Easy</option>
                  <option value={QuestionDifficulty.MEDIUM}>Medium</option>
                  <option value={QuestionDifficulty.HARD}>Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Types
                </label>
                <div className="space-y-2">
                  {Object.values(QuestionType).map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={questionTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setQuestionTypes([...questionTypes, type]);
                          } else {
                            setQuestionTypes(questionTypes.filter((t) => t !== type));
                          }
                        }}
                        className="rounded border-orange-300"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateQuiz}
                disabled={isGenerating || questionTypes.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Assignment...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Assignment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* No files warning */}
        {!lesson.documentUrl && !lesson.videoUrl && (
          <Card className="rounded-2xl border border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Upload a document or video to generate assignments automatically with AI.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quizzes List */}
        {isLoadingQuizzes ? (
          <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading assignments...</span>
              </div>
            </CardContent>
          </Card>
        ) : quizzes.length === 0 ? (
          <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <BookOpen className="w-12 h-12 text-orange-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    No Assignments Yet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lesson.documentUrl || lesson.videoUrl
                      ? "Generate your first assignment using AI."
                      : "Upload lesson materials to generate assignments."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {quiz.generatedByAI && (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                        AI
                      </span>
                    )}
                  </div>
                  {quiz.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {quiz.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {quiz.questions.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Points:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {quiz.totalPoints}
                    </span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time Limit:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {quiz.timeLimit} minutes
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span
                      className={`font-medium ${
                        quiz.isPublished
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {quiz.isPublished ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Published
                        </span>
                      ) : (
                        "Draft"
                      )}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500"
                    onClick={() => {
                      window.location.href = `/lessons/${lessonId}/quiz/${quiz.id}`;
                    }}
                  >
                    Start Assignment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

