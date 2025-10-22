"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { privateApiService } from "@/services/ApiPrivate";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakHistory: string[];
}

export default function ProfileStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await privateApiService.getMyStreak();
        setStreak(res);
      } catch {
        setStreak({ currentStreak: 0, longestStreak: 0, streakHistory: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, []);

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mb-3 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
        Learning Streak
      </h2>
      <Card className="border-none shadow-md hover:shadow-lg transition-all bg-white dark:bg-gray-900">
        <CardContent className="p-0">
          <div className="grid grid-cols-[180px,1fr] items-center">
            <Link
              href="/streakHistory"
              className="bg-gradient-to-br from-orange-500 to-yellow-400 text-white text-center py-10 block hover:opacity-90 transition-all rounded-l-lg"
            >
              <div className="text-6xl font-extrabold">
                {loading ? "…" : streak?.currentStreak ?? 0}
              </div>
              <div className="text-xs tracking-wider mt-1 font-semibold">
                DAYS STREAK
              </div>
            </Link>
            <div className="px-6 py-6 text-sm text-muted-foreground">
              {loading
                ? "Loading streak data..."
                : `You’ve studied for ${
                    streak?.currentStreak ?? 0
                  } consecutive days and your longest streak is ${
                    streak?.longestStreak ?? 0
                  } days.`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
