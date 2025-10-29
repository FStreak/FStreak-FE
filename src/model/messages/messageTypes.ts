// Messaging system types

export enum MessageStatus {
  SENT = 0,
  DELIVERED = 1,
  READ = 2,
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  receiverId: string;
  content: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserUsername: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface SendMessageDto {
  receiverId: string;
  content: string;
}

export interface GetMessagesDto {
  conversationId: string;
  page?: number;
  pageSize?: number;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export interface MarkAsReadDto {
  conversationId: string;
  messageIds?: string[];
}

