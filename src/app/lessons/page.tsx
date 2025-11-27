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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLessons = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const allLessons = await privateApiService.getAllLessons();
      console.log("📚 All lessons received:", allLessons.length, allLessons);
      
      // Normalize lessons (handle both camelCase and PascalCase from API)
      const normalizedLessons = allLessons.map((lesson: any) => ({
        ...lesson,
        isPublished: lesson.isPublished ?? lesson.IsPublished ?? false,
        title: lesson.title ?? lesson.Title ?? "",
        description: lesson.description ?? lesson.Description,
        createdAt: lesson.createdAt ?? lesson.CreatedAt,
      }));
      
      console.log("📚 Normalized lessons:", normalizedLessons);
      
      // Chỉ lấy các lesson đã published và sắp xếp theo thời gian tạo mới nhất
      const publishedLessons = normalizedLessons
        .filter((lesson) => {
          // Handle boolean, string "true"/"false", or undefined
          const isPublished = 
            lesson.isPublished === true || 
            lesson.isPublished === "true" || 
            String(lesson.isPublished).toLowerCase() === "true";
          
          if (!isPublished) {
            console.log(`⏭️ Skipping unpublished lesson: ${lesson.title} (isPublished: ${lesson.isPublished})`);
          } else {
            console.log(`✅ Including published lesson: ${lesson.title}`);
          }
          return isPublished;
        })
        .sort((a, b) => {
          // Sắp xếp theo createdAt (mới nhất trước)
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      
      console.log("✅ Published lessons after filter:", publishedLessons.length);
      console.log("✅ Published lessons details:", publishedLessons.map(l => ({ id: l.id, title: l.title, isPublished: l.isPublished })));
      setLessons(publishedLessons);
      
      if (!showLoading && publishedLessons.length > 0) {
        toast.success(`Đã tải ${publishedLessons.length} bài học`);
      }
    } catch (error: any) {
      console.error("Failed to fetch lessons:", error);
      
      // Check if it's a 405 error (Method Not Allowed)
      if (error?.response?.status === 405) {
        console.warn("⚠️ GET /Lessons endpoint not available. Backend may need to add this endpoint.");
        if (showLoading) {
          toast.error("API endpoint không khả dụng. Vui lòng liên hệ admin.");
        }
      } else if (showLoading) {
        toast.error("Không thể tải danh sách bài học");
      }
      setLessons([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLessons(true);
    
    // Refresh lessons mỗi 30 giây để cập nhật lesson mới
    const interval = setInterval(() => fetchLessons(false), 30000);
    return () => clearInterval(interval);
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
        <LessonHeader onRefresh={() => fetchLessons(false)} isRefreshing={isRefreshing} />
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
