"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import ProgressBar from "./ProgressBar";
import type { Lesson } from "@/model/lesson/lessonTypes";

// Helper function để xác định level dựa trên duration
const getLevel = (durationMinutes?: number): string => {
  if (!durationMinutes) return "Beginner";
  if (durationMinutes <= 30) return "Beginner";
  if (durationMinutes <= 60) return "Intermediate";
  return "Advanced";
};

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card
      className="group border border-orange-100 dark:border-[#2A2A2A]
                 rounded-2xl bg-white/80 dark:bg-[#0F0F10]/70
                 shadow-sm hover:shadow-[0_4px_18px_rgba(255,172,80,0.25)]
                 hover:-translate-y-[3px] transition-all duration-300"
    >
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50
                         dark:from-[#221B14] dark:to-[#2A1E12]
                         flex items-center justify-center shadow-inner"
            >
              <BookOpen className="w-4.5 h-4.5 text-orange-500" />
            </div>

            <div>
              <h3 className="text-[15px] font-semibold text-[#1F1F1F] dark:text-white leading-tight">
                {lesson.title}
              </h3>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full
                           bg-orange-50/60 text-orange-600
                           dark:bg-[#181818] dark:text-[#E7B674]"
              >
                {getLevel(lesson.durationMinutes)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {lesson.description && (
          <p className="text-[13px] text-[#5E5E5E] dark:text-[#B8B8B8]">
            {lesson.description}
          </p>
        )}

        {/* Progress bar - tạm thời để 0 vì chưa có API progress */}
        <ProgressBar value={0} small />

        {/* Action link */}
        <div className="pt-2">
          <Link
            href={`/lessons/${lesson.id}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold
                       text-orange-600 dark:text-[#EAB676]
                       hover:text-orange-500 dark:hover:text-[#F3C98B]
                       transition-colors"
          >
            Start Lesson
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
