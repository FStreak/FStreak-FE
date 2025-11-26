"use client";
import { useEffect, useState } from "react";
import { Award, Trophy, Star, Flame } from "lucide-react";
import { achievementService } from "@/services/achievementService";
import { useTokenInfoStorage } from "@/store/authStore";
import type { UserAchievementDto } from "@/model/achievement/userAchievementTypes";

export default function ProfileAchievements() {
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
        console.log("🔍 Loading achievements for user:", userId);
        // Note: getUserAchievements will use /me endpoint regardless of userId
        const achievements = await achievementService.getUserAchievements();
        console.log("✅ Loaded achievements:", achievements);
        console.log("✅ Achievements count:", achievements?.length || 0);
        if (achievements && achievements.length > 0) {
          console.log("✅ Achievement details:", achievements.map(a => ({
            id: a.id,
            name: a.achievement?.name,
            code: a.achievement?.code,
            earnedAt: a.earnedAt
          })));
        }
        setUserAchievements(achievements || []);
      } catch (error) {
        console.error("❌ Error loading achievements:", error);
        // Set empty array on error to show empty state
        setUserAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Achievements
        </h3>
        <p className="text-gray-500 text-center py-4">Đang tải...</p>
      </div>
    );
  }

  // Function to manually check and award missing achievements
  const checkAndAwardMissingAchievements = async () => {
    if (!userId) return;
    
    try {
      console.log("🔍 Manually checking for missing achievements...");
      
      // Check First-Step achievement
      await achievementService.checkFirstStepAchievement(userId);
      
      // Check First Streak achievement if user has streak >= 1
      // We'll check this by fetching streak data
      try {
        const ApiPrivate = await import("@/services/ApiPrivate");
        const streakData = await ApiPrivate.default.getMyStreak();
        if (streakData.currentStreak >= 1) {
          await achievementService.checkFirstStreakAchievement(userId, streakData.currentStreak);
        }
      } catch (error) {
        console.warn("⚠️ Could not check streak for First Streak achievement:", error);
      }
      
      // Reload achievements after awarding
      setTimeout(async () => {
        try {
          const achievements = await achievementService.getUserAchievements();
          setUserAchievements(achievements || []);
        } catch (error) {
          console.error("❌ Error reloading achievements:", error);
        }
      }, 2000);
    } catch (error) {
      console.error("❌ Error checking missing achievements:", error);
    }
  };

  if (userAchievements.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Achievements
        </h3>
        <p className="text-gray-500 text-center py-4 mb-4">
          Chưa có achievement nào. Hãy bắt đầu học để nhận achievements!
        </p>
        <button
          onClick={checkAndAwardMissingAchievements}
          className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          🔍 Kiểm tra và nhận achievements
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Achievements ({userAchievements.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {userAchievements.map((ua) => (
          <div
            key={ua.id}
            className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-amber-800/20 rounded-lg p-4 border-2 border-orange-300 dark:border-orange-700"
          >
            <div className="flex items-center gap-3 mb-2">
              {ua.achievement?.iconUrl ? (
                <img 
                  src={ua.achievement.iconUrl} 
                  alt={ua.achievement.name} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                  {ua.achievement?.name || "Achievement"}
                </h4>
                {ua.achievement?.points && (
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    +{ua.achievement.points} điểm
                  </p>
                )}
              </div>
            </div>
            {ua.achievement?.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {ua.achievement.description}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {new Date(ua.earnedAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

