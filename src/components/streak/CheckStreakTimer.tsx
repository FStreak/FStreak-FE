"use client";

import { useEffect, useState, useRef } from "react";
import ApiPrivate from "@/services/ApiPrivate";
import { useTokenInfoStorage } from "@/store/authStore";
import type { StreakDetail } from "@/model/streak/streakTypes";

export default function CheckStreakTimer() {
  const { token, userId } = useTokenInfoStorage();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("🟢 Mounted — userId:", userId, "| token:", !!token);

    if (!token) return console.log("🚫 No token — skip streak timer");
    if (!userId) return console.log("⏳ Waiting for userId...");

    console.log("✅ Token & userId ready → fetching streak info...");

    const fetchStreakStatus = async () => {
      try {
        const data: StreakDetail = await ApiPrivate.getMyStreak();
        console.log("📦 Received streak data:", data);

        // 🧩 Kiểm tra userId khớp không
        if (!data.userId || data.userId !== userId) {
          console.warn(
            "⚠️ Wrong userId — streak data belongs to another user!"
          );
          resetForCurrentUser();
          return;
        }

        // 🆕 Nếu user chưa từng check-in
        if (!data.lastCheckInDate) {
          console.log("🆕 New user — no check-in history → start countdown");
          startCountdown();
          return;
        }

        // 🗓 Kiểm tra ngày check-in gần nhất
        const lastCheckin = new Date(data.lastCheckInDate);
        const today = new Date();
        const sameDay = lastCheckin.toDateString() === today.toDateString();

        console.log(
          "📅 Last check-in:",
          lastCheckin.toDateString(),
          "| Today:",
          today.toDateString()
        );

        if (sameDay) {
          console.log("✅ Already checked in today — no popup");
          return;
        }

        console.log("⏱ Not checked in today — starting countdown...");
        startCountdown();
      } catch (err) {
        console.warn(
          "⚠️ Could not fetch streak info — fallback to countdown",
          err
        );
        startCountdown();
      }
    };

    const resetForCurrentUser = () => {
      console.log("🧹 Reset streak for current user (wrong data or new user)");
      setStreak(0);
      setMessage(null);
      startCountdown();
    };

    const startCountdown = () => {
      console.log("⏰ Countdown started (10s test / 10min prod)");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        console.log("🔥 Countdown finished — showing popup");
        setShowPopup(true);
      }, 10 * 1000); // test: 10s → prod: 10 * 60 * 1000
    };

    fetchStreakStatus();

    // Cleanup (chỉ chạy ở production)
    return () => {
      if (process.env.NODE_ENV === "production" && timerRef.current) {
        clearTimeout(timerRef.current);
        console.log("🧹 Timer cleaned up (production only)");
      }
    };
  }, [token, userId]);

  // ✅ Handle Check-in
  const handleUpdateStreak = async () => {
    console.log("🚀 User confirmed check-in");
    if (!userId) return;
    setLoading(true);
    setMessage(null);

    try {
      const realTime = new Date().toISOString();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const body = { date: realTime, source: 0, timezone };
      console.log("📤 Sending payload:", body);

      const updated: StreakDetail = await ApiPrivate.checkInStreak(body);
      console.log("✅ Check-in success:", updated);

      setStreak(updated.currentStreak);
      setMessage(
        `🔥 Streak updated! Current streak: ${updated.currentStreak} day(s)`
      );
      setShowPopup(false);
    } catch (err) {
      console.error("❌ Check-in failed:", err);
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
