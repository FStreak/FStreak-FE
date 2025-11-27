import { apiService } from "./apiService";
import { wrapResponse } from "./ApiServiceConfig";
import type {
  StudyRoomDto,
  CreateRoomDto,
  JoinRoomResponse,
  RoomUserDto,
  AgoraTokenResponse,
} from "../model/studyRoom/studyRoomTypes";
import type { UserProfile } from "../model/authModel/authDataType";
import type { ReminderEntry } from "../model/reminder/reminderTypes";
import type { StreakDetail, StreakLeaderboardResponse, CheckInRequest  } from "@/model/streak/streakTypes";
import type { LogoutRequest, LogoutResponse } from "@/model/authModel/authDataType";
import type { Lesson, LessonFormData } from "@/model/lesson/lessonTypes";
import type { 
  Friend, 
  FriendRequest, 
  SendFriendRequestDto, 
  RespondFriendRequestDto, 
  FriendListResponse, 
  FriendRequestsResponse 
} from "@/model/friends/friendTypes";
import type { 
  Message, 
  Conversation, 
  SendMessageDto, 
  GetMessagesDto, 
  ConversationsResponse, 
  MessagesResponse, 
  MarkAsReadDto 
} from "@/model/messages/messageTypes";
import type { UserAchievementDto } from "@/model/achievement/userAchievementTypes";

