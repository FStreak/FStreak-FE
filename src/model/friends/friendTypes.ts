// Friend system types

export enum FriendshipStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
  BLOCKED = 3,
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  receiverId: string;
  receiverName: string;
  receiverUsername: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendUsername: string;
  friendStreak: number;
  friendshipDate: string;
  isOnline?: boolean;
}

export interface SendFriendRequestDto {
  receiverId: string;
}

export interface RespondFriendRequestDto {
  requestId: string;
  accept: boolean; // true = accept, false = reject
}

export interface FriendListResponse {
  friends: Friend[];
  total: number;
}

export interface FriendRequestsResponse {
  sent: FriendRequest[];
  received: FriendRequest[];
  total: number;
}

