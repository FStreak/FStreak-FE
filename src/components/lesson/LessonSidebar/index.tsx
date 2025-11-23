"use client";
import { useState } from "react";
import LessonInfoCard from "./LessonInfoCard";
import LessonTabs from "./LessonTabs";
import LessonNavLinks from "./LessonNavLinks";

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

  return (
    <aside className="flex flex-col gap-6 max-w-xs w-full">
      <LessonInfoCard />
      <LessonTabs tab={tab} setTab={setTab} />
      <LessonNavLinks baseHref={baseHref} lessonId={lessonId} />
    </aside>
  );
}
