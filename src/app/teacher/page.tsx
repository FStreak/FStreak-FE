"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTokenInfoStorage } from "@/store/authStore";
import { isTeacher, getUserIdFromToken } from "@/utils/auth";
import { privateApiService } from "@/services/ApiPrivate";
import type { Lesson, LessonFormData } from "@/model/lesson/lessonTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LessonForm } from "./components/LessonForm";
import { LessonTable } from "./components/LessonTable";
import { toast } from "@/lib/toast";
import { Search } from "lucide-react";

export default function TeacherPage() {
  const router = useRouter();
  const { token, userId: storedUserId } = useTokenInfoStorage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
        toast.success("Cập nhật bài học thành công");
      } else {
        // Create new lesson
        const newLesson = await privateApiService.createLesson(formData);
        setLessons([newLesson, ...lessons]);
        toast.success("Tạo bài học thành công");
      }

      setIsFormOpen(false);
      setEditingLesson(null);
    } catch (error: any) {
      console.error("Failed to save lesson:", error);
      
      // Kiểm tra lỗi CORS
      if (error.message?.includes("CORS") || error.code === "ERR_NETWORK" || !error.response) {
        toast.error("Lỗi kết nối: Backend chưa cấu hình CORS. Vui lòng liên hệ admin.");
        console.error("CORS Error Details:", {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.title || "Không thể lưu bài học";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter lessons by search term
  const filteredLessons = useMemo(() => {
    if (!searchTerm.trim()) return lessons;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return lessons.filter(lesson => 
      lesson.title?.toLowerCase().includes(searchLower)
    );
  }, [lessons, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLessons = filteredLessons.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Don't render if not a teacher
  if (!token || !isTeacher(token)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
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
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
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

          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên bài học..."
                className="pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Hiển thị:
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="5">5 / trang</option>
                <option value="10">10 / trang</option>
                <option value="20">20 / trang</option>
                <option value="50">50 / trang</option>
                <option value="100">100 / trang</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          {searchTerm && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy {filteredLessons.length} / {lessons.length} bài học
            </p>
          )}
        </div>

        {/* Lessons Table */}
        <LessonTable
          lessons={currentLessons}
          onEdit={handleEditLesson}
          onDelete={handleDeleteLesson}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {filteredLessons.length > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Page info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredLessons.length)} trong tổng số {filteredLessons.length} bài học
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    Đầu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="min-w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Cuối
                  </Button>
                </div>

                {/* Go to page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trang:</span>
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-20 h-8 text-center"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">/ {totalPages}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

