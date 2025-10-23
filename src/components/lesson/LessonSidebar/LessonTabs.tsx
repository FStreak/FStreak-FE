import {
  Info,
  Notebook,
  ClipboardCheck,
  BookOpen,
  FileText,
} from "lucide-react";
import LessonTabItem from "./LessonTabItem";

interface LessonTabsProps {
  tab: "overview" | "lessons" | "assignments";
  setTab: (t: "overview" | "lessons" | "assignments") => void;
}

export default function LessonTabs({ tab, setTab }: LessonTabsProps) {
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
              This lesson introduces key programming concepts and gives you a
              foundation to build on for later lessons. You’ll explore Python
              syntax, data types, and simple problem-solving techniques.
            </p>
          </>
        )}
        {tab === "lessons" && (
          <>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Lesson Topics
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" /> Why We Program
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" /> Variables and
                Expressions
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" /> Conditional
                Execution
              </li>
            </ul>
          </>
        )}
        {tab === "assignments" && (
          <>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Lesson Assignments
            </h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" /> Quiz: Intro to
                Programming
              </li>
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" /> Practice: Write
                Your First Script
              </li>
            </ul>
          </>
        )}
      </div>
    </>
  );
}
