"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenInfoStorage } from "@/store/authStore";
import { isTeacher, getUserIdFromToken } from "@/utils/auth";
import { privateApiService } from "@/services/ApiPrivate";
import type { Lesson, LessonFormData } from "@/model/lesson/lessonTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonForm } from "./components/LessonForm";
import { LessonTable } from "./components/LessonTable";
import { toast } from "@/lib/toast";

export default function TeacherPage() {
  const router = useRouter();
  const { token, userId: storedUserId } = useTokenInfoStorage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get userId from store or decode from token
  const userId = storedUserId || getUserIdFromToken(token);

  // Check if user is a teacher
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!isTeacher(token)) {
      toast.error("Access denied. This page is for teachers only.");
      router.push("/dashboard");
      return;
    }
  }, [token, router]);

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      if (!token || !userId) {
        console.warn("Missing token or userId");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const teacherLessons = await privateApiService.getLessonsByTeacher(userId);
        setLessons(teacherLessons);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        toast.error("Failed to load lessons");
      } finally {
        setIsLoading(false);
      }
    };

    if (isTeacher(token)) {
      fetchLessons();
    }
  }, [token, userId]);

  const handleCreateLesson = () => {
    setEditingLesson(null);
    setIsFormOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await privateApiService.deleteLesson(lessonId);
      setLessons(lessons.filter((l) => l.id !== lessonId));
      toast.success("Lesson deleted successfully");
    } catch (error) {
      console.error("Failed to delete lesson:", error);
      toast.error("Failed to delete lesson");
    }
  };

  const handleSubmitLesson = async (formData: LessonFormData) => {
    try {
      setIsSubmitting(true);

      if (editingLesson) {
        // Update existing lesson
        const updatedLesson = await privateApiService.updateLesson(editingLesson.id, formData);
        setLessons(lessons.map((l) => (l.id === updatedLesson.id ? updatedLesson : l)));
        toast.success("Lesson updated successfully");
      } else {
        // Create new lesson
        const newLesson = await privateApiService.createLesson(formData);
        setLessons([newLesson, ...lessons]);
        toast.success("Lesson created successfully");
      }

      setIsFormOpen(false);
      setEditingLesson(null);
    } catch (error) {
      console.error("Failed to save lesson:", error);
      toast.error("Failed to save lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not a teacher
  if (!token || !isTeacher(token)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your lessons and course content</p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Lessons</CardDescription>
              <CardTitle className="text-3xl">{lessons.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl">
                {lessons.filter((l) => l.isPublished).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl">
                {lessons.filter((l) => !l.isPublished).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Lessons</h2>
          <Button onClick={handleCreateLesson}>
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
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create New Lesson
          </Button>
        </div>

        {/* Lessons Table */}
        <LessonTable
          lessons={lessons}
          onEdit={handleEditLesson}
          onDelete={handleDeleteLesson}
          isLoading={isLoading}
        />

        {/* Lesson Form Dialog */}
        <LessonForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          lesson={editingLesson}
          onSubmit={handleSubmitLesson}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}

