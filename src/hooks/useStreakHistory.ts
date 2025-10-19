"use client";

import { useEffect, useMemo, useState } from "react";
import { privateApiService } from "@/services/ApiPrivate";
import type { StreakDetail } from "@/model/streak/streakTypes";

export const useStreakHistory = () => {
  const [data, setData] = useState<StreakDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await privateApiService.getMyStreak();
        if (mounted) setData(res);
      } catch {
        if (mounted) setError("Không thể tải streak history");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const tz = data?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const calendarDays = useMemo(() => {
    if (!data?.streakHistory) return new Set<string>();
    // Normalize to YYYY-MM-DD in user's timezone
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const toKey = (d: string | Date) => formatter.format(new Date(d));
    return new Set<string>(data.streakHistory.map((d) => toKey(d)));
  }, [data, tz]);

  const daysGrid = useMemo(() => {
    // Build a full month grid starting Monday
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const firstWeekday = (first.getDay() + 6) % 7; // Monday=0
    const totalDays = last.getDate();

    const cells: { key: string; day: number | null; active: boolean }[] = [];
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Leading blanks
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ key: `b-${i}`, day: null, active: false });
    }
    // Days
    for (let d = 1; d <= totalDays; d++) {
      const key = formatter.format(new Date(year, month, d));
      cells.push({ key, day: d, active: calendarDays.has(key) });
    }
    // Pad to full weeks
    while (cells.length % 7 !== 0) cells.push({ key: `a-${cells.length}`, day: null, active: false });

    return cells;
  }, [year, month, calendarDays, tz]);

  const gotoPrevMonth = () => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const gotoNextMonth = () => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  return { data, loading, error, calendarDays, daysGrid, month, year, gotoPrevMonth, gotoNextMonth };
};

export default useStreakHistory;


