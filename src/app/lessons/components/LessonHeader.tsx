"use client";

import { Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function LessonHeader({ onRefresh, isRefreshing = false }: LessonHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        {/* 🔥 Gradient title matching F-Streak theme */}
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent select-none">
          Lessons
        </h1>
        <p className="text-[13px] md:text-sm text-gray-600 dark:text-gray-300 mt-2">
          Learn slowly, but steadily. A little every day is enough.
          <Heart className="w-3.5 h-3.5 text-orange-400 inline ml-1" />
        </p>
      </div>

      {onRefresh && (
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Đang tải...' : 'Làm mới'}
        </Button>
      )}
    </section>
  );
}
