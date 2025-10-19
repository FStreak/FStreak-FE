"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import useStreakHistory from "@/hooks/useStreakHistory";

export default function StreakHistoryPage() {
  const { data, daysGrid, month, year, gotoPrevMonth, gotoNextMonth } = useStreakHistory();

  const summary = [
    { label: "CURRENT STREAK", value: data?.currentStreak ?? 0 },
    { label: "LONGEST STREAK", value: data?.longestStreak ?? 0 },
    { label: "TOTAL LEARNING DAYS", value: data?.streakHistory?.length ?? 0 },
  ];

  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold">STREAK HISTORY</h1>

        {/* Summary */}
        <Card>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summary.map((s) => (
              <div key={s.label} className="rounded-md bg-orange-50 p-6 text-center">
                <div className="text-4xl font-extrabold text-orange-600">{s.value}</div>
                <div className="text-[10px] mt-1 tracking-widest text-orange-700">{s.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <button onClick={gotoPrevMonth} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Prev</button>
              <div className="text-sm font-medium uppercase tracking-wide">{monthLabel}</div>
              <button onClick={gotoNextMonth} className="text-sm px-3 py-1 rounded border hover:bg-gray-50">Next</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysGrid.map((c) => {
                const isToday = c.day
                  ? (() => {
                      const today = new Date();
                      const cellDate = new Date(c.key);
                      return (
                        today.getFullYear() === cellDate.getFullYear() &&
                        today.getMonth() === cellDate.getMonth() &&
                        today.getDate() === cellDate.getDate()
                      );
                    })()
                  : false;

                // Friendly full date for tooltip
                const title = c.day ? new Date(c.key).toLocaleDateString() : undefined;

                const baseClass = c.day && c.active ? "bg-orange-500 text-white border-orange-500" : c.day ? "bg-gray-50 text-gray-700" : "bg-transparent border-transparent";

                return (
                  <div
                    key={c.key}
                    role={c.day ? 'button' : 'gridcell'}
                    aria-label={c.day ? `Day ${c.day} ${title}` : 'Empty'}
                    title={title}
                    className={`h-9 rounded-md flex items-center justify-center text-sm border ${baseClass} ${isToday ? 'ring-2 ring-yellow-300' : ''}`}
                  >
                    {c.day ?? ""}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Milestones placeholder */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="font-semibold mb-2">Streak Milestones</div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Achieved 7-day streak!</li>
                <li>Started new streak!</li>
                <li>Achieved 30-day streak!</li>
              </ul>
            </div>
            <div className="w-40 h-40 bg-orange-100 rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


