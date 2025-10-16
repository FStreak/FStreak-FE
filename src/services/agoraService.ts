import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  ILocalVideoTrack,
  UID,
} from "agora-rtc-sdk-ng";

export interface AgoraConfig {
  appId: string;
  channelName: string;
  token: string;
  uid: string | number | null;
}

export interface RemoteUser {
  uid: UID;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
}

export interface AgoraEventHandlers {
  onUserJoined?: (user: RemoteUser) => void;
  onUserLeft?: (uid: UID) => void;
  onUserPublished?: (user: RemoteUser, mediaType: "audio" | "video") => void;
  onUserUnpublished?: (uid: UID, mediaType: "audio" | "video") => void;
  onTokenPrivilegeWillExpire?: () => void;
  onConnectionStateChange?: (state: string) => void;
  onError?: (error: Error) => void;
}

class AgoraService {
  private client: IAgoraRTCClient | null = null;
  private localVideoTrack: ICameraVideoTrack | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private screenTrack: ILocalVideoTrack | null = null;
  private remoteUsers: Map<UID, RemoteUser> = new Map();
  private handlers: AgoraEventHandlers = {};
  private isScreenSharing: boolean = false;

  constructor() {
    // Set Agora log level (0: DEBUG, 1: INFO, 2: WARNING, 3: ERROR, 4: NONE)
    AgoraRTC.setLogLevel(1);
  }

