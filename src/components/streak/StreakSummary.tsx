"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StreakData {
  currentStreak?: number;
  longestStreak?: number;
  streakHistory?: string[];
}

export default function StreakSummary({ data }: { data: StreakData | null }) {
  const summary = [
    { label: "CURRENT STREAK", value: data?.currentStreak ?? 0 },
    { label: "LONGEST STREAK", value: data?.longestStreak ?? 0 },
    { label: "TOTAL LEARNING DAYS", value: data?.streakHistory?.length ?? 0 },
  ];

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all bg-white dark:bg-gray-800/60">
      <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 
                       dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 
                       p-6 text-center border border-orange-100/70 dark:border-gray-700 
                       hover:border-orange-300 hover:shadow-[0_6px_20px_rgba(255,165,0,0.2)] 
                       transition-all"
          >
            <div className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 drop-shadow-sm">
              {s.value}
            </div>
            <div className="text-[11px] mt-1 tracking-widest text-orange-700 dark:text-orange-300 uppercase font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
