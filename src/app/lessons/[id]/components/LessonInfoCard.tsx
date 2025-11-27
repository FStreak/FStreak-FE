"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, FileText, Video, CheckCircle, XCircle } from "lucide-react";
import type { Lesson } from "@/model/lesson/lessonTypes";

interface LessonInfoCardProps {
  lesson: Lesson | null;
}

export default function LessonInfoCard({ lesson }: LessonInfoCardProps) {
  if (!lesson) {
    return (
      <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            About this lesson
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
            Loading lesson information...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          About this lesson
        </h3>
        
        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {lesson.description || "No description available for this lesson."}
          </p>
        </div>

        {/* Lesson Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-orange-100 dark:border-gray-700">
          {/* Start Date */}
          {lesson.startAt && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div>
                <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                <span className="ml-2 text-gray-700 dark:text-gray-200 font-medium">
                  {new Date(lesson.startAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Duration */}
          {lesson.durationMinutes && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="ml-2 text-gray-700 dark:text-gray-200 font-medium">
                  {lesson.durationMinutes} minutes
                </span>
              </div>
            </div>
          )}

          {/* Published Status */}
          <div className="flex items-center gap-2 text-sm">
            {lesson.isPublished ? (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            <div>
              <span className="text-gray-500 dark:text-gray-400">Status:</span>
              <span className={`ml-2 font-medium ${
                lesson.isPublished 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-gray-500 dark:text-gray-400"
              }`}>
                {lesson.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          {/* Category */}
          {lesson.category && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Category:</span>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                {lesson.category}
              </span>
            </div>
          )}
        </div>

        {/* Files Available */}
        <div className="pt-2 border-t border-orange-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            {lesson.videoUrl && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Video className="w-4 h-4 text-orange-500" />
                <span>Video available</span>
              </div>
            )}
            {lesson.documentUrl && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Document available</span>
              </div>
            )}
            {!lesson.videoUrl && !lesson.documentUrl && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No files attached
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
