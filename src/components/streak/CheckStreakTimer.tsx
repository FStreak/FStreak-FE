"use client";

import { useEffect, useState } from "react";
import ApiPrivate from "@/services/ApiPrivate";
import { useTokenInfoStorage } from "@/store/authStore";

export default function CheckStreakTimer() {
  const { token, userId } = useTokenInfoStorage();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !userId) {
      console.log("🚫 Not logged in — disable streak timer.");
      setShowPopup(false);
      return;
    }

    const now = new Date();
    const today = now.toDateString();

    // 🧹 Reset theo ngày mới
    const lastResetDate = localStorage.getItem("lastResetDate");
    if (lastResetDate !== today) {
      console.log("🌅 New day detected — reset user check-ins.");
      localStorage.removeItem(`checkedInUser_${userId}`);
      localStorage.setItem("lastResetDate", today);
    }

    // 📦 Kiểm tra user đã check-in hôm nay chưa
    const checkedDate = localStorage.getItem(`checkedInUser_${userId}`);
    if (checkedDate === today) {
      console.log(`✅ User ${userId} already checked in today.`);
      return;
    }

    // 🕐 Nếu chưa có loginTime hoặc ngày mới thì reset lại
    const savedTime = localStorage.getItem(`loginTime_${userId}`);
    const savedDate = localStorage.getItem(`loginDate_${userId}`);

    if (!savedTime || savedDate !== today) {
      localStorage.setItem(`loginTime_${userId}`, Date.now().toString());
      localStorage.setItem(`loginDate_${userId}`, today);
      console.log("🕒 New loginTime set:", now.toLocaleTimeString());
    }

    // ⏱ Test: 10s (thực tế: 10 * 60 * 1000)
    const loginTime = Number(localStorage.getItem(`loginTime_${userId}`));
    const elapsed = Date.now() - loginTime;
    const remaining = Math.max(10 * 1000 - elapsed, 0);

    console.log(`⏱ Countdown for ${userId}: ${(remaining / 1000).toFixed(1)}s`);

    const timer = setTimeout(() => {
      console.log("🔥 Show popup for streak check-in!");
      setShowPopup(true);
    }, remaining);

    return () => clearTimeout(timer);
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
      const updated = await ApiPrivate.checkInStreak(body);

      setStreak(updated.currentStreak);
      setMessage(
        `🔥 Streak updated! Current streak: ${updated.currentStreak} day(s)`
      );

      const today = new Date().toDateString();
      localStorage.setItem(`checkedInUser_${userId}`, today); // ✅ lưu riêng từng user
      localStorage.setItem(`loginTime_${userId}`, Date.now().toString());
      localStorage.setItem(`loginDate_${userId}`, today);
    } catch (err) {
      console.error("⚠️ Update streak failed:", err);
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
              <button
                onClick={() => setShowPopup(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium transition"
              >
                Not now
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
