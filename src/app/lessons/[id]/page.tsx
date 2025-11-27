"use client";

import { useParams } from "next/navigation";
import { useLesson } from "@/hooks/useLesson";
import LessonInfoCard from "./components/LessonInfoCard";
import LearningContentDisplay from "./components/LearningContentDisplay";
import LessonDocumentViewer from "./components/LessonDocumentViewer";

export default function LessonOverviewPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { lesson, isLoading } = useLesson(lessonId);

  if (isLoading) {
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
        />
      )}

      {/* 🤖 AI Learning Content - Các mục cần học từ AI đọc file */}
      <LearningContentDisplay lesson={lesson} />
    </div>
  );
}
