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
import type { StreakDetail, StreakLeaderboardResponse } from "@/model/streak/streakTypes";

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
  // ============ REMINDERS APIs ============
  /** Get all reminders for current user */
  getReminders: async (): Promise<ReminderEntry[]> => {
    try {
      const response = await apiService.privateApiClient.get<ReminderEntry[]>("/reminders");
      return wrapResponse(response);
    } catch (err: unknown) {
      // If it's a network error (no response), return empty list so UI can continue.
      const maybeAxios = err as { response?: unknown };
      if (!maybeAxios.response) {
        console.warn("Network error fetching reminders:", err);
        return [];
      }
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
    const response = await apiService.privateApiClient.get<StreakDetail>("/streaks/me");
    return wrapResponse(response);
  },
  /** Get leaderboard by period (e.g. 7 or 30 days) */
  getStreakLeaderboard: async (period: number): Promise<StreakLeaderboardResponse> => {
    const response = await apiService.privateApiClient.get<StreakLeaderboardResponse>(`/streaks/leaderboard?period=${period}`);
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
};

export default privateApiService;
