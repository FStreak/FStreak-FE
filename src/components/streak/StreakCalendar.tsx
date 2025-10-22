"use client";

import { Card, CardContent } from "@/components/ui/card";

interface CalendarCell {
  key: string;
  day?: number | null;
  active?: boolean;
}

interface CalendarProps {
  daysGrid: CalendarCell[];
  month: number;
  year: number;
  gotoPrevMonth: () => void;
  gotoNextMonth: () => void;
}

export default function StreakCalendar({
  daysGrid,
  month,
  year,
  gotoPrevMonth,
  gotoNextMonth,
}: CalendarProps) {
  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={gotoPrevMonth}
            className="text-sm px-3 py-1 rounded-md border hover:bg-orange-50 hover:border-orange-300 transition-all"
          >
            Prev
          </button>
          <div className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            {monthLabel}
          </div>
          <button
            onClick={gotoNextMonth}
            className="text-sm px-3 py-1 rounded-md border hover:bg-orange-50 hover:border-orange-300 transition-all"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center font-medium">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysGrid.map((cell) => {
            const { key, day, active } = cell;

            const isToday = day
              ? (() => {
                  const today = new Date();
                  const date = new Date(key);
                  return (
                    today.getFullYear() === date.getFullYear() &&
                    today.getMonth() === date.getMonth() &&
                    today.getDate() === date.getDate()
                  );
                })()
              : false;

            const title = day ? new Date(key).toLocaleDateString() : "";

            // Xác định class màu nền
            const baseClass = day
              ? active
                ? "bg-gradient-to-br from-orange-500 to-yellow-400 text-white border-none"
                : "bg-gray-50 text-gray-700 border border-gray-200"
              : "bg-transparent";

            return (
              <div
                key={key}
                title={title}
                className={`h-9 rounded-lg flex items-center justify-center text-sm ${baseClass} ${
                  isToday ? "ring-2 ring-orange-300 scale-105" : ""
                } transition-all duration-200 ease-in-out`}
              >
                {day ?? ""}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
