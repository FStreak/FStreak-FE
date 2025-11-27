import { apiService } from "./apiService";
import { wrapResponse } from "./ApiServiceConfig";
import { useTokenInfoStorage } from "@/store/authStore";
import { isAdmin } from "@/utils/auth";
import { privateApiService } from "./ApiPrivate";
import type {
  AdminUser,
  AdminUserListResponse,
  AddRoleRequest,
  LockUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
  AchievementDto,
  CreateAchievementDto,
  UpdateAchievementDto,
  ToggleStatusRequest,
  ShopItemDto,
  CreateShopItemDto,
  UpdateShopItemDto,
} from "@/model/admin/adminTypes";

/** Helper function to check admin authentication and authorization */
function checkAdminAccess(): void {
  const { token } = useTokenInfoStorage.getState();
  
  console.log('🔍 checkAdminAccess: Checking admin access...');
  console.log('🔍 checkAdminAccess: Has token?', !!token);
  console.log('🔍 checkAdminAccess: Token length:', token?.length || 0);
  
  if (!token) {
    console.error('❌ checkAdminAccess: No token found');
    throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
  }

  // Decode token to show what's inside
  try {
    const base64Url = token.split('.')[1];
    if (base64Url) {
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      console.log('🔍 checkAdminAccess: Decoded token payload:', decoded);
      console.log('🔍 checkAdminAccess: Token role claim:', decoded['role'] || decoded['Role'] || 'Not found');
    }
  } catch (e) {
    console.warn('⚠️ checkAdminAccess: Could not decode token for logging:', e);
  }

  const userIsAdmin = isAdmin(token);
  console.log('🔍 checkAdminAccess: Is admin?', userIsAdmin);
  
  if (!userIsAdmin) {
    // Also check localStorage as fallback
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('🔍 checkAdminAccess: Checking localStorage user:', user);
        if (user.roles && Array.isArray(user.roles)) {
          const hasAdminInLocalStorage = user.roles.some((r: string) => r.toLowerCase() === 'admin');
          console.log('🔍 checkAdminAccess: Has admin in localStorage?', hasAdminInLocalStorage);
          if (hasAdminInLocalStorage) {
            console.log('✅ checkAdminAccess: Admin role found in localStorage, allowing access');
            return; // Allow access if found in localStorage
          }
        }
      }
    } catch (e) {
      console.error('❌ checkAdminAccess: Error reading localStorage:', e);
    }
    
    console.error('❌ checkAdminAccess: User is not admin');
    throw new Error("Bạn không có quyền admin để truy cập API này. Vui lòng đăng nhập bằng tài khoản admin.");
  }
  
  console.log('✅ checkAdminAccess: Admin access granted - proceeding with API call');
}

