import { useEffect, useState } from "react";
import { privateApiService } from "@/services/ApiPrivate";
import type { Lesson } from "@/model/lesson/lessonTypes";
import { toast } from "@/lib/toast";

export function useLesson(lessonId: string | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const lessonData = await privateApiService.getLessonById(lessonId);

        // Normalize lesson data (handle both camelCase and PascalCase)
        const rawData = lessonData as any;
        
        // Debug: Log raw data to see what fields are available
        console.log("📄 Raw lesson data:", {
          keys: Object.keys(rawData),
          documentUrl: rawData.documentUrl || rawData.DocumentUrl || rawData.documentFileUrl || rawData.DocumentFileUrl,
          videoUrl: rawData.videoUrl || rawData.VideoUrl || rawData.videoFileUrl || rawData.VideoFileUrl,
        });

        const normalizedLesson: Lesson = {
          ...lessonData,
          id: lessonData.id || rawData.Id,
          title: lessonData.title || rawData.Title || "",
          description: lessonData.description || rawData.Description,
          category: lessonData.category || rawData.Category,
          startAt: lessonData.startAt || rawData.StartAt,
          durationMinutes:
            lessonData.durationMinutes || rawData.DurationMinutes,
          isPublished:
            lessonData.isPublished ?? rawData.IsPublished ?? false,
          documentUrl:
            lessonData.documentUrl ||
            rawData.DocumentUrl ||
            rawData.documentFileUrl ||
            rawData.DocumentFileUrl ||
            rawData.documentUrl ||
            undefined,
          videoUrl:
            lessonData.videoUrl ||
            rawData.VideoUrl ||
            rawData.videoFileUrl ||
            rawData.VideoFileUrl ||
            rawData.videoUrl ||
            undefined,
          teacherId:
            lessonData.teacherId || rawData.TeacherId,
          createdAt: lessonData.createdAt || rawData.CreatedAt,
          updatedAt: lessonData.updatedAt || rawData.UpdatedAt,
        };

        console.log("✅ Normalized lesson:", {
          title: normalizedLesson.title,
          hasDocument: !!normalizedLesson.documentUrl,
          hasVideo: !!normalizedLesson.videoUrl,
          documentUrl: normalizedLesson.documentUrl,
        });

        setLesson(normalizedLesson);
      } catch (err: any) {
        console.error("Error fetching lesson:", err);
        setError(err.message || "Failed to load lesson");
        toast.error("Failed to load lesson");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  return { lesson, isLoading, error };
}