  /**
   * Initialize Agora client
   */
  async initialize(config: AgoraConfig): Promise<void> {
    try {
      console.log("🔧 Agora initialize called with:", {
        appId: config.appId,
        channelName: config.channelName,
        token: config.token ? config.token.substring(0, 20) + "..." : "undefined",
        uid: config.uid,
      });

      // Validate required parameters
      if (!config.appId) {
        throw new Error("appId is required");
      }
      if (!config.channelName) {
        throw new Error("channelName is required");
      }
      if (!config.token) {
        throw new Error("token is required");
      }

      // Create client
      this.client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      this.setupEventListeners();

      console.log("🔗 Attempting to join Agora channel...", {
        appId: config.appId,
        channel: config.channelName,
        uid: config.uid,
        uidType: typeof config.uid,
        tokenLength: config.token.length,
        tokenPrefix: config.token.substring(0, 10),
      });

      // Convert uid to proper type for Agora
      let finalUid: number | string | null = null;
      if (config.uid !== null && config.uid !== undefined) {
        if (typeof config.uid === 'string') {
          // Try to parse string to number
          const parsed = parseInt(config.uid, 10);
          if (!isNaN(parsed)) {
            finalUid = parsed;
            console.log(`🔄 Converted UID from string "${config.uid}" to number ${parsed}`);
          } else {
            // Keep as string if not a valid number
            finalUid = config.uid;
            console.log(`✓ Keeping UID as string: "${config.uid}"`);
          }
        } else {
          finalUid = config.uid;
          console.log(`✓ Using UID as number: ${config.uid}`);
        }
      } else {
        finalUid = null;
        console.log("✓ Using null UID (Agora will auto-assign)");
      }

      // Join channel: (appId, channel, token, uid)
      try {
        console.log("🚀 Calling client.join() with:", {
          appId: config.appId,
          channel: config.channelName,
          uid: finalUid,
          uidType: typeof finalUid,
        });
        
        await this.client.join(
          config.appId,
          config.channelName,
          config.token,
          finalUid
        );
      } catch (joinError: any) {
        console.error("❌ Agora join failed with error:", {
          message: joinError.message,
          code: joinError.code,
          name: joinError.name,
          stack: joinError.stack,
        });
        
        // Enhance error message for common issues
        if (joinError.message?.includes("invalid vendor key") || 
            joinError.message?.includes("INVALID_VENDOR_KEY") ||
            joinError.code === "INVALID_VENDOR_KEY") {
          throw new Error(
            `❌ AGORA TOKEN ERROR: Invalid vendor key\n\n` +
            `This usually means:\n` +
            `1. Token was generated with wrong AppId\n` +
            `2. Token was generated with wrong AppCertificate\n` +
            `3. Token has expired\n\n` +
            `Debug Info:\n` +
            `- AppId: ${config.appId}\n` +
            `- Channel: ${config.channelName}\n` +
            `- UID: ${config.uid}\n` +
            `- Token Length: ${config.token.length}\n` +
            `- Token Start: ${config.token.substring(0, 20)}...\n\n` +
            `Original Error: ${joinError.message}`
          );
        }
        
        throw joinError;
      }

      console.log("✅ Agora client joined successfully");

      // Create and publish local tracks
      await this.createLocalTracks();
      await this.publishLocalTracks();

    } catch (error) {
      console.error("❌ Failed to initialize Agora:", error);
      this.handlers.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Setup Agora event listeners
   */
  private setupEventListeners(): void {
    if (!this.client) return;

    // User joined
    this.client.on("user-joined", (user) => {
      console.log("👤 User joined:", user.uid);
      const remoteUser: RemoteUser = { uid: user.uid };
      this.remoteUsers.set(user.uid, remoteUser);
      this.handlers.onUserJoined?.(remoteUser);
    });

    // User left
    this.client.on("user-left", (user) => {
      console.log("👤 User left:", user.uid);
      this.remoteUsers.delete(user.uid);
      this.handlers.onUserLeft?.(user.uid);
    });

    // User published (started video/audio)
    this.client.on("user-published", async (user, mediaType) => {
      console.log(`📡 User ${user.uid} published ${mediaType}`);
      
      try {
        // Subscribe to the remote user
        await this.client!.subscribe(user, mediaType);
        console.log(`✅ Subscribed to ${user.uid}'s ${mediaType}`);

        const remoteUser = this.remoteUsers.get(user.uid) || { uid: user.uid };

        if (mediaType === "video") {
          remoteUser.videoTrack = user.videoTrack;
        } else if (mediaType === "audio") {
          remoteUser.audioTrack = user.audioTrack;
          // Auto play audio
          user.audioTrack?.play();
        }

        this.remoteUsers.set(user.uid, remoteUser);
        this.handlers.onUserPublished?.(remoteUser, mediaType);

      } catch (error) {
        console.error(`❌ Failed to subscribe to ${user.uid}:`, error);
      }
    });

    // User unpublished (stopped video/audio)
    this.client.on("user-unpublished", (user, mediaType) => {
      console.log(`📡 User ${user.uid} unpublished ${mediaType}`);
      
      const remoteUser = this.remoteUsers.get(user.uid);
      if (remoteUser) {
        if (mediaType === "video") {
          remoteUser.videoTrack = undefined;
        } else if (mediaType === "audio") {
          remoteUser.audioTrack = undefined;
        }
      }

      this.handlers.onUserUnpublished?.(user.uid, mediaType);
    });

    // Token will expire (need to refresh)
    this.client.on("token-privilege-will-expire", () => {
      console.warn("⚠️ Token will expire soon");
      this.handlers.onTokenPrivilegeWillExpire?.();
    });

    // Connection state change
    this.client.on("connection-state-change", (curState, prevState) => {
      console.log(`🔄 Connection state: ${prevState} → ${curState}`);
      this.handlers.onConnectionStateChange?.(curState);
    });

    // Error
    this.client.on("exception", (event) => {
      console.error("❌ Agora exception:", event);
    });
  }

  /**
   * Create local video and audio tracks
   */
  private async createLocalTracks(): Promise<void> {
    try {
      [this.localVideoTrack, this.localAudioTrack] = await Promise.all([
        AgoraRTC.createCameraVideoTrack({
          encoderConfig: "720p_2",
          optimizationMode: "balanced",
        }),
        AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "music_standard",
        }),
      ]);

      console.log("✅ Local tracks created");
    } catch (error) {
      console.error("❌ Failed to create local tracks:", error);
      throw error;
    }
  }

  /**
   * Publish local tracks
   */
  private async publishLocalTracks(): Promise<void> {
    if (!this.client || !this.localVideoTrack || !this.localAudioTrack) {
      throw new Error("Client or tracks not initialized");
    }

    try {
      await this.client.publish([this.localVideoTrack, this.localAudioTrack]);
      console.log("✅ Local tracks published");
    } catch (error) {
      console.error("❌ Failed to publish local tracks:", error);
      throw error;
    }
  }

