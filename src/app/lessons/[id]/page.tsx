"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLesson } from "@/hooks/useLesson";
import { privateApiService } from "@/services/ApiPrivate";
import type { Lesson } from "@/model/lesson/lessonTypes";
import LessonInfoCard from "./components/LessonInfoCard";
import LearningContentDisplay from "./components/LearningContentDisplay";
import LessonDocumentViewer from "./components/LessonDocumentViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";

export default function LessonOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const { lesson, isLoading } = useLesson(lessonId);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  // Load all lessons for selection
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoadingLessons(true);
        const lessons = await privateApiService.getAllLessons();
        const normalizedLessons = lessons.map((l: any) => ({
          ...l,
          isPublished: l.isPublished ?? l.IsPublished ?? false,
          title: l.title ?? l.Title ?? "",
        }));
        const publishedLessons = normalizedLessons.filter(
          (l: any) => l.isPublished === true || l.isPublished === "true" || String(l.isPublished).toLowerCase() === "true"
        );
        setAllLessons(publishedLessons);
      } catch (error) {
        console.error("Error loading lessons:", error);
      } finally {
        setIsLoadingLessons(false);
      }
    };
    loadLessons();
  }, []);

  // Set selected lesson when lesson loads
  useEffect(() => {
    if (lesson) {
      setSelectedLessonId(lesson.id);
    }
  }, [lesson]);

  const handleSelectLesson = (id: string) => {
    setSelectedLessonId(id);
    router.push(`/lessons/${id}`);
  };

  if (isLoading || isLoadingLessons) {
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
      {/* 🧭 Lesson Selection */}
      <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Chọn bài học bạn muốn học
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => handleSelectLesson(l.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  selectedLessonId === l.id
                    ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-300 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-200 hover:bg-orange-50/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-5 h-5 ${selectedLessonId === l.id ? "text-orange-500" : "text-gray-400"}`} />
                  <span className={`font-medium ${selectedLessonId === l.id ? "text-orange-600 dark:text-orange-400" : "text-gray-700 dark:text-gray-300"}`}>
                    {l.title}
                  </span>
                </div>
                {selectedLessonId === l.id && (
                  <ChevronRight className="w-5 h-5 text-orange-500" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 🧭 Tiêu đề bài học - từ API Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {lesson.title}
        </h1>
        {lesson.startAt && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Starts: {new Date(lesson.startAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {/* 📘 Thông tin tổng quan bài học - Hiển thị tất cả thông tin từ API */}
      <LessonInfoCard lesson={lesson} />

      {/* 📄 Document Viewer - Hiển thị document nếu có */}
      {lesson.documentUrl && (
        <LessonDocumentViewer
          documentUrl={lesson.documentUrl}
          title={`${lesson.title} - Document`}
          lessonId={lessonId}
        />
      )}

      {/* 🤖 AI Learning Content - Các mục cần học từ AI đọc file */}
      <LearningContentDisplay lesson={lesson} />
    </div>
  );
}
