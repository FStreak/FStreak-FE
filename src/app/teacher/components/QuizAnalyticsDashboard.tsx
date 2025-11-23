"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aiService } from "@/services/aiService";

interface QuizAnalyticsProps {
  quizId: string;
}

interface AnalyticsData {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  questionStats: Array<{
    questionId: string;
    questionText: string;
    correctRate: number;
    averageTime: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
}

export function QuizAnalyticsDashboard({ quizId }: QuizAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await aiService.getQuizAnalytics(quizId);
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [quizId]);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No analytics data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Attempts</CardDescription>
            <CardTitle className="text-3xl">{analytics.totalAttempts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">
              {analytics.averageScore.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pass Rate</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">
              {analytics.passRate.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>How students performed overall</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.scoreDistribution.map((dist, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{dist.range}</span>
                  <span className="text-muted-foreground">{dist.count} students</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all"
                    style={{
                      width: `${(dist.count / analytics.totalAttempts) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Question Performance</CardTitle>
          <CardDescription>Difficulty analysis per question</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.questionStats.map((stat, idx) => (
              <div
                key={stat.questionId}
                className="p-4 rounded-lg border bg-muted/50 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">Question {idx + 1}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {stat.questionText}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p
                      className={`text-2xl font-bold ${
                        stat.correctRate >= 70
                          ? "text-green-600"
                          : stat.correctRate >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.correctRate.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">correct</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {stat.correctRate < 50
                      ? "🔴 Challenging"
                      : stat.correctRate < 70
                      ? "🟡 Moderate"
                      : "🟢 Easy"}
                  </span>
                  <span>⏱️ Avg time: {stat.averageTime}s</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