  /**
   * Register event handlers
   */
  on(handlers: AgoraEventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  /**
   * Get local video track
   */
  getLocalVideoTrack(): ICameraVideoTrack | null {
    return this.localVideoTrack;
  }

  /**
   * Get local audio track
   */
  getLocalAudioTrack(): IMicrophoneAudioTrack | null {
    return this.localAudioTrack;
  }

  /**
   * Get remote users
   */
  getRemoteUsers(): RemoteUser[] {
    return Array.from(this.remoteUsers.values());
  }

  /**
   * Toggle camera on/off
   */
  async toggleCamera(): Promise<boolean> {
    if (!this.localVideoTrack) {
      throw new Error("Local video track not initialized");
    }

    const newState = !this.localVideoTrack.enabled;
    await this.localVideoTrack.setEnabled(newState);
    console.log(`📹 Camera ${newState ? "enabled" : "disabled"}`);
    return newState;
  }

  /**
   * Toggle microphone on/off
   */
  async toggleMicrophone(): Promise<boolean> {
    if (!this.localAudioTrack) {
      throw new Error("Local audio track not initialized");
    }

    const newState = !this.localAudioTrack.enabled;
    await this.localAudioTrack.setEnabled(newState);
    console.log(`🎤 Microphone ${newState ? "enabled" : "disabled"}`);
    return newState;
  }

  /**
   * Start screen sharing
   */
  async startScreenShare(): Promise<void> {
    if (!this.client || !this.localVideoTrack) {
      throw new Error("Client or video track not initialized");
    }

    if (this.isScreenSharing) {
      console.warn("Already screen sharing");
      return;
    }

    try {
      // Create screen track
      this.screenTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: "1080p_1",
        optimizationMode: "detail", // Better for text/code
      }, "auto");

      // Unpublish camera
      await this.client.unpublish(this.localVideoTrack);

      // Publish screen
      await this.client.publish(this.screenTrack);

      this.isScreenSharing = true;
      console.log("✅ Screen sharing started");

      // Handle screen share stop (when user clicks browser's stop button)
      this.screenTrack.on("track-ended", () => {
        console.log("Screen sharing stopped by user");
        this.stopScreenShare().catch(console.error);
      });

    } catch (error) {
      console.error("❌ Failed to start screen sharing:", error);
      this.isScreenSharing = false;
      throw error;
    }
  }

  /**
   * Stop screen sharing
   */
  async stopScreenShare(): Promise<void> {
    if (!this.client || !this.screenTrack || !this.localVideoTrack) {
      return;
    }

    if (!this.isScreenSharing) {
      return;
    }

    try {
      // Close screen track
      this.screenTrack.close();
      await this.client.unpublish(this.screenTrack);
      this.screenTrack = null;

      // Re-publish camera
      await this.client.publish(this.localVideoTrack);

      this.isScreenSharing = false;
      console.log("✅ Screen sharing stopped");

    } catch (error) {
      console.error("❌ Failed to stop screen sharing:", error);
      throw error;
    }
  }

  /**
   * Check if screen sharing
   */
  getIsScreenSharing(): boolean {
    return this.isScreenSharing;
  }

  /**
   * Renew token (when token expires)
   */
  async renewToken(newToken: string): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    try {
      await this.client.renewToken(newToken);
      console.log("✅ Token renewed");
    } catch (error) {
      console.error("❌ Failed to renew token:", error);
      throw error;
    }
  }

  /**
   * Leave the channel and clean up
   */
  async leave(): Promise<void> {
    try {
      // Stop screen sharing if active
      if (this.isScreenSharing) {
        await this.stopScreenShare();
      }

      // Close local tracks
      this.localVideoTrack?.close();
      this.localAudioTrack?.close();

      // Leave channel
      if (this.client) {
        await this.client.leave();
        console.log("✅ Left Agora channel");
      }

      // Clear state
      this.localVideoTrack = null;
      this.localAudioTrack = null;
      this.screenTrack = null;
      this.remoteUsers.clear();
      this.client = null;
      this.isScreenSharing = false;

    } catch (error) {
      console.error("❌ Failed to leave Agora:", error);
      throw error;
    }
  }

  /**
   * Get camera devices
   */
  async getCameraDevices(): Promise<MediaDeviceInfo[]> {
    return await AgoraRTC.getCameras();
  }

  /**
   * Get microphone devices
   */
  async getMicrophoneDevices(): Promise<MediaDeviceInfo[]> {
    return await AgoraRTC.getMicrophones();
  }

  /**
   * Switch camera device
   */
  async switchCamera(deviceId: string): Promise<void> {
    if (!this.localVideoTrack) {
      throw new Error("Local video track not initialized");
    }

    await this.localVideoTrack.setDevice(deviceId);
    console.log("✅ Camera switched");
  }

  /**
   * Switch microphone device
   */
  async switchMicrophone(deviceId: string): Promise<void> {
    if (!this.localAudioTrack) {
      throw new Error("Local audio track not initialized");
    }

    await this.localAudioTrack.setDevice(deviceId);
    console.log("✅ Microphone switched");
  }
}

// Singleton instance
export const agoraService = new AgoraService();
export default agoraService;