export const adminApiService = {
  // ============ USERS APIs ============
  /** Get all users with pagination */
  getUsers: async (page: number = 1, pageSize: number = 20): Promise<AdminUserListResponse> => {
    try {
      // Check admin role before making API call
      checkAdminAccess();
      
      const { token } = useTokenInfoStorage.getState();
      console.log("🔍 Requesting admin users:", {
        page,
        pageSize,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        isAdmin: true,
      });

      const response = await apiService.privateApiClient.get<any>(
        `/admin/users?page=${page}&pageSize=${pageSize}`
      );
      const rawData = wrapResponse(response);
      
      console.log("✅ Raw admin users API response:", rawData);
      console.log("✅ Response type:", typeof rawData);
      console.log("✅ Is array:", Array.isArray(rawData));
      
      // Handle both formats: array directly or object with items/data property
      let users: AdminUser[] = [];
      let total = 0;
      
      if (Array.isArray(rawData)) {
        // Backend returns array directly
        users = rawData;
        total = rawData.length;
        console.log("✅ Backend returned array, users count:", users.length);
      } else if (rawData && typeof rawData === 'object') {
        // Backend returns object with items/data/users property
        users = rawData.items || rawData.Items || rawData.data || rawData.Data || rawData.users || rawData.Users || [];
        total = rawData.total || rawData.Total || rawData.count || rawData.Count || users.length;
        console.log("✅ Backend returned object, users count:", users.length, "total:", total);
      } else {
        console.warn("⚠️ Unexpected response format:", rawData);
        users = [];
        total = 0;
      }
      
      // Normalize response
      const normalized: AdminUserListResponse = {
        items: users,
        total: total,
        page: rawData?.page || rawData?.Page || page,
        pageSize: rawData?.pageSize || rawData?.PageSize || pageSize,
      };
      
      console.log("✅ Normalized response:", normalized);
      return normalized;
    } catch (error: any) {
      console.error("❌ Error fetching admin users:", error);
      console.error("❌ Error status:", error?.response?.status);
      console.error("❌ Error response:", error?.response);
      console.error("❌ Error response data:", error?.response?.data);
      console.error("❌ Error response headers:", error?.response?.headers);
      console.error("❌ Request config:", {
        url: error?.config?.url,
        method: error?.config?.method,
        headers: error?.config?.headers,
      });
      
      // Re-throw error - let UI handle error display
      throw error;
    }
  },

  /** Get user by ID */
  getUserById: async (id: string): Promise<AdminUser> => {
    try {
      checkAdminAccess();
      console.log(`🔍 Requesting admin user by ID: ${id}`);
      const response = await apiService.privateApiClient.get<any>(`/admin/users/${id}`);
      const rawData = wrapResponse(response);
      
      console.log("✅ Raw admin user by ID response:", rawData);
      
      // Handle different response formats
      if (rawData && typeof rawData === 'object') {
        // Return the user object directly
        return rawData as AdminUser;
      }
      
      console.warn("⚠️ Unexpected response format for user by ID:", rawData);
      throw new Error("Invalid response format from server");
    } catch (error: any) {
      console.error("❌ Error fetching admin user by ID:", error);
      throw error;
    }
  },

  /** Add role to user */
  addRoleToUser: async (id: string, data: AddRoleRequest): Promise<void> => {
    try {
      checkAdminAccess();
      console.log(`🔍 Adding role "${data.role}" to user ${id}`);
      const response = await apiService.privateApiClient.post<void>(`/admin/users/${id}/roles`, data);
      console.log("✅ Role added successfully");
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error adding role:", error);
      throw error;
    }
  },

  /** Remove role from user */
  removeRoleFromUser: async (id: string, role: string): Promise<void> => {
    try {
      checkAdminAccess();
      console.log(`🔍 Removing role "${role}" from user ${id}`);
      const response = await apiService.privateApiClient.delete<void>(`/admin/users/${id}/roles/${role}`);
      console.log("✅ Role removed successfully");
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error removing role:", error);
      throw error;
    }
  },

  /** Lock/Unlock user */
  lockUser: async (id: string, data: LockUserRequest): Promise<void> => {
    try {
      checkAdminAccess();
      console.log(`🔍 ${data.isLocked ? 'Locking' : 'Unlocking'} user ${id}`, data);
      const response = await apiService.privateApiClient.put<void>(`/admin/users/${id}/lock`, data);
      console.log(`✅ User ${data.isLocked ? 'locked' : 'unlocked'} successfully`);
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error locking/unlocking user:", error);
      throw error;
    }
  },

  // ============ ACHIEVEMENTS APIs ============
  /** Get all achievements */
  getAchievements: async (page: number = 1, pageSize: number = 100): Promise<{ items: AchievementDto[]; total: number; page: number; pageSize: number }> => {
    try {
      checkAdminAccess();
      console.log("🔍 Requesting achievements from /api/Achievements");
      
      // Backend endpoint is /api/Achievements (returns all achievements)
      const response = await apiService.privateApiClient.get<AchievementDto[]>(
        `/Achievements`
      );
      const rawData = wrapResponse(response);
      
      console.log("✅ Raw achievements API response:", rawData);
      console.log("✅ Response type:", typeof rawData);
      console.log("✅ Is array:", Array.isArray(rawData));
      
      // Handle both formats: array directly or object with items/data property
      let achievements: AchievementDto[] = [];
      let total = 0;
      
      if (Array.isArray(rawData)) {
        achievements = rawData;
        total = rawData.length;
        console.log("✅ Backend returned array, achievements count:", achievements.length);
      } else if (rawData && typeof rawData === 'object') {
        const dataObj = rawData as any;
        achievements = dataObj.items || dataObj.Items || dataObj.data || dataObj.Data || dataObj.achievements || dataObj.Achievements || [];
        total = dataObj.total || dataObj.Total || dataObj.count || dataObj.Count || achievements.length;
        console.log("✅ Backend returned object, achievements count:", achievements.length, "total:", total);
      } else {
        console.warn("⚠️ Unexpected response format:", rawData);
        achievements = [];
        total = 0;
      }
      
      const normalized = {
        items: achievements,
        total: total,
        page: (rawData as any)?.page || (rawData as any)?.Page || page,
        pageSize: (rawData as any)?.pageSize || (rawData as any)?.PageSize || pageSize,
      };
      
      console.log("✅ Normalized achievements response:", normalized);
      return normalized;
    } catch (error: any) {
      // If endpoint doesn't exist (404) or method not allowed (405), return empty list instead of throwing
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        console.warn("⚠️ GET /admin/achievements endpoint not available (404/405), returning empty list");
        return { items: [], total: 0, page, pageSize };
      }
      console.error("❌ Error fetching admin achievements:", error);
      throw error;
    }
  },

  /** Create achievement */
  createAchievement: async (data: CreateAchievementDto): Promise<AchievementDto> => {
    try {
      checkAdminAccess();
      
      // Clean up data: remove empty strings, handle base64 images
      const cleanedData: CreateAchievementDto = {
        name: data.name.trim(),
        code: data.code.trim(),
        ...(data.description && data.description.trim() ? { description: data.description.trim() } : {}),
        ...(data.points !== undefined && data.points !== null ? { points: data.points } : {}),
        // Only include iconUrl if it's not a base64 data URL (too large) or if it's a URL string
        ...(data.iconUrl && !data.iconUrl.startsWith('data:image/') ? { iconUrl: data.iconUrl } : {}),
      };
      
      console.log("🔍 Creating achievement with data:", cleanedData);
      
      const response = await apiService.privateApiClient.post<AchievementDto>(`/admin/achievements`, cleanedData);
      const result = wrapResponse(response);
      console.log("✅ Achievement created successfully:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Error creating achievement:", error);
      console.error("❌ Error response:", error?.response);
      console.error("❌ Error response data:", error?.response?.data);
      console.error("❌ Error response status:", error?.response?.status);
      throw error;
    }
  },

  /** Get achievement by ID */
  getAchievementById: async (id: string): Promise<AchievementDto> => {
    try {
      checkAdminAccess();
      console.log(`🔍 Fetching achievement by ID: ${id}`);
      
      const response = await apiService.privateApiClient.get<any>(`/admin/achievements/${id}`);
      const rawData = wrapResponse(response);
      
      console.log("✅ Raw achievement by ID response:", rawData);
      
      // Handle different response formats
      if (rawData && typeof rawData === 'object') {
        const achievement = rawData as AchievementDto;
        console.log("✅ Achievement fetched successfully:", achievement);
        return achievement;
      }
      
      console.warn("⚠️ Unexpected response format for achievement by ID:", rawData);
      throw new Error("Invalid response format from server");
    } catch (error: any) {
      console.error("❌ Error fetching achievement by ID:", error);
      console.error("❌ Error response:", error?.response);
      console.error("❌ Error response data:", error?.response?.data);
      console.error("❌ Error response status:", error?.response?.status);
      throw error;
    }
  },

  /** Update achievement */
  updateAchievement: async (id: string, data: UpdateAchievementDto): Promise<AchievementDto> => {
    try {
      checkAdminAccess();
      
      // Clean up data: remove empty strings, handle base64 images
      const cleanedData: UpdateAchievementDto = {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.code ? { code: data.code.trim() } : {}),
        ...(data.description && data.description.trim() ? { description: data.description.trim() } : {}),
        ...(data.points !== undefined && data.points !== null ? { points: data.points } : {}),
        // Only include iconUrl if it's not a base64 data URL (too large) or if it's a URL string
        ...(data.iconUrl && !data.iconUrl.startsWith('data:image/') ? { iconUrl: data.iconUrl } : {}),
      };
      
      console.log("🔍 Updating achievement with data:", cleanedData);
      
      const response = await apiService.privateApiClient.put<AchievementDto>(`/admin/achievements/${id}`, cleanedData);
      const result = wrapResponse(response);
      console.log("✅ Achievement updated successfully:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Error updating achievement:", error);
      console.error("❌ Error response data:", error?.response?.data);
      throw error;
    }
  },

  /** Delete achievement */
  deleteAchievement: async (id: string): Promise<void> => {
    checkAdminAccess();
    await apiService.privateApiClient.delete<void>(`/admin/achievements/${id}`);
    // 204 No Content - no response body to unwrap
  },

  /** Activate/Deactivate achievement */
  toggleAchievementStatus: async (id: string, data: ToggleStatusRequest): Promise<void> => {
    checkAdminAccess();
    await apiService.privateApiClient.post<void>(`/admin/achievements/${id}/activate`, data);
    // 200 OK with no response body
  },

  // ============ SHOP ITEMS APIs ============
  /** Get all shop items */
  getShopItems: async (page: number = 1, pageSize: number = 100): Promise<{ items: ShopItemDto[]; total: number; page: number; pageSize: number }> => {
    try {
      checkAdminAccess();
      console.log("🔍 Requesting admin shop items:", { page, pageSize });
      
      const response = await apiService.privateApiClient.get<any>(
        `/admin/shop/items?page=${page}&pageSize=${pageSize}`
      );
      const rawData = wrapResponse(response);
      
      console.log("✅ Raw admin shop items API response:", rawData);
      console.log("✅ Response type:", typeof rawData);
      console.log("✅ Is array:", Array.isArray(rawData));
      
      // Handle both formats: array directly or object with items/data property
      let shopItems: ShopItemDto[] = [];
      let total = 0;
      
      if (Array.isArray(rawData)) {
        shopItems = rawData;
        total = rawData.length;
        console.log("✅ Backend returned array, shop items count:", shopItems.length);
      } else if (rawData && typeof rawData === 'object') {
        shopItems = rawData.items || rawData.Items || rawData.data || rawData.Data || rawData.shopItems || rawData.ShopItems || [];
        total = rawData.total || rawData.Total || rawData.count || rawData.Count || shopItems.length;
        console.log("✅ Backend returned object, shop items count:", shopItems.length, "total:", total);
      } else {
        console.warn("⚠️ Unexpected response format:", rawData);
        shopItems = [];
        total = 0;
      }
      
      const normalized = {
        items: shopItems,
        total: total,
        page: rawData?.page || rawData?.Page || page,
        pageSize: rawData?.pageSize || rawData?.PageSize || pageSize,
      };
      
      console.log("✅ Normalized shop items response:", normalized);
      return normalized;
    } catch (error: any) {
      // If endpoint doesn't exist (404) or method not allowed (405), return empty list instead of throwing
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        console.warn("⚠️ GET /admin/shop/items endpoint not available (404/405), returning empty list");
        return { items: [], total: 0, page, pageSize };
      }
      console.error("❌ Error fetching admin shop items:", error);
      throw error;
    }
  },

  /** Create shop item */
  createShopItem: async (data: CreateShopItemDto): Promise<ShopItemDto> => {
    checkAdminAccess();
    const response = await apiService.privateApiClient.post<ShopItemDto>(`/admin/shop/items`, data);
    return wrapResponse(response);
  },

  /** Get shop item by ID */
  getShopItemById: async (id: string): Promise<ShopItemDto> => {
    try {
      checkAdminAccess();
      console.log(`🔍 Fetching shop item by ID: ${id}`);
      
      const response = await apiService.privateApiClient.get<any>(`/admin/shop/items/${id}`);
      const rawData = wrapResponse(response);
      
      console.log("✅ Raw shop item by ID response:", rawData);
      
      // Handle different response formats
      if (rawData && typeof rawData === 'object') {
        const shopItem = rawData as ShopItemDto;
        console.log("✅ Shop item fetched successfully:", shopItem);
        return shopItem;
      }
      
      console.warn("⚠️ Unexpected response format for shop item by ID:", rawData);
      throw new Error("Invalid response format from server");
    } catch (error: any) {
      console.error("❌ Error fetching shop item by ID:", error);
      console.error("❌ Error response:", error?.response);
      console.error("❌ Error response data:", error?.response?.data);
      console.error("❌ Error response status:", error?.response?.status);
      throw error;
    }
  },

  /** Update shop item */
  updateShopItem: async (id: string, data: UpdateShopItemDto): Promise<ShopItemDto> => {
    try {
      checkAdminAccess();
      
      // Clean up data: remove empty strings, handle base64 images
      const cleanedData: UpdateShopItemDto = {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.description && data.description.trim() ? { description: data.description.trim() } : {}),
        ...(data.price !== undefined && data.price !== null ? { price: data.price } : {}),
        ...(data.category && data.category.trim() ? { category: data.category.trim() } : {}),
        ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
        ...(data.stock !== undefined && data.stock !== null ? { stock: data.stock } : {}),
        // Only include imageUrl if it's not a base64 data URL (too large) or if it's a URL string
        ...(data.imageUrl && !data.imageUrl.startsWith('data:image/') ? { imageUrl: data.imageUrl } : {}),
      };
      
      console.log("🔍 Updating shop item with data:", cleanedData);
      
      const response = await apiService.privateApiClient.put<ShopItemDto>(`/admin/shop/items/${id}`, cleanedData);
      const result = wrapResponse(response);
      console.log("✅ Shop item updated successfully:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Error updating shop item:", error);
      console.error("❌ Error response data:", error?.response?.data);
      throw error;
    }
  },

  /** Delete shop item */
  deleteShopItem: async (id: string): Promise<void> => {
    checkAdminAccess();
    await apiService.privateApiClient.delete<void>(`/admin/shop/items/${id}`);
    // 204 No Content - no response body to unwrap
  },

  // ============ ACHIEVEMENT BULK OPERATIONS ============
  /** Award achievement to all users in the system */
  awardAchievementToAllUsers: async (achievementId: string): Promise<{ success: number; failed: number; errors: string[] }> => {
    try {
      checkAdminAccess();
      console.log(`🔍 Awarding achievement ${achievementId} to all users`);
      
      // Get all users (with pagination to get all)
      let allUsers: AdminUser[] = [];
      let page = 1;
      const pageSize = 100;
      let hasMore = true;
      
      // Use direct API call to avoid recursive call
      while (hasMore) {
        const response = await apiService.privateApiClient.get<any>(
          `/admin/users?page=${page}&pageSize=${pageSize}`
        );
        const rawData = wrapResponse(response);
        
        let users: AdminUser[] = [];
        let total = 0;
        
        if (Array.isArray(rawData)) {
          users = rawData;
          total = rawData.length;
        } else if (rawData && typeof rawData === 'object') {
          users = rawData.items || rawData.Items || rawData.data || rawData.Data || rawData.users || rawData.Users || [];
          total = rawData.total || rawData.Total || rawData.count || rawData.Count || users.length;
        }
        
        allUsers = [...allUsers, ...users];
        
        if (users.length < pageSize || allUsers.length >= total) {
          hasMore = false;
        } else {
          page++;
        }
      }
      
      console.log(`📦 Found ${allUsers.length} users to award achievement`);
      
      // Log first user to debug structure
      if (allUsers.length > 0) {
        console.log("🔍 Sample user object:", JSON.stringify(allUsers[0], null, 2));
      }
      
      // Award achievement to each user
      let success = 0;
      let failed = 0;
      const errors: string[] = [];
      
      // Helper function to get user display name
      const getUserDisplayName = (user: AdminUser): string => {
        return user.userName || user.email || user.id || 'unknown user';
      };
      
      // Helper function to delay between requests
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Helper function to award achievement - try admin endpoint first, then fallback to user claim
      const awardAchievementToUser = async (userId: string, achievementId: string, retries = 1): Promise<void> => {
        try {
          // Try using admin API client with admin endpoint (if exists)
          // First try: Use admin API client directly
          try {
            const response = await apiService.privateApiClient.post<any>(
              `/admin/achievements/${achievementId}/award-to-user/${userId}`
            );
            wrapResponse(response);
            return; // Success with admin endpoint
          } catch (adminError: any) {
            // If admin endpoint doesn't exist (404/405), fallback to user claim endpoint
            if (adminError?.response?.status === 404 || adminError?.response?.status === 405) {
              console.log(`⚠️ Admin endpoint not available, using user claim endpoint for ${userId}`);
              await privateApiService.claimAchievement(userId, achievementId);
              return; // Success with user claim endpoint
            }
            // If other error from admin endpoint, throw it
            throw adminError;
          }
        } catch (error: any) {
          // Retry on 500 errors (server errors) - but only once
          if (retries > 0 && (error?.response?.status === 500 || error?.response?.status === 503)) {
            console.log(`🔄 Retrying for user ${userId} (${retries} retries left)...`);
            await delay(1000); // Wait 1s before retry for server errors
            return awardAchievementToUser(userId, achievementId, retries - 1);
          }
          throw error;
        }
      };
      
      const totalUsers = allUsers.length;
      let processed = 0;
      
      for (const user of allUsers) {
        processed++;
        const userDisplayName = getUserDisplayName(user);
        
        try {
          // Get user ID - try multiple possible fields
          const userId = user.id || (user as any).userId || (user as any).user_id || (user as any).Id || (user as any).ID;
          
          if (!userId) {
            console.warn(`⚠️ User ${userDisplayName} has no ID field. User object:`, user);
            failed++;
            errors.push(`${userDisplayName}: Missing user ID`);
            continue;
          }
          
          // Skip admin and teacher users
          const userRoles = user.roles || [];
          if (userRoles.some((r: string) => r.toLowerCase() === 'admin' || r.toLowerCase() === 'teacher')) {
            console.log(`⏭️ Skipping ${userDisplayName} (admin/teacher) [${processed}/${totalUsers}]`);
            continue;
          }
          
          // Award with retry logic
          await awardAchievementToUser(userId, achievementId);
          success++;
          console.log(`✅ Awarded to ${userDisplayName} (ID: ${userId}) [${processed}/${totalUsers}]`);
          
          // Add delay between requests to avoid overwhelming the server
          if (processed < totalUsers) {
            await delay(200); // 200ms delay between requests
          }
        } catch (error: any) {
          failed++;
          const statusCode = error?.response?.status;
          let errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
          
          // Provide more helpful error messages
          if (statusCode === 500) {
            errorMsg = "Backend server error (500) - có thể backend không hỗ trợ award achievement cho user khác";
          } else if (statusCode === 403) {
            errorMsg = "Forbidden (403) - không có quyền award achievement cho user này";
          } else if (statusCode === 401) {
            errorMsg = "Unauthorized (401) - cần đăng nhập lại";
          } else if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
            errorMsg = "Network error - không thể kết nối đến server";
          }
          
          const statusText = statusCode ? ` (${statusCode})` : '';
          const fullErrorMsg = `${errorMsg}${statusText}`;
          
          errors.push(`${userDisplayName}: ${fullErrorMsg}`);
          console.error(`❌ Failed to award to ${userDisplayName} [${processed}/${totalUsers}]:`, fullErrorMsg);
          
          // Add delay even on error to avoid rapid failures
          if (processed < totalUsers) {
            await delay(100); // Shorter delay on error
          }
        }
      }
      
      console.log(`✅ Awarded achievement to ${success} users, ${failed} failed`);
      
      // If all failed with 500 errors, provide helpful message
      if (success === 0 && failed > 0) {
        const all500Errors = errors.filter(e => e.includes('500') || e.includes('Backend server error'));
        if (all500Errors.length === failed) {
          console.warn("⚠️ Tất cả requests đều bị lỗi 500. Có thể backend không hỗ trợ tính năng award achievement cho user khác.");
          console.warn("⚠️ Vui lòng kiểm tra backend logs hoặc liên hệ backend team để thêm admin endpoint.");
        }
      }
      
      return { success, failed, errors };
    } catch (error: any) {
      console.error("❌ Error awarding achievement to all users:", error);
      throw error;
    }
  },
};

export default adminApiService;

