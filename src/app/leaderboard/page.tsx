"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { privateApiService } from "@/services/ApiPrivate";
import type { StreakLeaderboardItem } from "@/model/streak/streakTypes";
import { Trophy, Medal, Award, TrendingUp, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LeaderboardPeriod = "alltime" | "weekly";

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeaderboardPeriod>("alltime");
  const [leaderboard, setLeaderboard] = useState<StreakLeaderboardItem[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<StreakLeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLeaderboardData();
  }, [activeTab]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLeaderboard(leaderboard);
    } else {
      const filtered = leaderboard.filter((entry) =>
        entry.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeaderboard(filtered);
    }
  }, [searchTerm, leaderboard]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const period = activeTab === "alltime" ? 0 : 1;
      const response = await privateApiService.getStreakLeaderboard(0, period);
      setLeaderboard(response.items || []);
      setFilteredLeaderboard(response.items || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
      setFilteredLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-blue-600";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-white" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-white" />;
    if (rank === 3) return <Award className="w-6 h-6 text-white" />;
    return <span className="text-white font-bold text-lg">{rank}</span>;
  };

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Bảng Xếp Hạng
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Top những người học tập chăm chỉ nhất với streak cao nhất
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vị trí #1</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {filteredLeaderboard[0]?.displayName || "N/A"}
                  </p>
                  <p className="text-sm text-orange-500 font-semibold">
                    🔥 {filteredLeaderboard[0]?.currentStreak || 0} streak
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-600">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tổng người tham gia</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {leaderboard.length}
                  </p>
                  <p className="text-sm text-blue-500 font-semibold">
                    Đang cạnh tranh
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-orange-400 to-red-600">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Streak trung bình</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {leaderboard.length > 0
                      ? Math.round(
                          leaderboard.reduce((sum, entry) => sum + entry.currentStreak, 0) /
                            leaderboard.length
                        )
                      : 0}
                  </p>
                  <p className="text-sm text-orange-500 font-semibold">
                    Ngày liên tiếp
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("alltime")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "alltime"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                🔥 Mọi thời đại
              </button>
              <button
                onClick={() => setActiveTab("weekly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "weekly"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                📅 Tuần này
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <Card className="border-none shadow-xl">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Đang tải bảng xếp hạng...</p>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchTerm ? "Không tìm thấy người dùng nào" : "Chưa có dữ liệu leaderboard"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredLeaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;

                  return (
                    <button
                      key={entry.userId}
                      onClick={() => handleUserClick(entry.userId)}
                      className={`w-full p-6 flex items-center gap-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ${
                        isTopThree ? "bg-gradient-to-r from-orange-50/30 to-yellow-50/30 dark:from-orange-950/10 dark:to-yellow-950/10" : ""
                      }`}
                    >
                      {/* Rank Badge */}
                      <div
                        className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br ${getRankColor(
                          rank
                        )} shadow-lg flex-shrink-0 ${isTopThree ? "scale-110" : ""}`}
                      >
                        {getRankIcon(rank)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">
                            {entry.displayName}
                          </h3>
                          {isTopThree && (
                            <span className="text-xl">
                              {rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          ID: {entry.userId}
                        </p>
                      </div>

                      {/* Streak Display */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end mb-1">
                            <span className="text-2xl">🔥</span>
                            <span className="text-3xl font-bold text-orange-500">
                              {entry.currentStreak}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ngày liên tiếp
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        {filteredLeaderboard.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Hiển thị <span className="font-semibold text-orange-500">{filteredLeaderboard.length}</span>{" "}
              {searchTerm ? `kết quả tìm kiếm` : `người dùng`}
              {searchTerm && leaderboard.length > filteredLeaderboard.length && (
                <> từ tổng số <span className="font-semibold">{leaderboard.length}</span> người</>
              )}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

