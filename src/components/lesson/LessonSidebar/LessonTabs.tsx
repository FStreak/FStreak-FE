import {
  Info,
  Notebook,
  ClipboardCheck,
  BookOpen,
  FileText,
} from "lucide-react";
import LessonTabItem from "./LessonTabItem";
import type { Lesson } from "@/model/lesson/lessonTypes";

interface LessonTabsProps {
  tab: "overview" | "lessons" | "assignments";
  setTab: (t: "overview" | "lessons" | "assignments") => void;
  lesson: Lesson | null;
}

export default function LessonTabs({ tab, setTab, lesson }: LessonTabsProps) {
  return (
    <>
      {/* Tabs */}
      <div className="p-3 rounded-2xl border border-[#FFEBD2] bg-white shadow-sm space-y-2">
        <LessonTabItem
          label="Overview"
          icon={<Info className="w-4 h-4" />}
          active={tab === "overview"}
          onClick={() => setTab("overview")}
        />
        <LessonTabItem
          label="Lessons"
          icon={<Notebook className="w-4 h-4" />}
          active={tab === "lessons"}
          onClick={() => setTab("lessons")}
        />
        <LessonTabItem
          label="Assignments"
          icon={<ClipboardCheck className="w-4 h-4" />}
          active={tab === "assignments"}
          onClick={() => setTab("assignments")}
        />
      </div>

      {/* Content below the tabs */}
      <div className="p-5 rounded-2xl border border-[#FFEBD2] bg-gradient-to-b from-white to-orange-50/30 shadow-sm">
        {tab === "overview" && (
          <>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Lesson Overview
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {lesson?.description || "No description available for this lesson."}
            </p>
            {lesson?.durationMinutes && (
              <p className="text-xs text-gray-500 mt-2">
                Duration: {lesson.durationMinutes} minutes
              </p>
            )}
          </>
        )}
        {tab === "lessons" && (
          <>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Lesson Information
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {lesson?.category && (
                <li className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  Category: {lesson.category}
                </li>
              )}
              {lesson?.startAt && (
                <li className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  Starts: {new Date(lesson.startAt).toLocaleDateString()}
                </li>
              )}
              {lesson?.isPublished !== undefined && (
                <li className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  Status: {lesson.isPublished ? "Published" : "Draft"}
                </li>
              )}
            </ul>
          </>
        )}
        {tab === "assignments" && (
          <>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Lesson Assignments
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {lesson?.documentUrl || lesson?.videoUrl
                ? "Click 'Assignments' in the menu to generate assignments with AI."
                : "Upload lesson materials to generate assignments."}
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                AI-generated assignments available
              </li>
            </ul>
          </>
        )}
      </div>
    </>
  );
}
