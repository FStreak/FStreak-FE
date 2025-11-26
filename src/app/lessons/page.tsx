"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import LessonHeader from "./components/LessonHeader";
import FeaturedLessonCard from "./components/FeaturedLessonCard";
import LessonCard from "./components/LessonCard";
import { privateApiService } from "@/services/ApiPrivate";
import type { Lesson } from "@/model/lesson/lessonTypes";
import { toast } from "@/lib/toast";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        const allLessons = await privateApiService.getAllLessons();
        // Chỉ lấy các lesson đã published
        const publishedLessons = allLessons.filter((lesson) => lesson.isPublished);
        setLessons(publishedLessons);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        toast.error("Không thể tải danh sách bài học");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, []);

  // Lấy lesson đầu tiên làm featured, phần còn lại làm list
  const featured = lessons.length > 0 ? lessons[0] : null;
  const rest = lessons.length > 1 ? lessons.slice(1) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0B0B0B]">
        <Navbar />
        <main className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14 space-y-10">
          <LessonHeader />
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">Đang tải bài học...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0B0B0B]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14 space-y-10">
        <LessonHeader />
        {featured && <FeaturedLessonCard lesson={featured} />}

        {rest.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((l) => (
              <LessonCard key={l.id} lesson={l} />
            ))}
          </section>
        )}

        {lessons.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">Chưa có bài học nào.</p>
          </div>
        )}
      </main>
    </div>
  );
}
