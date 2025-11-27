"use client";
import { useState } from "react";
import LessonInfoCard from "./LessonInfoCard";
import LessonTabs from "./LessonTabs";
import LessonNavLinks from "./LessonNavLinks";
import { useLesson } from "@/hooks/useLesson";

interface LessonSidebarProps {
  baseHref: string;
  lessonId: string;
}

export default function LessonSidebar({
  baseHref,
  lessonId,
}: LessonSidebarProps) {
  const [tab, setTab] = useState<"overview" | "lessons" | "assignments">(
    "overview"
  );
  const { lesson } = useLesson(lessonId);

  return (
    <aside className="flex flex-col gap-6 max-w-xs w-full">
      <LessonInfoCard lesson={lesson} />
      <LessonTabs tab={tab} setTab={setTab} lesson={lesson} />
      <LessonNavLinks baseHref={baseHref} lessonId={lessonId} />
    </aside>
  );
}
