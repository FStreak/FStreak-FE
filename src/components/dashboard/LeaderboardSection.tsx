"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { privateApiService } from "@/services/ApiPrivate";
import type { StreakLeaderboardItem } from "@/model/streak/streakTypes";

type LeaderboardTab = "alltime" | "weekly";

export default function LeaderboardSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("alltime");
  const [leaderboard, setLeaderboard] = useState<StreakLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
  }, [activeTab]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // scope: 0 = Global, period: 0 = AllTime, 1 = Weekly
      const period = activeTab === "alltime" ? 0 : 1;
      const response = await privateApiService.getStreakLeaderboard(0, period);
      setLeaderboard(response.items || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-orange-600";
    return "bg-gradient-to-br from-blue-400 to-blue-600";
  };

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        🏆 Bảng xếp hạng Streak
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("alltime")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "alltime"
              ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          🔥 Mọi thời đại
        </button>
        <button
          onClick={() => setActiveTab("weekly")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === "weekly"
              ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          📅 Tuần này
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-t-4 border-orange-400 shadow-sm hover:shadow-md transition-all">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Đang tải...
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Chưa có dữ liệu
              </div>
            ) : (
              leaderboard.map((entry, index) => {
                const rank = index + 1;
                return (
                  <button
                    key={entry.userId}
                    onClick={() => handleUserClick(entry.userId)}
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${getRankColor(rank)} w-10 h-10 text-white flex items-center justify-center rounded-full text-sm font-bold shadow-md`}
                      >
                        {rank}
                      </div>
                      <div className="text-left">
                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                          {entry.displayName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {entry.userId.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-500 font-semibold text-lg">
                        🔥 {entry.currentStreak}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.currentStreak > 1 ? "ngày" : "ngày"}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
