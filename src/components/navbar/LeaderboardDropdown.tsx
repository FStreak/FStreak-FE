"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { privateApiService } from "@/services/ApiPrivate";
import type { StreakLeaderboardItem } from "@/model/streak/streakTypes";

export default function LeaderboardDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<StreakLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    if (open && leaderboard.length === 0) {
      fetchLeaderboard();
    }
  }, [open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await privateApiService.getStreakLeaderboard(0, 0); // Global, All Time
      setLeaderboard(response.items?.slice(0, 10) || []); // Top 10
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    setOpen(false);
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-blue-600";
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
        title="Leaderboard"
      >
        <Trophy className="w-5 h-5 text-orange-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-yellow-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">Top Streak Leaders</span>
              </div>
              <button
                onClick={() => router.push("/leaderboard")}
                className="text-xs text-white hover:underline"
              >
                View All
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                Đang tải...
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Chưa có dữ liệu leaderboard
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <button
                      key={entry.userId}
                      onClick={() => handleUserClick(entry.userId)}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      {/* Rank Badge */}
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${getRankColor(
                          rank
                        )} text-white text-xs font-bold shadow-sm flex-shrink-0`}
                      >
                        {rank <= 3 ? getRankEmoji(rank) : rank}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                          {entry.displayName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          ID: {entry.userId.slice(0, 8)}...
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-lg">🔥</span>
                        <span className="text-orange-500 font-bold text-sm">
                          {entry.currentStreak}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {leaderboard.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => {
                  router.push("/leaderboard");
                  setOpen(false);
                }}
                className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Xem bảng xếp hạng đầy đủ →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

