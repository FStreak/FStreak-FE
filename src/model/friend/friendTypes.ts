/** Friend System Types */

export enum FriendStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum FriendRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  status: FriendStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface FriendRequest {
  id: number;
  senderId: string;
  receiverId: string;
  sender?: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  receiver?: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SendFriendRequestDTO {
  receiverId: string;
}

export interface RespondFriendRequestDTO {
  requestId: number;
  accept: boolean;
}

export interface FriendStatusResponse {
  friendshipId?: number;
  requestId?: number;
  status: "none" | "friends" | "pending_sent" | "pending_received";
  isFriend: boolean;
  hasPendingRequest: boolean;
}

