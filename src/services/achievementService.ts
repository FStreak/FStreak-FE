import { privateApiService } from "./ApiPrivate";
import { useTokenInfoStorage } from "@/store/authStore";
import type { UserAchievementDto } from "@/model/achievement/userAchievementTypes";
import { showSuccess } from "@/lib/toast";

/**
 * Service to handle achievement validation and awarding
 */
class AchievementService {
  /**
   * Find achievement by code
   */
  private async findAchievementByCode(code: string): Promise<string | null> {
    try {
      console.log(`🔍 Searching for achievement with code: "${code}"`);
      const allAchievements = await privateApiService.getAllAchievements();
      console.log(`📦 Found ${allAchievements.length} total achievements in system`);
      
      if (allAchievements.length > 0) {
        console.log("📋 Available achievement codes:", allAchievements.map(a => a.code || a.name).join(", "));
      }
      
      // Normalize codes for comparison (remove spaces, dashes, case-insensitive)
      const normalizeCode = (str: string) => str?.toLowerCase().replace(/[\s-]/g, '') || '';
      const normalizedSearchCode = normalizeCode(code);
      
      const achievement = allAchievements.find(
        a => {
          const normalizedCode = normalizeCode(a.code || '');
          const normalizedName = normalizeCode(a.name || '');
          return normalizedCode === normalizedSearchCode || 
                 normalizedName === normalizedSearchCode ||
                 normalizedCode.includes(normalizedSearchCode) ||
                 normalizedName.includes(normalizedSearchCode) ||
                 (a.code?.toLowerCase() === code.toLowerCase()) ||
                 (a.name?.toLowerCase().includes(code.toLowerCase()))
        }
      );
      
      if (achievement) {
        console.log(`✅ Found achievement: ${achievement.name} (ID: ${achievement.id}, Code: ${achievement.code})`);
        return achievement.id || null;
      } else {
        console.warn(`⚠️ Achievement with code "${code}" not found`);
        return null;
      }
    } catch (error) {
      console.error("❌ Error finding achievement by code:", error);
      return null;
    }
  }

  /**
   * Check and award "First-Step" achievement when user signs up
   * Should be called after user registration
   */
  async checkFirstStepAchievement(userId: string): Promise<void> {
    try {
      console.log("🔍 [First-Step] Checking achievement for user:", userId);
      
      // Check if user already has this achievement
      console.log("🔍 [First-Step] Fetching user achievements to check...");
      const userAchievements = await privateApiService.getUserAchievements();
      console.log(`🔍 [First-Step] User has ${userAchievements.length} achievements`);
      
      const hasFirstStep = userAchievements.some(
        ua => ua.achievement?.code?.toLowerCase() === "first-step" || 
              ua.achievement?.code?.toLowerCase() === "first step" ||
              ua.achievement?.code?.toLowerCase() === "firststep" ||
              ua.achievement?.name?.toLowerCase().includes("first step")
      );
      
      if (hasFirstStep) {
        console.log("✅ [First-Step] User already has First-Step achievement");
        return;
      }
      
      console.log("🔍 [First-Step] User does not have First-Step achievement, proceeding to award...");
      
      // Find achievement by code (try different possible codes)
      // Note: Backend has "first step" (with space), not "first-step"
      const codes = ["first step", "first-step", "First-Step", "firststep", "FirstStep", "first-steps"];
      let achievementId: string | null = null;
      
      for (const code of codes) {
        achievementId = await this.findAchievementByCode(code);
        if (achievementId) {
          console.log(`✅ Found First-Step achievement with code: ${code}`);
          break;
        }
      }
      
      if (!achievementId) {
        console.warn("⚠️ First-Step achievement not found in system. Tried codes:", codes);
        return;
      }
      
      // Note: Backend may automatically award achievements based on user actions
      // We'll try to claim, but if it fails with "User achievement not found",
      // it means the backend will handle it automatically
      try {
        console.log(`🎯 Attempting to claim First-Step achievement (ID: ${achievementId}) for user ${userId}`);
        const awarded = await privateApiService.claimAchievement(userId, achievementId);
        console.log("🎉 First-Step achievement awarded successfully:", awarded);
        showSuccess("🎉 Chúc mừng! Bạn đã nhận được achievement 'First Step'!");
      } catch (error: any) {
        const errorMessage = error?.message || '';
        
        // If error says "User achievement not found", backend likely handles achievements automatically
        if (errorMessage.includes('User achievement not found') || 
            errorMessage.includes('automatically awarded')) {
          console.log(
            "ℹ️ [First-Step] Backend requires user achievement to exist first. " +
            "This suggests achievements are automatically awarded by the backend. " +
            "The achievement will appear when backend processes it."
          );
          // Don't show error - backend will handle it automatically
          return;
        }
        
        console.error("❌ Error claiming First-Step achievement:", error);
        console.error("❌ Error details:", {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message
        });
        
        // If achievement doesn't exist or already awarded, ignore
        if (error?.response?.status === 404 || error?.response?.status === 400) {
          console.warn("⚠️ Could not claim First-Step achievement (404/400):", error?.response?.data);
        } else if (error?.response?.status === 500) {
          console.error("❌ Server error (500) when claiming First-Step achievement. Backend may not support this operation.");
        } else {
          // Log but don't throw - this is a background process
          console.error("❌ Unexpected error claiming First-Step achievement");
        }
      }
    } catch (error) {
      console.error("❌ Error checking First-Step achievement:", error);
      // Don't throw - this is a background process
    }
  }

