import { apiService } from "./apiService";
import { wrapResponse } from "./ApiServiceConfig";
import type { ApiResponse } from "../model/apiType/apiType";
import type {
  StudyRoomDto,
  CreateRoomDto,
  JoinRoomResponse,
  RoomUserDto,
  AgoraTokenResponse,
} from "../model/studyRoom/studyRoomTypes";

export const privateApiService = {
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
