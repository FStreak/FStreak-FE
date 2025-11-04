"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aiService } from "@/services/aiService";
import { QuestionDifficulty, QuestionType } from "@/model/ai/aiTypes";
import type { Lesson } from "@/model/lesson/lessonTypes";
import { toast } from "@/lib/toast";

interface AIQuizGeneratorProps {
  lesson: Lesson;
  onQuizGenerated: () => void;
}

export function AIQuizGenerator({ lesson, onQuizGenerated }: AIQuizGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(QuestionDifficulty.MEDIUM);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    QuestionType.MULTIPLE_CHOICE,
  ]);

  const handleGenerate = async () => {
    if (!lesson.documentUrl && !lesson.videoUrl) {
      toast.error("Lesson must have a document or video to generate quiz");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiService.generateQuizFromLesson({
        lessonId: lesson.id,
        documentUrl: lesson.documentUrl,
        numberOfQuestions,
        difficulty,
        questionTypes: selectedTypes,
      });

      if (response.success && response.quiz) {
        toast.success(`Generated ${response.quiz.questions.length} questions!`);
        onQuizGenerated();
      } else {
        toast.error(response.error || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleQuestionType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
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
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
          AI Quiz Generator
        </CardTitle>
        <CardDescription>
          Generate quiz questions automatically from lesson content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Number of Questions */}
        <div className="space-y-2">
          <Label htmlFor="numQuestions">Number of Questions</Label>
          <Input
            id="numQuestions"
            type="number"
            min={5}
            max={50}
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 10)}
          />
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <div className="flex gap-2">
            {Object.values(QuestionDifficulty).map((level) => (
              <Button
                key={level}
                type="button"
                size="sm"
                variant={difficulty === level ? "default" : "outline"}
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div className="space-y-2">
          <Label>Question Types</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant={selectedTypes.includes(QuestionType.MULTIPLE_CHOICE) ? "default" : "outline"}
              onClick={() => toggleQuestionType(QuestionType.MULTIPLE_CHOICE)}
            >
              Multiple Choice
            </Button>
            <Button
              type="button"
              size="sm"
              variant={selectedTypes.includes(QuestionType.TRUE_FALSE) ? "default" : "outline"}
              onClick={() => toggleQuestionType(QuestionType.TRUE_FALSE)}
            >
              True/False
            </Button>
            <Button
              type="button"
              size="sm"
              variant={selectedTypes.includes(QuestionType.SHORT_ANSWER) ? "default" : "outline"}
              onClick={() => toggleQuestionType(QuestionType.SHORT_ANSWER)}
            >
              Short Answer
            </Button>
            <Button
              type="button"
              size="sm"
              variant={selectedTypes.includes(QuestionType.ESSAY) ? "default" : "outline"}
              onClick={() => toggleQuestionType(QuestionType.ESSAY)}
            >
              Essay
            </Button>
          </div>
        </div>

        {/* Content Source Info */}
        <div className="p-4 bg-muted rounded-lg text-sm space-y-1">
          <p className="font-semibold">Content Source:</p>
          <p className="text-muted-foreground">
            {lesson.documentUrl && "📄 Document"}
            {lesson.documentUrl && lesson.videoUrl && " + "}
            {lesson.videoUrl && "🎥 Video"}
          </p>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || selectedTypes.length === 0}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
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
              Generating Quiz...
            </>
          ) : (
            <>
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
                className="mr-2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Generate Quiz with AI
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          💡 AI will analyze your lesson content and create relevant questions
        </p>
      </CardContent>
    </Card>
  );
}



<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
