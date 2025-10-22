"use client";

import Navbar from "@/components/navbar/Navbar";
import useStreakHistory from "@/hooks/useStreakHistory";
import StreakSummary from "@/components/streak/StreakSummary";
import StreakCalendar from "@/components/streak/StreakCalendar";
import StreakMilestones from "@/components/streak/StreakMilestones";

interface StreakHistoryData {
  data: {
    currentStreak?: number;
    longestStreak?: number;
    streakHistory?: string[]; // ✅ đã sửa
  } | null;
  daysGrid: {
    key: string;
    day?: number | null;
    active?: boolean;
  }[];
  month: number;
  year: number;
  gotoPrevMonth: () => void;
  gotoNextMonth: () => void;
}

export default function StreakHistoryPage() {
  const {
    data,
    daysGrid,
    month,
    year,
    gotoPrevMonth,
    gotoNextMonth,
  }: StreakHistoryData = useStreakHistory();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 space-y-10">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
          Streak History
        </h1>

        <StreakSummary data={data} />
        <StreakCalendar
          daysGrid={daysGrid}
          month={month}
          year={year}
          gotoPrevMonth={gotoPrevMonth}
          gotoNextMonth={gotoNextMonth}
        />
        <StreakMilestones />
      </main>
    </div>
  );
}