  /**
   * Check and award "First Streak" achievement when user gets their first streak
   * Should be called after successful streak check-in
   */
  async checkFirstStreakAchievement(userId: string, currentStreak: number): Promise<void> {
    try {
      // Only check if streak is exactly 1 (first streak)
      if (currentStreak !== 1) {
        return;
      }
      
      console.log("🔍 Checking First Streak achievement for user:", userId);
      
      // Check if user already has this achievement
      const userAchievements = await privateApiService.getUserAchievements(userId);
      const hasFirstStreak = userAchievements.some(
        ua => ua.achievement?.code?.toLowerCase() === "first-streak" || 
              ua.achievement?.code?.toLowerCase() === "first streak" ||
              ua.achievement?.code?.toLowerCase() === "firststreak" ||
              ua.achievement?.name?.toLowerCase().includes("first streak")
      );
      
      if (hasFirstStreak) {
        console.log("✅ User already has First Streak achievement");
        return;
      }
      
      // Find achievement by code (try different possible codes)
      // Note: Backend has "first-streak" (with dash)
      const codes = ["first-streak", "First-Streak", "firststreak", "FirstStreak", "first streak", "first-streak-achievement"];
      let achievementId: string | null = null;
      
      for (const code of codes) {
        achievementId = await this.findAchievementByCode(code);
        if (achievementId) {
          console.log(`✅ Found First Streak achievement with code: ${code}`);
          break;
        }
      }
      
      if (!achievementId) {
        console.warn("⚠️ First Streak achievement not found in system. Tried codes:", codes);
        return;
      }
      
      // Note: Backend may automatically award achievements based on user actions
      // We'll try to claim, but if it fails with "User achievement not found",
      // it means the backend will handle it automatically
      try {
        console.log(`🎯 Attempting to claim First Streak achievement (ID: ${achievementId}) for user ${userId}`);
        const awarded = await privateApiService.claimAchievement(userId, achievementId);
        console.log("🎉 First Streak achievement awarded successfully:", awarded);
        showSuccess("🔥 Chúc mừng! Bạn đã nhận được achievement 'First Streak'!");
      } catch (error: any) {
        const errorMessage = error?.message || '';
        
        // If error says "User achievement not found", backend likely handles achievements automatically
        if (errorMessage.includes('User achievement not found') || 
            errorMessage.includes('automatically awarded')) {
          console.log(
            "ℹ️ [First Streak] Backend requires user achievement to exist first. " +
            "This suggests achievements are automatically awarded by the backend. " +
            "The achievement will appear when backend processes it."
          );
          // Don't show error - backend will handle it automatically
          return;
        }
        
        console.error("❌ Error claiming First Streak achievement:", error);
        console.error("❌ Error details:", {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message
        });
        
        // If achievement doesn't exist or already awarded, ignore
        if (error?.response?.status === 404 || error?.response?.status === 400) {
          console.warn("⚠️ Could not claim First Streak achievement (404/400):", error?.response?.data);
        } else if (error?.response?.status === 500) {
          console.error("❌ Server error (500) when claiming First Streak achievement. Backend may not support this operation.");
        } else {
          // Log but don't throw - this is a background process
          console.error("❌ Unexpected error claiming First Streak achievement");
        }
      }
    } catch (error) {
      console.error("❌ Error checking First Streak achievement:", error);
      // Don't throw - this is a background process
    }
  }

  /**
   * Get user achievements (with caching)
   */
  async getUserAchievements(userId?: string): Promise<UserAchievementDto[]> {
    try {
      console.log("🔍 Fetching user achievements for userId:", userId || "current user");
      const achievements = await privateApiService.getUserAchievements(userId);
      console.log("✅ Fetched achievements:", achievements?.length || 0, "items");
      return achievements || [];
    } catch (error: any) {
      console.error("❌ Error fetching user achievements:", error);
      console.error("❌ Error details:", {
        status: error?.response?.status,
        message: error?.response?.data?.message || error?.message,
        url: error?.config?.url
      });
      return [];
    }
  }
}

export const achievementService = new AchievementService();
export default achievementService;

