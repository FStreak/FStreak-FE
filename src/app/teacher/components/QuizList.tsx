"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Quiz } from "@/model/ai/aiTypes";

interface QuizListProps {
  quizzes: Quiz[];
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
  onViewResults: (quizId: string) => void;
}

export function QuizList({ quizzes, onEdit, onDelete, onViewResults }: QuizListProps) {
  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No quizzes yet. Generate one using AI!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    {quiz.title}
                  </h3>
                  {quiz.generatedByAI && (
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                      AI Generated
                    </span>
                  )}
                  {quiz.isPublished ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full">
                      Draft
                    </span>
                  )}
                </div>

                {quiz.description && (
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>{quiz.questions.length} questions</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20m0-20l7 7m-7-7l-7 7" />
                    </svg>
                    <span>{quiz.totalPoints} points</span>
                  </div>

                  {quiz.timeLimit && (
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{quiz.timeLimit} min</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onViewResults(quiz.id)}>
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
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  Results
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(quiz)}>
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
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this quiz?")) {
                      onDelete(quiz.id);
                    }
                  }}
                >
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
