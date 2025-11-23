"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { aiService } from "@/services/aiService";
import type { Quiz, QuizAnswer, QuestionType } from "@/model/ai/aiTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await aiService.getQuizById(quizId);
        setQuiz(quizData);

        // Start attempt
        const attempt = await aiService.startQuizAttempt(quizId);
        setAttemptId(attempt.id);

        if (quizData.timeLimit) {
          setTimeRemaining(quizData.timeLimit * 60); // Convert to seconds
        }
      } catch (error) {
        console.error("Failed to load quiz:", error);
        toast.error("Failed to load quiz");
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (!attemptId) {
      toast.error("No attempt ID found");
      return;
    }

    setIsSubmitting(true);
    try {
      const quizAnswers: QuizAnswer[] = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const result = await aiService.submitQuizAttempt(attemptId, quizAnswers);
      toast.success("Quiz submitted successfully!");
      router.push(`/lessons/${quiz?.lessonId}/quiz/${quiz?.id}/results/${result.id}`);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Timer */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              {quiz.title}
            </h1>
            {timeRemaining !== null && (
              <div
                className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                  timeRemaining < 60
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                ⏱️ {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          {quiz.description && <p className="text-muted-foreground">{quiz.description}</p>}
        </div>

        {/* Quiz Info */}
        <Card className="mb-6">
          <CardContent className="p-4 flex justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Questions:</span>
              <span className="ml-2 font-semibold">{quiz.questions.length}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Points:</span>
              <span className="ml-2 font-semibold">{quiz.totalPoints}</span>
            </div>
            {quiz.passingScore && (
              <div>
                <span className="text-sm text-muted-foreground">Passing Score:</span>
                <span className="ml-2 font-semibold">{quiz.passingScore}%</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {index + 1}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({question.points} {question.points === 1 ? "point" : "points"})
                  </span>
                </CardTitle>
                <CardDescription>{question.questionText}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Multiple Choice */}
                {question.questionType === "multiple_choice" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted transition"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {question.questionType === "true_false" && (
                  <div className="space-y-2">
                    {["True", "False"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted transition"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Short Answer */}
                {question.questionType === "short_answer" && (
                  <Input
                    placeholder="Your answer..."
                    value={(answers[question.id] as string) || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                )}

                {/* Essay */}
                {question.questionType === "essay" && (
                  <Textarea
                    placeholder="Write your essay here..."
                    rows={8}
                    value={(answers[question.id] as string) || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="min-w-[200px]"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      </div>
    </div>
  );
}




