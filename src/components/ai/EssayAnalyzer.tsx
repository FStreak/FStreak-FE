"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { aiService } from "@/services/aiService";
import type { AIAnalysis } from "@/model/ai/aiTypes";
import { toast } from "@/lib/toast";

interface EssayAnalyzerProps {
  initialText?: string;
  questionPrompt?: string;
  onAnalysisComplete?: (analysis: AIAnalysis) => void;
}

export function EssayAnalyzer({
  initialText = "",
  questionPrompt,
  onAnalysisComplete,
}: EssayAnalyzerProps) {
  const [essayText, setEssayText] = useState(initialText);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!essayText.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await aiService.analyzeEssay({
        essayText,
        questionPrompt,
      });

      if (response.success && response.analysis) {
        setAnalysis(response.analysis);
        onAnalysisComplete?.(response.analysis);
        toast.success("Analysis complete!");
      } else {
        toast.error(response.error || "Failed to analyze essay");
      }
    } catch (error) {
      console.error("Essay analysis error:", error);
      toast.error("Failed to analyze essay");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            AI Essay Analyzer
          </CardTitle>
          <CardDescription>
            Get instant feedback on writing quality, grammar, and content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questionPrompt && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-1">Question:</p>
              <p className="text-sm text-muted-foreground">{questionPrompt}</p>
            </div>
          )}

          <Textarea
            placeholder="Paste or type the essay here..."
            rows={10}
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            className="font-mono text-sm"
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {essayText.length} characters • {essayText.split(/\s+/).filter(Boolean).length} words
            </p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !essayText.trim()}>
              {isAnalyzing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
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
                    className="mr-2"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.analysis.contentScore !== undefined && (
                  <ScoreCard label="Content" score={analysis.analysis.contentScore} />
                )}
                {analysis.analysis.clarityScore !== undefined && (
                  <ScoreCard label="Clarity" score={analysis.analysis.clarityScore} />
                )}
                {analysis.analysis.grammarScore !== undefined && (
                  <ScoreCard label="Grammar" score={analysis.analysis.grammarScore} />
                )}
                {analysis.analysis.overallScore !== undefined && (
                  <ScoreCard label="Overall" score={analysis.analysis.overallScore} highlight />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Weaknesses */}
          {analysis.analysis.weaknesses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.analysis.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-1">⚠</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {analysis.analysis.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20m0-20l7 7m-7-7l-7 7" />
                  </svg>
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Grammar Errors */}
          {analysis.analysis.grammarErrors && analysis.analysis.grammarErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Grammar & Spelling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.analysis.grammarErrors.map((error, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-red-500 font-mono text-sm line-through">{error.text}</span>
                        <span className="text-green-500 font-mono text-sm">→ {error.correction}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{error.explanation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreCard({
  label,
  score,
  highlight = false,
}: {
  label: string;
  score: number;
  highlight?: boolean;
}) {
  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div
      className={`p-4 rounded-lg text-center ${
        highlight
          ? "bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-800"
          : "bg-muted"
      }`}
    >
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-3xl font-bold ${getColor(score)}`}>{score}</p>
    </div>
  );
}