export const privateApiService = {
  // ============ USER APIs ============
  /** Get current user profile */
  getMyProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiService.privateApiClient.get<UserProfile>("/users/me");
      return wrapResponse(response);
    } catch (err: unknown) {
      // If the endpoint doesn't exist on the server (404), try a couple of common alternatives
      // to be tolerant against backend route differences.
      // If still failing, rethrow the original error.
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 404) {
        try {
          const alt = await apiService.privateApiClient.get<UserProfile>("/auth/me");
          return wrapResponse(alt);
        } catch {
          const alt2 = await apiService.privateApiClient.get<UserProfile>("/users");
          return wrapResponse(alt2);
        }
      }

      throw err;
    }
  },

  /** Get all users (for search functionality) */
  getAllUsers: async (): Promise<UserProfile[]> => {
    const response = await apiService.privateApiClient.get<UserProfile[]>(`/users`);
    return wrapResponse(response);
  },

  /** Get user by ID */
  getUserById: async (userId: string): Promise<UserProfile> => {
    try {
      // Try direct endpoint first
      const response = await apiService.privateApiClient.get<UserProfile>(`/users/${userId}`);
      return wrapResponse(response);
    } catch (error: any) {
      // If 404, try getting from all users
      if (error.response?.status === 404) {
        const allUsers = await privateApiService.getAllUsers();
        const user = allUsers.find(u => u.id === userId);
        if (user) {
          return user;
        }
        throw new Error("User not found");
      }
      throw error;
    }
  },
  // ============ ACHIEVEMENTS APIs ============
  /** Get user achievements */
  getUserAchievements: async (userId?: string): Promise<UserAchievementDto[]> => {
    try {
      // Use /me endpoint for current user, or /users/{userId} for specific user
      const url = userId 
        ? `/Achievements/users/${userId}`
        : `/Achievements/me`;
      console.log("🔍 Fetching achievements from:", url);
      const response = await apiService.privateApiClient.get<UserAchievementDto[]>(url);
      const data = wrapResponse(response);
      console.log("✅ Achievements API response:", data);
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error("❌ Error fetching achievements:", error);
      console.error("❌ Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        url: error?.config?.url
      });
      
      // If endpoint doesn't exist, return empty array
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        console.warn("⚠️ Achievements endpoint not available (404/405), returning empty array");
        return [];
      }
      
      // For other errors, still return empty array to prevent UI crash
      console.warn("⚠️ Error fetching achievements, returning empty array");
      return [];
    }
  },

  /** Get all available achievements (public) */
  getAllAchievements: async (): Promise<any[]> => {
    try {
      const response = await apiService.privateApiClient.get<any[]>(`/Achievements`);
      return wrapResponse(response);
    } catch (error: any) {
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        console.warn("⚠️ Get all achievements endpoint not available");
        return [];
      }
      throw error;
    }
  },

  /** Get achievement by ID */
  getAchievementById: async (id: string): Promise<any> => {
    const response = await apiService.privateApiClient.get<any>(`/Achievements/${id}`);
    return wrapResponse(response);
  },

  /** Get user achievement by userId and achievementId */
  getUserAchievementById: async (userId: string, achievementId: string): Promise<UserAchievementDto> => {
    const response = await apiService.privateApiClient.get<UserAchievementDto>(
      `/Achievements/users/${userId}/achievements/${achievementId}`
    );
    return wrapResponse(response);
  },

  /** Claim achievement for user */
  claimAchievement: async (userId: string, achievementId: string): Promise<UserAchievementDto> => {
    // According to OpenAPI spec: POST /api/Achievements/users/{userId}/achievements/{achievementId}/claim
    // Backend will automatically create user achievement if needed (based on criteriaJson)
    
    try {
      // First, check if user achievement already exists and is claimed
      try {
        const existing = await apiService.privateApiClient.get<UserAchievementDto>(
          `/Achievements/users/${userId}/achievements/${achievementId}`
        );
        const userAchievement = wrapResponse(existing);
        
        // If it exists and is already claimed, return it
        if (userAchievement.isClaimed) {
          console.log(`✅ Achievement already claimed`);
          return userAchievement;
        }
        
        // If it exists but not claimed, continue to claim it
        console.log(`🔍 User achievement exists but not claimed, attempting to claim...`);
      } catch (checkError: any) {
        // 404 means user achievement doesn't exist yet
        // Backend should automatically create it when claim is called (based on criteriaJson)
        if (checkError?.response?.status === 404) {
          console.log(`ℹ️ User achievement doesn't exist yet (404). Backend will create it when claiming.`);
        } else {
          console.warn(`⚠️ Error checking user achievement:`, checkError?.response?.status);
          // Continue to claim anyway - backend might still handle it
        }
      }
      
      // Call the claim endpoint - backend will create user achievement if needed
      const endpoint = `/Achievements/users/${userId}/achievements/${achievementId}/claim`;
      console.log(`🎯 Claiming achievement: POST ${endpoint}`);
      const response = await apiService.privateApiClient.post<UserAchievementDto>(endpoint);
      const result = wrapResponse(response);
      console.log(`✅ Successfully claimed achievement:`, result);
      return result;
    } catch (error: any) {
      console.error(`❌ Error claiming achievement:`, error);
      console.error(`❌ Error details:`, {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message
      });
      
      // Re-throw error so caller can handle it
      throw error;
    }
  },

  // ============ REMINDERS APIs ============
  /** Get all reminders for current user */
  getReminders: async (): Promise<ReminderEntry[]> => {
    try {
      // Try with capital R first (matching API spec)
      const response = await apiService.privateApiClient.get<ReminderEntry[]>("/Reminders");
      return wrapResponse(response);
    } catch (err: unknown) {
      // If it's a network error (CORS, no response), return empty list so UI can continue.
      const maybeAxios = err as { response?: { status?: number } };
      if (!maybeAxios.response || maybeAxios.response.status === 0) {
        console.warn("⚠️ Network/CORS error fetching reminders (ignored):", err);
        return [];
      }
      // If 404/405, endpoint doesn't exist
      if (maybeAxios.response?.status === 404 || maybeAxios.response?.status === 405) {
        console.warn("⚠️ GET /Reminders endpoint not available (404/405), returning empty array");
        return [];
      }
      // For other errors, rethrow
      throw err;
    }
  },

  /** Get a single reminder by id */
  getReminder: async (id: string): Promise<ReminderEntry> => {
    const response = await apiService.privateApiClient.get<ReminderEntry>(`/reminders/${id}`);
    return wrapResponse(response);
  },

  /** Create a reminder */
  createReminder: async (payload: Partial<ReminderEntry>): Promise<ReminderEntry> => {
    const response = await apiService.privateApiClient.post<ReminderEntry>(`/reminders`, payload);
    return wrapResponse(response);
  },

  /** Update a reminder */
  updateReminder: async (id: string, payload: Partial<ReminderEntry>): Promise<ReminderEntry> => {
    const response = await apiService.privateApiClient.put<ReminderEntry>(`/reminders/${id}`, payload);
    return wrapResponse(response);
  },

  /** Delete a reminder */
  deleteReminder: async (id: string): Promise<void> => {
    const response = await apiService.privateApiClient.delete<void>(`/reminders/${id}`);
    return wrapResponse(response);
  },
  // ============ STREAK APIs ============
  /** Get my streak detail */
  getMyStreak: async (): Promise<StreakDetail> => {
    try {
      const response = await apiService.privateApiClient.get<StreakDetail>("/Streaks/me");
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error fetching streak:", error);
      throw error;
    }
  },


  /** Check in (đánh dấu học hôm nay) */
  checkInStreak: async (body: CheckInRequest): Promise<StreakDetail> => {
    try {
      const response = await apiService.privateApiClient.post<StreakDetail>(
        "/Streaks/check-in",
        body
      );
      return wrapResponse(response);
    } catch (error: any) {
      console.error("❌ Error checking in streak:", error);
      console.error("❌ Error response:", error?.response);
      console.error("❌ Error response data:", error?.response?.data);
      throw error;
    }
  },


  /** Get streak leaderboard with filters
   * @param scope - 0: Global, 1: Group (school/club)
   * @param period - 0: AllTime, 1: Weekly
   * @param groupId - Optional group ID for scope=1
   */
  getStreakLeaderboard: async (
    scope: 0 | 1 = 0, 
    period: 0 | 1 = 0, 
    groupId?: number
  ): Promise<StreakLeaderboardResponse> => {
    let url = `/Streaks/leaderboard?scope=${scope}&period=${period}`;
    if (groupId !== undefined) {
      url += `&groupId=${groupId}`;
    }
    const response = await apiService.privateApiClient.get<StreakLeaderboardResponse>(url);
    return wrapResponse(response);
  },
  // ============ STUDY ROOM APIs ============
  
  /**
   * Create a new study room
   */
  createRoom: async (roomData: CreateRoomDto): Promise<StudyRoomDto> => {
    const response = await apiService.privateApiClient.post<StudyRoomDto>("/studyrooms", roomData);
    return wrapResponse(response);
  },

  /**
   * Get room details by ID (includes participants)
   */
  getRoomById: async (roomId: number): Promise<StudyRoomDto> => {
    const response = await apiService.privateApiClient.get<StudyRoomDto>(`/studyrooms/${roomId}`);
    return wrapResponse(response);
  },

  /**
   * Get room details by invite code (includes participants)
   */
  getRoomByCode: async (roomCode: string): Promise<StudyRoomDto> => {
    const response = await apiService.privateApiClient.get<StudyRoomDto>(`/studyrooms/code/${roomCode}`);
    return wrapResponse(response);
  },

  /**
   * Get all active rooms
   */
  getActiveRooms: async (): Promise<StudyRoomDto[]> => {
    const response = await apiService.privateApiClient.get<StudyRoomDto[]>("/studyrooms/active");
    return wrapResponse(response);
  },

  /**
   * Join a room by ID
   * @param roomId - The room ID to join
   * @param includeTokens - If true, returns Agora tokens for video call. If false, only joins chat.
   */
  joinRoom: async (
    roomId: number,
    includeTokens: boolean = true
  ): Promise<JoinRoomResponse> => {
    const response = await apiService.privateApiClient.post<JoinRoomResponse>(
      `/studyrooms/${roomId}/join?includeTokens=${includeTokens}`
    );
    return wrapResponse(response);
  },

  /**
   * Join a room by invite code
   * @param roomCode - The room invite code
   * @param includeTokens - If true, returns Agora tokens for video call. If false, only joins chat.
   */
  joinRoomByCode: async (
    roomCode: string,
    includeTokens: boolean = true
  ): Promise<JoinRoomResponse> => {
    const response = await apiService.privateApiClient.post<JoinRoomResponse>(
      `/studyrooms/join/code/${roomCode}?includeTokens=${includeTokens}`
    );
    return wrapResponse(response);
  },

  /**
   * Leave a room
   */
  leaveRoom: async (roomId: number): Promise<RoomUserDto> => {
    const response = await apiService.privateApiClient.post<RoomUserDto>(`/studyrooms/${roomId}/leave`);
    return wrapResponse(response);
  },

  /**
   * End a room (only host can do this)
   */
  endRoom: async (roomId: number): Promise<boolean> => {
    const response = await apiService.privateApiClient.post<boolean>(`/studyrooms/${roomId}/end`);
    return wrapResponse(response);
  },

  /**
   * Refresh Agora tokens (for when tokens expire after ~1 hour)
   */
  refreshAgoraTokens: async (roomId: number): Promise<AgoraTokenResponse> => {
    const response = await apiService.privateApiClient.post<AgoraTokenResponse>(`/studyrooms/${roomId}/refresh-tokens`);
    return wrapResponse(response);
  },

  logout: async (logoutInfo: LogoutRequest): Promise<LogoutResponse> => {
    const response = await apiService.privateApiClient.post<LogoutResponse>(
      "/auth/logout",
      logoutInfo
    );
    return wrapResponse(response);
  },

  // ============ LESSONS APIs ============
  /** Get all published lessons (for students/users) */
  /** 
   * Strategy:
   * 1. Try GET /Lessons first (if backend supports it)
   * 2. If 405/404, fallback to aggregating from all teachers
   */
  getAllLessons: async (): Promise<Lesson[]> => {
    try {
      // Try direct endpoint first
      const response = await apiService.privateApiClient.get<Lesson[]>("/Lessons");
      return wrapResponse(response);
    } catch (error: any) {
      // If 405 Method Not Allowed or 404, endpoint doesn't exist
      if (error?.response?.status === 405 || error?.response?.status === 404) {
        console.warn("⚠️ GET /Lessons endpoint not available (405/404), trying fallback: aggregate from all teachers");
        
        try {
          // Fallback: Get all users, filter teachers, then get lessons from each teacher
          console.log("🔄 Starting fallback: fetching all users...");
          const allUsers = await privateApiService.getAllUsers();
          console.log(`👥 Total users fetched: ${allUsers.length}`);
          
          // Debug: Log first few users to see structure
          if (allUsers.length > 0) {
            console.log("🔍 Sample user object:", allUsers[0]);
            console.log("🔍 User roles field:", allUsers[0].roles);
            console.log("🔍 User object keys:", Object.keys(allUsers[0]));
          }
          
          // Filter users with Teacher role
          // Check multiple possible role field names and formats
          const teachers = allUsers.filter(user => {
            // Try different possible role field names
            const roles = 
              user.roles || 
              (user as any).Roles || 
              (user as any).role || 
              (user as any).Role || 
              [];
            
            // Handle both array and string formats
            let roleArray: string[] = [];
            if (Array.isArray(roles)) {
              roleArray = roles;
            } else if (typeof roles === 'string') {
              roleArray = [roles];
            }
            
            // Check for teacher role (case-insensitive)
            const hasTeacherRole = roleArray.some((role: string) => {
              const normalizedRole = String(role).toLowerCase().trim();
              return normalizedRole === 'teacher' || normalizedRole === 'teachers';
            });
            
            if (hasTeacherRole) {
              console.log(`👨‍🏫 Found teacher: ${user.userName} (ID: ${user.id}), roles:`, roleArray);
            }
            
            return hasTeacherRole;
          });
          
          console.log(`📚 Found ${teachers.length} teachers from roles, fetching lessons...`);
          
          // Always try to get lessons from all users as fallback
          // This ensures we get lessons even if roles are not properly set
          let allLessonsFromUsers: Lesson[] = [];
          
          if (teachers.length === 0) {
            console.warn("⚠️ No teachers found from users list (roles might not be in user object)!");
            console.warn("💡 Trying alternative: try to get lessons from all users (brute force approach)...");
          } else {
            console.log("✅ Found teachers from roles, but also trying all users to ensure we get all lessons...");
          }
          
          // Always try to get lessons from all users as fallback
          // This ensures we get lessons even if roles are not properly set
          try {
            console.log(`🔄 Trying to fetch lessons from all ${allUsers.length} users...`);
            
            const lessonPromises = allUsers.map(async (user, index) => {
              try {
                const userId = user.id || (user as any).userId || (user as any).Id;
                if (!userId) {
                  return [];
                }
                
                // Try to get lessons for this user (might fail if not a teacher)
                const lessons = await privateApiService.getLessonsByTeacher(userId);
                if (lessons && lessons.length > 0) {
                  console.log(`✅ Found ${lessons.length} lessons from user ${user.userName} (${userId}) [${index + 1}/${allUsers.length}]`);
                }
                return lessons || [];
              } catch (err: any) {
                // Silently ignore errors (user might not be a teacher)
                // Only log if it's not a 404/400 (expected for non-teachers)
                if (err?.response?.status !== 404 && err?.response?.status !== 400) {
                  console.warn(`⚠️ Unexpected error fetching lessons for user ${user.userName}:`, err?.response?.status);
                }
                return [];
              }
            });
            
            const allLessonsArrays = await Promise.all(lessonPromises);
            allLessonsFromUsers = allLessonsArrays.flat();
            
            console.log(`📚 Total lessons found from all users: ${allLessonsFromUsers.length}`);
          } catch (fallbackErr) {
            console.error("❌ Error fetching lessons from all users:", fallbackErr);
          }
          
          // Combine lessons from identified teachers and all users
          let allLessons: Lesson[] = [];
          
          if (teachers.length > 0) {
            // Get lessons from identified teachers
            const lessonPromises = teachers.map(async (teacher) => {
              try {
                const teacherId = teacher.id || (teacher as any).userId || (teacher as any).Id;
                if (!teacherId) {
                  console.warn(`⚠️ Teacher ${teacher.userName} has no ID, skipping`);
                  return [];
                }
                console.log(`📖 Fetching lessons for teacher ${teacher.userName} (${teacherId})...`);
                const lessons = await privateApiService.getLessonsByTeacher(teacherId);
                console.log(`✅ Got ${lessons?.length || 0} lessons from ${teacher.userName}`, lessons);
                return lessons || [];
              } catch (err) {
                console.error(`❌ Failed to fetch lessons for teacher ${teacher.userName}:`, err);
                return [];
              }
            });
            
            const teacherLessonsArrays = await Promise.all(lessonPromises);
            const teacherLessons = teacherLessonsArrays.flat();
            allLessons = [...teacherLessons, ...allLessonsFromUsers];
          } else {
            // Use lessons from all users if no teachers identified
            allLessons = [...allLessonsFromUsers];
          }
          
          if (allLessons.length === 0) {
            console.warn("⚠️ No lessons found from any source");
            return [];
          }
          
          // Remove duplicates
          const uniqueLessons = Array.from(
            new Map(allLessons.map(lesson => [lesson.id, lesson])).values()
          );
          
          console.log(`✅ Aggregated ${uniqueLessons.length} unique lessons (${teachers.length} teachers identified, ${allLessonsFromUsers.length} from all users)`);
          return uniqueLessons;
        } catch (fallbackError) {
          console.error("❌ Fallback also failed:", fallbackError);
          console.warn("💡 Backend may need to add GET /api/Lessons endpoint for published lessons");
          return [];
        }
      }
      // For other errors, rethrow
      console.error("❌ Error fetching all lessons:", error);
      throw error;
    }
  },

  /** Get all lessons for a specific teacher */
  getLessonsByTeacher: async (teacherId: string): Promise<Lesson[]> => {
    const response = await apiService.privateApiClient.get<Lesson[]>(`/Lessons/teacher/${teacherId}`);
    return wrapResponse(response);
  },

  /** Get a single lesson by ID */
  getLessonById: async (lessonId: string): Promise<Lesson> => {
    const response = await apiService.privateApiClient.get<Lesson>(`/Lessons/${lessonId}`);
    return wrapResponse(response);
  },

  /** Create a new lesson */
  createLesson: async (formData: LessonFormData): Promise<Lesson> => {
    try {
      const form = new FormData();
      form.append("Title", formData.title);
      if (formData.description) form.append("Description", formData.description);
      if (formData.category) form.append("Category", formData.category);
      if (formData.startAt) form.append("StartAt", formData.startAt);
      if (formData.durationMinutes) form.append("DurationMinutes", formData.durationMinutes.toString());
      form.append("IsPublished", formData.isPublished.toString());
      if (formData.documentFile) form.append("DocumentFile", formData.documentFile);
      if (formData.videoFile) form.append("VideoFile", formData.videoFile);

      const response = await apiService.privateApiClient.post<Lesson>("/Lessons", form, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
      return wrapResponse(response);
    } catch (error: any) {
      // Log chi tiết lỗi để debug
      console.error("Create lesson error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw error;
    }
  },

  /** Update an existing lesson */
  updateLesson: async (lessonId: string, formData: LessonFormData): Promise<Lesson> => {
    try {
      const form = new FormData();
      form.append("Title", formData.title);
      if (formData.description) form.append("Description", formData.description);
      if (formData.category) form.append("Category", formData.category);
      if (formData.startAt) form.append("StartAt", formData.startAt);
      if (formData.durationMinutes) form.append("DurationMinutes", formData.durationMinutes.toString());
      form.append("IsPublished", formData.isPublished.toString());
      if (formData.documentFile) form.append("DocumentFile", formData.documentFile);
      if (formData.videoFile) form.append("VideoFile", formData.videoFile);

      const response = await apiService.privateApiClient.put<Lesson>(`/Lessons/${lessonId}`, form, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
      return wrapResponse(response);
    } catch (error: any) {
      // Log chi tiết lỗi để debug
      console.error("Update lesson error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw error;
    }
  },

  /** Delete a lesson */
  deleteLesson: async (lessonId: string): Promise<void> => {
    const response = await apiService.privateApiClient.delete<void>(`/Lessons/${lessonId}`);
    return wrapResponse(response);
  },

  // ============ FRIENDS APIs ============
  
  /** Get list of friends */
  getFriends: async (): Promise<FriendListResponse> => {
    const response = await apiService.privateApiClient.get<any>("/friends");
    const data = wrapResponse(response);
    console.log("Raw friends response:", data);
    console.log("Response type:", typeof data);
    console.log("Is array:", Array.isArray(data));
    
    // Handle both formats: array directly or object with friends property
    let friends: Friend[] = [];
    let total = 0;
    
    if (Array.isArray(data)) {
      // Backend returns array directly
      friends = data;
      total = data.length;
    } else {
      // Backend returns object with friends property
      friends = data.friends || data.Friends || data.data || [];
      total = data.total || data.Total || friends.length;
    }
    
    // Normalize each friend object to ensure properties are in camelCase
    // Backend returns: {friendshipId, userId, userName, email, avatarUrl, ...}
    // We need to fetch user profiles to get firstName and lastName
    
    // Fetch all users once (more efficient than fetching for each friend)
    let allUsers: any[] = [];
    try {
      allUsers = await privateApiService.getAllUsers();
      console.log("Fetched all users once:", allUsers.length);
      if (allUsers.length > 0) {
        console.log("Sample user from getAllUsers:", allUsers[0]);
        console.log("Sample user keys:", Object.keys(allUsers[0]));
      }
    } catch (error) {
      console.log("Could not fetch all users:", error);
    }
    
    friends = friends.map((friend: any) => {
      console.log("Raw friend object before normalize:", friend);
      console.log("All keys in friend object:", Object.keys(friend));
      
      // Backend returns: {friendshipId, userId, userName, email, avatarUrl, ...}
      const friendUserId = friend.userId || friend.UserId || friend.friendId || friend.FriendId;
      
      let firstName = null;
      let lastName = null;
      let friendName = null;
      
      // Try to get from friend object first
      firstName = friend.firstName || friend.FirstName || friend.friendFirstName || friend.FriendFirstName;
      lastName = friend.lastName || friend.LastName || friend.friendLastName || friend.FriendLastName;
      
      // If not found, try to get from allUsers cache
      if ((!firstName || !lastName) && allUsers.length > 0) {
        const userInfo = allUsers.find((u: any) => {
          const userId = u.id || u.Id || u.userId || u.UserId;
          return userId === friendUserId;
        });
        
        if (userInfo) {
          console.log("Found user info for", friendUserId, ":", userInfo);
          firstName = userInfo.firstName || userInfo.FirstName || firstName;
          lastName = userInfo.lastName || userInfo.LastName || lastName;
          console.log("Extracted - firstName:", firstName, "lastName:", lastName);
        } else {
          console.log("User not found in allUsers for friendUserId:", friendUserId);
        }
      }
      
      // Build friendName
      if (firstName && lastName) {
        friendName = `${firstName} ${lastName}`.trim();
      } else {
        friendName = friend.friendName || 
                    friend.FriendName ||
                    friend.name ||
                    friend.Name ||
                    friend.userName ||
                    friend.UserName ||
                    null;
      }
      
      console.log("Extracted firstName:", firstName, "lastName:", lastName);
      console.log("Extracted friendName:", friendName);
      
      return {
        ...friend,
        id: friend.id || friend.Id || friend.friendshipId || friend.FriendshipId || friendUserId,
        userId: friend.userId || friend.UserId,
        friendId: friendUserId, // Use userId as friendId
        friendName: friendName,
        // Keep firstName and lastName for displaying real name
        firstName: firstName,
        lastName: lastName,
        friendUsername: friend.userName || friend.UserName || friend.friendUsername || friend.FriendUsername || friend.username || friend.Username,
        friendStreak: friend.friendStreak || friend.FriendStreak || friend.streak || friend.Streak || friend.currentStreak || friend.CurrentStreak || 0,
        friendshipDate: friend.friendshipDate || friend.FriendshipDate || friend.createdAt || friend.CreatedAt,
        isOnline: friend.isOnline || friend.IsOnline
      };
    });
    
    const normalized: FriendListResponse = {
      friends,
      total
    };
    
    console.log("Normalized friends response:", normalized);
    console.log("Normalized friends count:", normalized.friends.length);
    return normalized;
  },

  /** Get friend requests (sent and received) */
  getFriendRequests: async (): Promise<FriendRequestsResponse> => {
    const response = await apiService.privateApiClient.get<any>("/friends/requests");
    const data = wrapResponse(response);
    console.log("Raw friend requests response:", data);
    console.log("Response type:", typeof data);
    console.log("Is array:", Array.isArray(data));
    console.log("Response keys:", Object.keys(data || {}));
    
    // Normalize response format - handle both camelCase and PascalCase
    let received = data.received || data.Received || data.receivedRequests || data.ReceivedRequests || [];
    let sent = data.sent || data.Sent || data.sentRequests || data.SentRequests || [];
    
    // Normalize each request object to ensure id is in camelCase
    received = received.map((req: any) => ({
      ...req,
      id: req.id || req.Id || req.requestId || req.RequestId,
      senderId: req.senderId || req.SenderId,
      senderName: req.senderName || req.SenderName,
      senderUsername: req.senderUsername || req.SenderUsername,
      receiverId: req.receiverId || req.ReceiverId,
      receiverName: req.receiverName || req.ReceiverName,
      receiverUsername: req.receiverUsername || req.ReceiverUsername,
      status: req.status || req.Status,
      createdAt: req.createdAt || req.CreatedAt,
      updatedAt: req.updatedAt || req.UpdatedAt
    }));
    
    sent = sent.map((req: any) => ({
      ...req,
      id: req.id || req.Id || req.requestId || req.RequestId,
      senderId: req.senderId || req.SenderId,
      senderName: req.senderName || req.SenderName,
      senderUsername: req.senderUsername || req.SenderUsername,
      receiverId: req.receiverId || req.ReceiverId,
      receiverName: req.receiverName || req.ReceiverName,
      receiverUsername: req.receiverUsername || req.ReceiverUsername,
      status: req.status || req.Status,
      createdAt: req.createdAt || req.CreatedAt,
      updatedAt: req.updatedAt || req.UpdatedAt
    }));
    
    const normalized: FriendRequestsResponse = {
      received,
      sent,
      total: data.total || data.Total || 0
    };
    
    console.log("Normalized response:", normalized);
    console.log("Sample received request:", received[0]);
    console.log("Sample sent request:", sent[0]);
    return normalized;
  },

  /** Send friend request */
  sendFriendRequest: async (data: SendFriendRequestDto): Promise<FriendRequest> => {
    // Try camelCase first (most .NET APIs use camelCase by default with System.Text.Json)
    let requestBody = {
      receiverId: data.receiverId
    };
    console.log("Sending friend request with camelCase:", requestBody);
    
    try {
      const response = await apiService.privateApiClient.post<FriendRequest>("/friends/request", requestBody);
      console.log("Friend request response:", response.data);
      return wrapResponse(response);
    } catch (error: any) {
      // Handle 400 Bad Request - might be duplicate request
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.title || "";
        console.log("400 error received:", errorMessage);
        
        // If it's a duplicate request, try to get existing request from backend
        if (errorMessage.toLowerCase().includes("already") || 
            errorMessage.toLowerCase().includes("duplicate") ||
            errorMessage.toLowerCase().includes("exists")) {
          console.log("Duplicate request detected, fetching existing requests...");
          // Fetch friend requests to get the existing one
          const requestsResponse = await privateApiService.getFriendRequests();
          const existingRequest = requestsResponse.sent?.find(
            (req) => req.receiverId === data.receiverId && req.status === 0 // PENDING
          );
          if (existingRequest) {
            console.log("Found existing request:", existingRequest);
            return existingRequest;
          }
        }
        
        // If camelCase fails with 400, try PascalCase as fallback
        console.log("Trying PascalCase...");
        requestBody = {
          ReceiverId: data.receiverId
        } as any;
        try {
          const response = await apiService.privateApiClient.post<FriendRequest>("/friends/request", requestBody);
          console.log("Friend request response (PascalCase):", response.data);
          return wrapResponse(response);
        } catch (pascalError: any) {
          // If PascalCase also fails, check if it's duplicate
          if (pascalError.response?.status === 400) {
            const requestsResponse = await privateApiService.getFriendRequests();
            const existingRequest = requestsResponse.sent?.find(
              (req) => req.receiverId === data.receiverId && req.status === 0
            );
            if (existingRequest) {
              return existingRequest;
            }
          }
          throw pascalError;
        }
      }
      throw error;
    }
  },

  /** Accept or reject friend request */
  respondToFriendRequest: async (data: RespondFriendRequestDto): Promise<FriendRequest> => {
    // Try camelCase first
    let requestBody = {
      requestId: data.requestId,
      accept: data.accept
    };
    console.log("Responding to friend request with camelCase:", requestBody);
    
    try {
      const response = await apiService.privateApiClient.post<FriendRequest>("/friends/respond", requestBody);
      console.log("Friend request response:", response.data);
      return wrapResponse(response);
    } catch (error: any) {
      // If camelCase fails with 400/422, try PascalCase
      if (error.response?.status === 400 || error.response?.status === 422) {
        console.log("camelCase failed, trying PascalCase...");
        requestBody = {
          RequestId: data.requestId,
          Accept: data.accept
        } as any;
        const response = await apiService.privateApiClient.post<FriendRequest>("/friends/respond", requestBody);
        console.log("Friend request response (PascalCase):", response.data);
        return wrapResponse(response);
      }
      throw error;
    }
  },

  /** Unfriend a user */
  unfriend: async (friendId: string): Promise<void> => {
    const response = await apiService.privateApiClient.delete<void>(`/friends/${friendId}`);
    return wrapResponse(response);
  },

  /** Cancel friend request */
  cancelFriendRequest: async (requestId: string): Promise<void> => {
    const response = await apiService.privateApiClient.delete<void>(`/friends/request/${requestId}`);
    return wrapResponse(response);
  },

  // ============ MESSAGING APIs ============
  
  /** Get all conversations */
  getConversations: async (): Promise<ConversationsResponse> => {
    const response = await apiService.privateApiClient.get<ConversationsResponse>("/messages/conversations");
    return wrapResponse(response);
  },

  /** Get messages in a conversation */
  getMessages: async (params: GetMessagesDto): Promise<MessagesResponse> => {
    const { conversationId, page = 1, pageSize = 50 } = params;
    const response = await apiService.privateApiClient.get<MessagesResponse>(
      `/messages/conversation/${conversationId}?page=${page}&pageSize=${pageSize}`
    );
    return wrapResponse(response);
  },

  /** Send a message */
  sendMessage: async (data: SendMessageDto): Promise<Message> => {
    const response = await apiService.privateApiClient.post<Message>("/messages/send", data);
    return wrapResponse(response);
  },

  /** Mark messages as read */
  markMessagesAsRead: async (data: MarkAsReadDto): Promise<void> => {
    const response = await apiService.privateApiClient.post<void>("/messages/mark-read", data);
    return wrapResponse(response);
  },

  /** Delete a message */
  deleteMessage: async (messageId: string): Promise<void> => {
    const response = await apiService.privateApiClient.delete<void>(`/messages/${messageId}`);
    return wrapResponse(response);
  },

  /** Get unread message count */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiService.privateApiClient.get<{ count: number }>("/messages/unread-count");
    const data = wrapResponse(response);
    return data.count;
  },
};

export default privateApiService;
