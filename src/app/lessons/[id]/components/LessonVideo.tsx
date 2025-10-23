"use client";

import { Card, CardContent } from "@/components/ui/card";

interface LessonVideoProps {
  title: string;
  src: string;
  minutes: number;
}

export default function LessonVideo({ title, src, minutes }: LessonVideoProps) {
  return (
    <Card className="rounded-2xl border border-orange-100 bg-white/90 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-3">
          {title} • {minutes} min
        </div>
        <video controls src={src} className="w-full rounded-xl shadow-sm" />
      </CardContent>
    </Card>
  );
}
