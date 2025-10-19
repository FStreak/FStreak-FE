// Study Room Types
export interface StudyRoomDto {
  studyRoomId: number;
  name: string;
  description: string;
  isPrivate: boolean;
  inviteCode: string | null;
  isActive: boolean;
  meetingLink: string | null;
  startTime: string;
  endTime: string;
  createdById: string;
  createdBy: UserDto;
  roomUsers: RoomUserDto[];
}

export interface CreateRoomDto {
  name: string;
  description: string;
  isPrivate: boolean;
  startTime: string;
  endTime: string;
}

export interface RoomUserDto {
  roomUserId: number;
  userId: string;
  userName: string;
  joinedAt: string;
  isOnline: boolean;
}

export interface UserDto {
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  currentStreak: number;
  longestStreak: number;
}

// Agora Token Types
export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: string;
  expiration: string;
}

// Join Room Response
export interface JoinRoomResponse {
  roomUser: RoomUserDto;
  agoraTokens: AgoraTokenResponse | null;
}

// Join Room by Invite Code Response
export interface JoinRoomByCodeResponse {
  roomUser: RoomUserDto;
  agoraTokens: AgoraTokenResponse | null;
}

// Room Message Types
export interface RoomMessageDto {
  messageId: number;
  roomId: number;
  userId: string;
  userName: string;
  content: string;
  messageType: MessageType;
  sentAt: string;
}

export enum MessageType {
  Text = 0,
  System = 1,
  Image = 2,
  File = 3
}

// SignalR Event Types
export interface MediaStatusUpdate {
  userId: string;
  userName: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  timestamp: string;
}

export interface ScreenSharingStatusUpdate {
  userId: string;
  userName: string;
  isSharing: boolean;
  timestamp: string;
}

export interface UserStatusUpdate {
  userId: string;
  userName: string;
  status: 'joined-video' | 'left-video' | 'raised-hand' | 'lowered-hand' | 'away' | 'back';
  metadata?: string;
  timestamp: string;
}

// Participant Type (for UI)
export interface Participant {
  userId: string;
  userName: string;
  isInVideoCall: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  handRaised: boolean;
  status: 'active' | 'away';
  joinedAt: string;
}
