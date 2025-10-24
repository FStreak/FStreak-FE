"use client";

import { useEffect, useState } from "react";
import ApiPrivate from "@/services/ApiPrivate";
import { useTokenInfoStorage } from "@/store/authStore";
import type { StreakDetail } from "@/model/streak/streakTypes";

export default function CheckStreakTimer() {
  const { token, userId } = useTokenInfoStorage();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 🧩 Kiểm tra trạng thái streak khi login
  useEffect(() => {
    if (!token || !userId) {
      console.log("🚫 Not logged in — disable streak timer.");
      return;
    }

    const fetchStreakStatus = async () => {
      try {
        const data: StreakDetail = await ApiPrivate.getMyStreak();
        console.log("🧠 Current streak:", data);

        // 🗓 Kiểm tra ngày cuối cùng check-in
        const lastCheckin = data.lastCheckInDate
          ? new Date(data.lastCheckInDate)
          : null;
        const today = new Date();

        const alreadyCheckedToday =
          lastCheckin && lastCheckin.toDateString() === today.toDateString();

        if (alreadyCheckedToday) {
          console.log("✅ Already checked in today — skip popup.");
          return; // Không hiện popup
        }

        // 🕒 Chưa check-in → bắt đầu đếm ngược
        console.log("⏱ Countdown started...");
        startCountdown();
      } catch (error) {
        console.warn(
          "⚠️ Could not fetch streak info. Defaulting to countdown.",
          error
        );
        startCountdown();
      }
    };

    const startCountdown = () => {
      // test: 10s, production: 10 * 60 * 1000
      const timer = setTimeout(() => {
        console.log("🔥 Show popup for streak check-in!");
        setShowPopup(true);
      }, 10 * 60 * 1000);
      return () => clearTimeout(timer);
    };

    fetchStreakStatus();
  }, [token, userId]);

  // ✅ Gọi API check-in
  const handleUpdateStreak = async () => {
    if (!userId) return;
    setLoading(true);
    setMessage(null);

    try {
      let realTime = new Date().toISOString();
      let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        const res = await fetch("https://timeapi.io/api/Time/current/ip");
        if (res.ok) {
          const data = await res.json();
          realTime = data.dateTime || realTime;
          timezone = data.timeZone || timezone;
        }
      } catch {
        console.warn("⚠️ Using fallback local time.");
      }

      const body = { date: realTime, source: 0, timezone };
      const updated: StreakDetail = await ApiPrivate.checkInStreak(body);

      setStreak(updated.currentStreak);
      setMessage(
        `🔥 Streak updated! Current streak: ${updated.currentStreak} day(s)`
      );
      setShowPopup(false); // ẩn popup sau khi check-in thành công
    } catch (error) {
      console.error("⚠️ Update streak failed:", error);
      setMessage("⚠️ Session expired or check-in failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !userId || !showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ⏰ You’ve been studying for 10 seconds!
        </h2>

        {!message ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Do you want to update your streak progress now?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUpdateStreak}
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition disabled:opacity-60"
              >
                {loading ? "Updating..." : "Yes, Update Streak 🔥"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-orange-600 font-medium mt-2">
            <p>{message}</p>
            {streak !== null && (
              <p className="text-sm text-gray-500">
                Keep going! 🔥 Every day counts.
              </p>
            )}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
