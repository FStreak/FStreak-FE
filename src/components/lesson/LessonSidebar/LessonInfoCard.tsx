import { GraduationCap } from "lucide-react";
import type { Lesson } from "@/model/lesson/lessonTypes";

interface LessonInfoCardProps {
  lesson: Lesson | null;
}

export default function LessonInfoCard({ lesson }: LessonInfoCardProps) {
  return (
    <div className="p-5 rounded-3xl border border-[#FFEBD2] bg-white shadow-sm transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center text-white shadow-inner">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
            {lesson?.title || "Loading..."}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {lesson?.category || "Lesson"}
          </p>
        </div>
      </div>
    </div>
  );
}
