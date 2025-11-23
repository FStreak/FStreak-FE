"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function LessonInfoCard() {
  return (
    <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          About this lesson
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
          This lesson introduces core concepts used throughout the course,
          helping you understand advanced topics through simple, clear examples.
        </p>
      </CardContent>
    </Card>
  );
}
