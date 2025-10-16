import * as signalR from "@microsoft/signalr";
import type {
  RoomUserDto,
  RoomMessageDto,
  MediaStatusUpdate,
  ScreenSharingStatusUpdate,
  UserStatusUpdate,
} from "../model/studyRoom/studyRoomTypes";

export type SignalREventHandlers = {
  onUserJoined?: (user: RoomUserDto) => void;
  onUserLeft?: (user: RoomUserDto) => void;
  onMessageReceived?: (message: RoomMessageDto) => void;
  onMediaStatusUpdated?: (update: MediaStatusUpdate) => void;
  onScreenSharingStatusUpdated?: (update: ScreenSharingStatusUpdate) => void;
  onUserStatusUpdated?: (update: UserStatusUpdate) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
};

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private handlers: SignalREventHandlers = {};
  private currentRoomId: number | null = null;

  /**
   * Initialize SignalR connection
   */
  async connect(accessToken: string, apiUrl: string = process.env.NEXT_PUBLIC_API_URL || ""): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log("SignalR already connected");
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/studyroom`, {
        accessTokenFactory: () => accessToken,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 0s, 2s, 10s, 30s, then every 30s
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return 30000;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventListeners();

    try {
      await this.connection.start();
      console.log("✅ SignalR Connected");
      this.handlers.onConnected?.();
    } catch (error) {
      console.error("❌ SignalR Connection Error:", error);
      this.handlers.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Setup all SignalR event listeners
   */
  private setupEventListeners(): void {
    if (!this.connection) return;

    // User events
    this.connection.on("UserJoined", (user: RoomUserDto) => {
      console.log("👋 User joined:", user.userName);
      this.handlers.onUserJoined?.(user);
    });

    this.connection.on("UserLeft", (user: RoomUserDto) => {
      console.log("👋 User left:", user.userName);
      this.handlers.onUserLeft?.(user);
    });

    // Message events - Match backend events exactly
    this.connection.on("NewMessage", (message: RoomMessageDto) => {
      console.log("💬 NewMessage received:", message);
      this.handlers.onMessageReceived?.(message);
    });

    this.connection.on("NewEmoji", (message: RoomMessageDto) => {
      console.log("😊 NewEmoji received:", message);
      this.handlers.onMessageReceived?.(message);
    });

    // Video call events - Match backend events exactly
    this.connection.on("MediaStatusUpdated", (update: MediaStatusUpdate) => {
      console.log("🎥 MediaStatusUpdated:", update);
      this.handlers.onMediaStatusUpdated?.(update);
    });

    this.connection.on("ScreenSharingStatusUpdated", (update: ScreenSharingStatusUpdate) => {
      console.log("🖥️ ScreenSharingStatusUpdated:", update);
      this.handlers.onScreenSharingStatusUpdated?.(update);
    });

    this.connection.on("UserStatusUpdated", (update: UserStatusUpdate) => {
      console.log("📊 UserStatusUpdated:", update);
      this.handlers.onUserStatusUpdated?.(update);
    });

    // Webinar mode events
    this.connection.on("SpeakRequestReceived", (data: { userId: string; userName: string; timestamp: string }) => {
      console.log("🙋 SpeakRequestReceived:", data);
      // Handle speak request
    });

    this.connection.on("SpeakingPermissionChanged", (data: { granted: boolean; grantedBy: string; timestamp: string }) => {
      console.log("🎤 SpeakingPermissionChanged:", data);
      // Handle speaking permission change
    });

    // Connection events
    this.connection.onreconnecting((error) => {
      console.warn("🔄 SignalR Reconnecting...", error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log("✅ SignalR Reconnected:", connectionId);
      // Rejoin the room if we were in one
      if (this.currentRoomId) {
        this.joinRoom(this.currentRoomId).catch(console.error);
      }
    });

    this.connection.onclose((error) => {
      console.log("❌ SignalR Connection Closed:", error);
      this.handlers.onDisconnected?.();
    });
  }

  /**
   * Register event handlers
   */
  on(handlers: SignalREventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Join a study room via SignalR
   */
  async joinRoom(roomId: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("JoinRoom", roomId);
      this.currentRoomId = roomId;
      console.log(`✅ Joined room ${roomId} via SignalR`);
    } catch (error) {
      console.error("❌ Failed to join room via SignalR:", error);
      throw error;
    }
  }

  /**
   * Leave a study room via SignalR
   */
  async leaveRoom(roomId: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.invoke("LeaveRoom", roomId);
      this.currentRoomId = null;
      console.log(`✅ Left room ${roomId} via SignalR`);
    } catch (error) {
      console.error("❌ Failed to leave room via SignalR:", error);
      throw error;
    }
  }

  /**
   * Send a message to the room (Text message)
   */
  async sendMessage(roomId: number, message: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("SendMessage", roomId, message);
      console.log("✅ Message sent");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      throw error;
    }
  }

  /**
   * Send an emoji to the room
   */
  async sendEmoji(roomId: number, emoji: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("SendEmoji", roomId, emoji);
      console.log("✅ Emoji sent");
    } catch (error) {
      console.error("❌ Failed to send emoji:", error);
      throw error;
    }
  }

  /**
   * Update media status (video/audio on/off)
   * Match backend: UpdateMediaStatus(int roomId, MediaStatusUpdate status)
   */
  async updateMediaStatus(roomId: number, isVideoOn: boolean, isAudioOn: boolean): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("UpdateMediaStatus", roomId, {
        IsVideoOn: isVideoOn,
        IsAudioOn: isAudioOn,
      });
      console.log(`✅ Media status updated: Video=${isVideoOn}, Audio=${isAudioOn}`);
    } catch (error) {
      console.error("❌ Failed to update media status:", error);
      throw error;
    }
  }

  /**
   * Update screen sharing status
   * Match backend: UpdateScreenSharingStatus(int roomId, bool isSharing)
   */
  async updateScreenSharingStatus(roomId: number, isSharing: boolean): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("UpdateScreenSharingStatus", roomId, isSharing);
      console.log(`✅ Screen sharing status updated: ${isSharing}`);
    } catch (error) {
      console.error("❌ Failed to update screen sharing status:", error);
      throw error;
    }
  }

  /**
   * Update user status (joined-video, left-video, etc.)
   * Match backend: UpdateUserStatus(int roomId, UserStatusUpdate status)
   */
  async updateUserStatus(roomId: number, status: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("UpdateUserStatus", roomId, {
        Status: status,
      });
      console.log(`✅ User status updated: ${status}`);
    } catch (error) {
      console.error("❌ Failed to update user status:", error);
      throw error;
    }
  }

  /**
   * Request to speak (Webinar mode)
   * Match backend: RequestToSpeak(int roomId)
   */
  async requestToSpeak(roomId: number): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("RequestToSpeak", roomId);
      console.log("✅ Speak request sent");
    } catch (error) {
      console.error("❌ Failed to send speak request:", error);
      throw error;
    }
  }

  /**
   * Grant or revoke speaking permission (Webinar mode)
   * Match backend: GrantSpeakingPermission(int roomId, string targetUserId, bool grant)
   */
  async grantSpeakingPermission(roomId: number, targetUserId: string, grant: boolean): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("GrantSpeakingPermission", roomId, targetUserId, grant);
      console.log(`✅ Speaking permission ${grant ? "granted" : "revoked"} for user ${targetUserId}`);
    } catch (error) {
      console.error("❌ Failed to grant/revoke speaking permission:", error);
      throw error;
    }
  }

  /**
   * Disconnect from SignalR
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("✅ SignalR Disconnected");
      } catch (error) {
        console.error("❌ Error disconnecting SignalR:", error);
      }
      this.connection = null;
      this.currentRoomId = null;
    }
  }

  /**
   * Get connection state
   */
  getState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Singleton instance
export const signalRService = new SignalRService();
export default signalRService;
