"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { privateApiService } from "@/services/ApiPrivate";
import { aiService } from "@/services/aiService";
import type { Lesson } from "@/model/lesson/lessonTypes";
import type { Quiz } from "@/model/ai/aiTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIQuizGenerator } from "../../components/AIQuizGenerator";
import { QuizList } from "../../components/QuizList";
import { toast } from "@/lib/toast";

export default function TeacherLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [lessonData, quizzesData] = await Promise.all([
          privateApiService.getLessonById(lessonId),
          aiService.getQuizzesByLesson(lessonId).catch(() => []),
        ]);
        setLesson(lessonData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error("Failed to fetch lesson data:", error);
        toast.error("Failed to load lesson");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  const handleQuizGenerated = async () => {
    try {
      const quizzesData = await aiService.getQuizzesByLesson(lessonId);
      setQuizzes(quizzesData);
      setShowGenerator(false);
    } catch (error) {
      console.error("Failed to refresh quizzes:", error);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await aiService.deleteQuiz(quizId);
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      toast.success("Quiz deleted successfully");
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Not Found</CardTitle>
            <CardDescription>The lesson you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              {lesson.title}
            </h1>
            <p className="text-muted-foreground mt-1">{lesson.description}</p>
          </div>
        </div>

        {/* Lesson Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lesson Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{lesson.durationMinutes || "N/A"} min</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">
                {lesson.isPublished ? "Published" : "Draft"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Document</p>
              <p className="font-semibold">
                {lesson.documentUrl ? "✅ Uploaded" : "❌ None"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Video</p>
              <p className="font-semibold">
                {lesson.videoUrl ? "✅ Uploaded" : "❌ None"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Quiz Generator */}
          <div className="lg:col-span-1">
            {showGenerator ? (
              <AIQuizGenerator lesson={lesson} onQuizGenerated={handleQuizGenerated} />
            ) : (
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">AI Quiz Generator</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate quiz questions automatically from your lesson content
                    </p>
                  </div>
                  <Button onClick={() => setShowGenerator(true)} className="w-full">
                    Generate Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Quizzes List */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Quizzes</h2>
              {showGenerator && (
                <Button variant="outline" onClick={() => setShowGenerator(false)}>
                  Hide Generator
                </Button>
              )}
            </div>
            <QuizList
              quizzes={quizzes}
              onEdit={(quiz) => router.push(`/teacher/quizzes/${quiz.id}/edit`)}
              onDelete={handleDeleteQuiz}
              onViewResults={(quizId) => router.push(`/teacher/quizzes/${quizId}/results`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}




