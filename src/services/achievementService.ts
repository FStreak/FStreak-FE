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
   * Award achievement with retry logic and multiple attempts
   */
  private async awardAchievementWithRetry(
    userId: string, 
    achievementId: string, 
    achievementName: string,
    maxRetries: number = 3,
    delayMs: number = 2000
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🎯 [Attempt ${attempt}/${maxRetries}] Attempting to claim ${achievementName} (ID: ${achievementId}) for user ${userId}`);
        
        // Wait before retry (except first attempt)
        if (attempt > 1) {
          console.log(`⏳ Waiting ${delayMs}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        
        // Use claim endpoint directly
        // Note: Backend requires user achievement to exist before claiming
        // Backend should automatically create user achievement when user meets criteria (e.g., signup, first streak)
        // If user achievement doesn't exist, backend will return 400 "User achievement not found"
        const awarded = await privateApiService.claimAchievement(userId, achievementId);
        console.log(`🎉 ${achievementName} claimed successfully:`, awarded);
        showSuccess(`🎉 Chúc mừng! Bạn đã nhận được achievement '${achievementName}'!`);
        return true;
      } catch (error: any) {
        console.error(`❌ [Attempt ${attempt}/${maxRetries}] Error claiming ${achievementName}:`, error);
        
        // If achievement already exists/claimed, that's okay
        if (error?.response?.status === 400) {
          const errorData = error?.response?.data;
          const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message || '';
          if (errorMessage.toLowerCase().includes('already') || 
              errorMessage.toLowerCase().includes('claimed')) {
            console.log(`✅ ${achievementName} already claimed`);
            return true;
          }
          
          // If error is "User achievement not found", backend requires user achievement to exist first
          // This means backend should automatically create user achievement when user meets criteria
          // (e.g., when user signs up for "First Step", or when user gets first streak for "First Streak")
          if (errorMessage.toLowerCase().includes('user achievement not found') ||
              errorMessage.toLowerCase().includes('not found')) {
            console.warn(
              `⚠️ [${achievementName}] Backend requires user achievement to exist before claiming. ` +
              `This achievement should be automatically created by the backend when you meet the criteria. ` +
              `If you don't see it, backend may need to be configured to auto-create user achievements ` +
              `when conditions are met (e.g., signup for "First Step", first streak for "First Streak").`
            );
            // Don't retry - backend needs to create user achievement first
            return false;
          }
        }
        
        // If it's the last attempt, log final error
        if (attempt === maxRetries) {
          console.error(`❌ Failed to claim ${achievementName} after ${maxRetries} attempts`);
          console.error("❌ Final error details:", {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            message: error?.message
          });
          return false;
        }
      }
    }
    return false;
  }

  /**
   * Check and award "First-Step" achievement when user signs up
   * Should be called after user registration
   */
  async checkFirstStepAchievement(userId: string): Promise<void> {
    try {
      console.log("🔍 [First-Step] Checking achievement for user:", userId);
      
      // Wait a bit to ensure backend has processed the registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already has this achievement (with retry)
      let userAchievements: UserAchievementDto[] = [];
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔍 [First-Step] Fetching user achievements (attempt ${attempt})...`);
          userAchievements = await privateApiService.getUserAchievements(userId);
          console.log(`🔍 [First-Step] User has ${userAchievements.length} achievements`);
          break;
        } catch (error: any) {
          if (attempt === 3) {
            console.warn("⚠️ [First-Step] Could not fetch user achievements after 3 attempts");
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      const hasFirstStep = userAchievements.some(
        ua => {
          const code = ua.achievement?.code?.toLowerCase() || '';
          const name = ua.achievement?.name?.toLowerCase() || '';
          return code === "first-step" || 
                 code === "first step" ||
                 code === "firststep" ||
                 name.includes("first step") ||
                 name.includes("first-step");
        }
      );
      
      if (hasFirstStep) {
        console.log("✅ [First-Step] User already has First-Step achievement");
        return;
      }
      
      console.log("🔍 [First-Step] User does not have First-Step achievement, proceeding to award...");
      
      // Find achievement by code (try different possible codes)
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
      
      // Award with retry logic (3 attempts, 2s delay between attempts)
      const success = await this.awardAchievementWithRetry(
        userId, 
        achievementId, 
        "First Step",
        3, // max retries
        2000 // 2s delay
      );
      
      if (!success) {
        console.warn(
          "⚠️ [First-Step] Could not award achievement after multiple attempts. " +
          "Backend may need to be configured to automatically award this achievement on signup."
        );
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
      
      // Claim the achievement - create/award user achievement first if needed
      try {
        console.log(`🎯 Attempting to claim First Streak achievement (ID: ${achievementId}) for user ${userId}`);
        const awarded = await privateApiService.claimAchievement(userId, achievementId);
        console.log("🎉 First Streak achievement awarded successfully:", awarded);
        showSuccess("🔥 Chúc mừng! Bạn đã nhận được achievement 'First Streak'!");
      } catch (error: any) {
        console.error("❌ Error claiming First Streak achievement:", error);
        console.error("❌ Error details:", {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message
        });
        
        // If achievement already exists/claimed, that's okay
        if (error?.response?.status === 400) {
          const errorData = error?.response?.data;
          const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message || '';
          if (errorMessage.toLowerCase().includes('already') || 
              errorMessage.toLowerCase().includes('claimed')) {
            console.log("ℹ️ [First Streak] Achievement already claimed");
            return;
          }
          
          // If error is "User achievement not found", backend may require automatic awarding
          if (errorMessage.toLowerCase().includes('user achievement not found') ||
              errorMessage.toLowerCase().includes('not found') ||
              errorMessage.toLowerCase().includes('must be created')) {
            console.warn(
              "⚠️ [First Streak] Backend requires user achievement to exist before claiming. " +
              "This achievement should be automatically awarded by the backend when you get your first streak. " +
              "If you don't see it, please contact support or check if backend is configured to auto-award on first streak."
            );
            // Don't show error to user - backend should handle it automatically
            return;
          }
        }
        
        // If error message indicates backend requires automatic awarding
        if (error?.message?.includes('automatically awarded') || 
            error?.message?.includes('Backend may require')) {
          console.warn(
            "⚠️ [First Streak] Backend requires achievements to be automatically awarded. " +
            "The achievement should appear automatically when you get your first streak. " +
            "If it doesn't, backend may need to be configured to auto-award on first streak."
          );
          return;
        }
        
        // Log error but don't throw - this is a background process
        if (error?.response?.status === 404) {
          console.warn("⚠️ Could not claim First Streak achievement (404): Achievement or user not found");
        } else if (error?.response?.status === 403) {
          console.warn("⚠️ Could not claim First Streak achievement (403): No permission to award achievement");
        } else if (error?.response?.status === 500) {
          console.error("❌ Server error (500) when claiming First Streak achievement");
        } else {
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

