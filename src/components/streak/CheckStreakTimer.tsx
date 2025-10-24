"use client";

import { useEffect, useState } from "react";
import ApiPrivate from "@/services/ApiPrivate";

export default function CheckStreakTimer() {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("🚫 No token found — skip streak timer.");
      return;
    }

    const savedTime = localStorage.getItem("loginTime");
    const now = new Date();
    const today = now.toDateString();

    if (!savedTime) {
      localStorage.setItem("loginTime", Date.now().toString());
    } else {
      const savedDate = new Date(Number(savedTime)).toDateString();
      if (savedDate !== today) {
        localStorage.setItem("loginTime", Date.now().toString());
      }
    }

    // ⏱️ Hiện popup sau 10 phút (600.000 ms)
    const loginTime = localStorage.getItem("loginTime");
    const elapsed = Date.now() - Number(loginTime);
    const remaining = Math.max(10 * 60 * 1000 - elapsed, 0);

    console.log(`⏱️ Remaining until popup: ${remaining / 1000}s`);
    const timer = setTimeout(() => {
      console.log("🔥 SHOW POPUP NOW!");
      setShowPopup(true);
    }, remaining);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Gọi API check-in (có fallback nếu fetch lỗi)
  const handleUpdateStreak = async () => {
    setLoading(true);
    setMessage(null);

    try {
      let realTime = new Date().toISOString();
      let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        console.log("🌐 Fetching real time from timeapi.io...");
        const res = await fetch("https://timeapi.io/api/Time/current/ip");
        if (res.ok) {
          const data = await res.json();
          realTime = data.dateTime || realTime;
          timezone = data.timeZone || timezone;
          console.log("✅ Real time from timeapi.io:", realTime, timezone);
        } else {
          console.warn("⚠️ timeapi.io returned error:", res.status);
        }
      } catch (fetchErr) {
        console.warn(
          "⚠️ WorldTimeAPI failed, fallback to local time:",
          fetchErr
        );
      }

      const body = { date: realTime, source: 0, timezone };
      console.log("📦 Sending check-in body:", body);

      const updated = await ApiPrivate.checkInStreak(body);
      setStreak(updated.currentStreak);
      setMessage(
        `🔥 Streak updated! Current streak: ${updated.currentStreak} day(s)`
      );
    } catch (err) {
      console.error("⚠️ Update streak failed:", err);
      setMessage("⚠️ Session expired or check-in failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99999] bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl w-[90%] max-w-md text-center transition-all">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ⏰ You’ve been studying for 10 minutes!
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
          <div className="flex flex-col items-center justify-center gap-4 text-orange-600 font-medium mt-2">
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
