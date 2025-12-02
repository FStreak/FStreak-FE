"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, ExternalLink, Loader2, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiService } from "@/services/aiService";
import type { Quiz } from "@/model/ai/aiTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LessonDocumentViewerProps {
  documentUrl: string;
  title?: string;
  lessonId?: string;
}

export default function LessonDocumentViewer({
  documentUrl,
  title = "Lesson Document",
  lessonId,
}: LessonDocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [activeTab, setActiveTab] = useState("document");

  // Load assignments
  useEffect(() => {
    if (!lessonId) return;
    const loadQuizzes = async () => {
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

  // Determine file type from URL
  const getFileType = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(extension)) return "pdf";
    if (["doc", "docx"].includes(extension)) return "doc";
    if (["txt"].includes(extension)) return "text";
    return "unknown";
  };

  const fileType = getFileType(documentUrl);

  // Get Word document viewer URL (using Office Online or Google Docs viewer)
  const getWordViewerUrl = (url: string): string => {
    // Use Google Docs viewer for Word files
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="w-5 h-5 text-orange-500" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(documentUrl, "_blank")}
              className="border-orange-200 hover:bg-orange-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement("a");
                link.href = documentUrl;
                link.download = title;
                link.target = "_blank";
                link.click();
              }}
              className="border-orange-200 hover:bg-orange-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="document" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              Assignments {quizzes.length > 0 && `(${quizzes.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="document" className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading document...
                  </p>
                </div>
              </div>
            )}

            {hasError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Unable to display document in viewer
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(documentUrl, "_blank")}
                    className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Document
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full" style={{ minHeight: "600px" }}>
                {fileType === "pdf" ? (
                  <iframe
                    src={`${documentUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full rounded-lg border border-orange-100 dark:border-gray-700"
                    style={{ minHeight: "600px", height: "80vh" }}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title={title}
                  />
                ) : fileType === "doc" || fileType === "docx" ? (
                  <iframe
                    src={getWordViewerUrl(documentUrl)}
                    className="w-full rounded-lg border border-orange-100 dark:border-gray-700"
                    style={{ minHeight: "600px", height: "80vh" }}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title={title}
                  />
                ) : fileType === "text" ? (
                  <iframe
                    src={documentUrl}
                    className="w-full rounded-lg border border-orange-100 dark:border-gray-700"
                    style={{ minHeight: "600px", height: "80vh" }}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title={title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Document preview not available for this file type
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      File type: {fileType}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(documentUrl, "_blank")}
                        className="bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Document
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = documentUrl;
                          link.download = title;
                          link.target = "_blank";
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            {isLoadingQuizzes ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading assignments...
                  </p>
                </div>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ClipboardCheck className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No assignments available yet
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                {quizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className="border border-orange-100 dark:border-gray-700"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {quiz.title}
                        </h3>
                        {quiz.generatedByAI && (
                          <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                            AI
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span>Questions: {quiz.questions.length}</span>
                        <span>Points: {quiz.totalPoints}</span>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500"
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}





