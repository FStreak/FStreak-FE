"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuizAnalyticsDashboard } from "@/app/teacher/components/QuizAnalyticsDashboard";

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

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
              Quiz Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Insights and performance metrics
            </p>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <QuizAnalyticsDashboard quizId={quizId} />
      </div>
    </div>
  );
}




