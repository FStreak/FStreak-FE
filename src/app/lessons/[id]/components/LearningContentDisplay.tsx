"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { aiService } from "@/services/aiService";
import type { LearningContent, GenerateContentRequest } from "@/model/ai/aiTypes";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import type { Lesson } from "@/model/lesson/lessonTypes";
import { generateLearningContentFromLesson } from "@/utils/learningContentGenerator";

interface LearningContentDisplayProps {
  lesson: Lesson;
}

export default function LearningContentDisplay({ lesson }: LearningContentDisplayProps) {
  const [learningContent, setLearningContent] = useState<LearningContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing learning content
  useEffect(() => {
    const loadContent = async () => {
      if (!lesson.id) return;

      try {
        setIsLoading(true);
        const content = await aiService.getLearningContent(lesson.id);
        if (content) {
          setLearningContent(content);
        }
      } catch (error) {
        // Silently handle - 404 is expected if content doesn't exist
        console.debug("Learning content not found (this is normal if not generated yet)");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [lesson.id]);

  // Generate new learning content from lesson files
  const generateContent = async () => {
    if (!lesson.id) return;

    try {
      setIsGenerating(true);
      
      // First, try backend API if available
      const request: GenerateContentRequest = {
        lessonId: lesson.id,
        documentUrl: lesson.documentUrl,
        videoTranscript: lesson.videoUrl ? "Video available" : undefined,
        targetAudience: "beginner",
        contentLength: "medium",
      };

      const response = await aiService.generateLearningContent(request);

      if (response.success && response.content) {
        // Backend generation successful
        setLearningContent(response.content);
        toast.success("Learning content generated successfully!");
        return;
      }

      // If backend fails, use client-side generation
      console.log("Backend generation not available, using client-side generation");
      const generatedContent = generateLearningContentFromLesson(lesson);
      setLearningContent(generatedContent);
      toast.success("Learning content generated from lesson information!");
      
    } catch (error: any) {
      // If backend error, fallback to client-side generation
      console.log("Backend error, using client-side generation:", error);
      
      try {
        const generatedContent = generateLearningContentFromLesson(lesson);
        setLearningContent(generatedContent);
        toast.success("Learning content generated from lesson information!");
      } catch (genError) {
        console.error("Error generating content:", genError);
        toast.error("Failed to generate learning content");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading learning content...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!learningContent) {
    return (
      <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <BookOpen className="w-12 h-12 text-orange-400" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                No Learning Content Available
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click the button below to generate learning content from lesson information. 
                {lesson.documentUrl || lesson.videoUrl
                  ? " Content will be generated from lesson materials."
                  : " Content will be generated from lesson title and description."}
              </p>
              <Button
                onClick={generateContent}
                disabled={isGenerating}
                className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Learning Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Learning Content
          </CardTitle>
          {learningContent.generatedByAI && (
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
              AI Generated
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        {learningContent.summary && (
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Summary</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {learningContent.summary}
            </p>
          </div>
        )}

        {/* Learning Sections */}
        {learningContent.sections && learningContent.sections.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">What You'll Learn</h4>
            {learningContent.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-orange-100 dark:border-gray-700 bg-white dark:bg-gray-800/50"
                >
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {index + 1}. {section.title}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    {section.content}
                  </p>
                  {section.keyPoints && section.keyPoints.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Key Points:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {section.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {section.examples && section.examples.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Examples:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {section.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Key Takeaways */}
        {learningContent.keyTakeaways && learningContent.keyTakeaways.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-100 dark:border-orange-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Takeaways</h4>
            <ul className="space-y-2">
              {learningContent.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-orange-500 font-bold mt-0.5">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Regenerate Button */}
        {(lesson.documentUrl || lesson.videoUrl) && (
          <div className="pt-4 border-t border-orange-100 dark:border-gray-700">
            <Button
              onClick={generateContent}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-orange-200 hover:bg-orange-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Regenerate Content
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

