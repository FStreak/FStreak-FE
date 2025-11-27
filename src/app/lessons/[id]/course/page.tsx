"use client";

import { useParams } from "next/navigation";
import LessonInfoCard from "../components/LessonInfoCard";
import LessonVideo from "../components/LessonVideo";
import LessonDocumentViewer from "../components/LessonDocumentViewer";
import { useLesson } from "@/hooks/useLesson";

export default function LessonCoursePage() {
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
        {/* 🧭 Tiêu đề */}
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

        {/* 🎥 Video bài học - từ VideoFile (videoUrl) */}
        {lesson.videoUrl ? (
          <LessonVideo
            title={lesson.title}
            src={lesson.videoUrl}
            minutes={lesson.durationMinutes || 0}
          />
        ) : (
          <div className="rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 shadow-sm p-6 text-center text-gray-500 dark:text-gray-400">
            No video available for this lesson
          </div>
        )}

        {/* 📄 Document Viewer - từ DocumentFile (documentUrl) */}
        {lesson.documentUrl ? (
          <LessonDocumentViewer
            documentUrl={lesson.documentUrl}
            title={`${lesson.title} - Document`}
          />
        ) : (
          <div className="rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 shadow-sm p-6 text-center text-gray-500 dark:text-gray-400">
            No documents available for this lesson
          </div>
        )}

      {/* 🧾 Thông tin tổng quan - Hiển thị tất cả thông tin từ API */}
      <LessonInfoCard lesson={lesson} />
    </div>
  );
}
