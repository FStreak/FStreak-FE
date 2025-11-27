"use client";
import { useEffect, useState } from "react";
import { Star, Flame, Trophy, Users, Award } from "lucide-react";
import { achievementService } from "@/services/achievementService";
import { useTokenInfoStorage } from "@/store/authStore";
import type { UserAchievementDto } from "@/model/achievement/userAchievementTypes";

export default function AchievementGrid() {
  const { userId } = useTokenInfoStorage();
  const [userAchievements, setUserAchievements] = useState<UserAchievementDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const achievements = await achievementService.getUserAchievements();
        setUserAchievements(achievements);
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [userId]);

  // Default achievements for display (locked/unlocked)
  const defaultAchievements = [
    { code: "first-step", icon: Star, title: "First Step", desc: "Đã có mặt trên hệ thống" },
    { code: "first-streak", icon: Flame, title: "First Streak", desc: "Đã có streak đầu tiên" },
    { code: "7-day-streak", icon: Flame, title: "7-Day Streak", desc: "1 tuần học liên tục" },
    { code: "lesson-master", icon: Trophy, title: "Lesson Master", desc: "Hoàn thành tất cả quiz" },
    { code: "group-leader", icon: Users, title: "Group Leader", desc: "Dẫn dắt nhóm học tập" },
    { code: "quick-learner", icon: Star, title: "Quick Learner", desc: "Top 10% tốc độ học" },
  ];

  const getIcon = (code?: string) => {
    const achievement = defaultAchievements.find(a => a.code === code);
    return achievement?.icon || Award;
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Your Achievements
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Đang tải achievements...</p>
        </div>
      </section>
    );
  }

  // Show user's earned achievements first, then show locked ones
  const earnedCodes = new Set(userAchievements.map(ua => ua.achievement?.code?.toLowerCase()));
  
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Your Achievements
        {userAchievements.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({userAchievements.length} đã đạt được)
          </span>
        )}
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Show earned achievements */}
        {userAchievements.map((ua) => {
          const Icon = getIcon(ua.achievement?.code);
          return (
            <div
              key={ua.id}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-amber-800/20 rounded-2xl p-6 border-2 border-orange-300 dark:border-orange-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 dark:from-orange-600 dark:to-amber-600 flex items-center justify-center mb-3 shadow-lg">
                {ua.achievement?.iconUrl ? (
                  <img src={ua.achievement.iconUrl} alt={ua.achievement.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <Icon className="w-6 h-6 text-white" />
                )}
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                {ua.achievement?.name || "Achievement"}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {ua.achievement?.description || "Chúc mừng bạn đã đạt được achievement này!"}
              </p>
              {ua.achievement?.points && (
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  +{ua.achievement.points} điểm
                </p>
              )}
              {ua.earnedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Đạt được: {new Date(ua.earnedAt).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          );
        })}
        
        {/* Show locked achievements (not yet earned) */}
        {defaultAchievements
          .filter(a => !earnedCodes.has(a.code.toLowerCase()))
          .map((achievement, i) => {
            const Icon = achievement.icon;
            return (
              <div
                key={`locked-${i}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm opacity-60"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">{achievement.desc}</p>
              </div>
            );
          })}
      </div>
    </section>
  );
}
