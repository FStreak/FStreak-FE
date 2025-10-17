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
  hasVideo?: boolean;  // Track if user has video enabled
  hasAudio?: boolean;  // Track if user has audio enabled
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

      // Get existing remote users in the channel and subscribe to them
      const existingUsers = this.client.remoteUsers;
      console.log(`👥 Found ${existingUsers.length} existing users in channel:`, existingUsers.map(u => u.uid));
      
      for (const user of existingUsers) {
        console.log(`🔍 Checking existing user ${user.uid}:`, {
          hasVideo: user.hasVideo,
          hasAudio: user.hasAudio,
          videoTrack: !!user.videoTrack,
          audioTrack: !!user.audioTrack
        });

        // Add to remote users map with initial media state
        const remoteUser: RemoteUser = { 
          uid: user.uid,
          hasVideo: user.hasVideo,
          hasAudio: user.hasAudio
        };
        this.remoteUsers.set(user.uid, remoteUser);

        // Subscribe to their published tracks
        if (user.hasVideo && !user.videoTrack) {
          try {
            console.log(`📹 Subscribing to video of existing user ${user.uid}`);
            await this.client.subscribe(user, "video");
          } catch (error) {
            console.warn(`⚠️ Failed to subscribe to video of user ${user.uid}:`, error);
          }
        }

        if (user.hasAudio && !user.audioTrack) {
          try {
            console.log(`🎤 Subscribing to audio of existing user ${user.uid}`);
            await this.client.subscribe(user, "audio");
          } catch (error) {
            console.warn(`⚠️ Failed to subscribe to audio of user ${user.uid}:`, error);
          }
        }

        // Update remote user with tracks
        if (user.videoTrack || user.audioTrack) {
          remoteUser.videoTrack = user.videoTrack;
          remoteUser.audioTrack = user.audioTrack;
          this.remoteUsers.set(user.uid, remoteUser);
          console.log(`✅ Added existing user ${user.uid} with video=${user.hasVideo}, audio=${user.hasAudio}`);
        }
      }

      console.log(`✅ Initialized with ${this.remoteUsers.size} existing remote users`);

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
          remoteUser.hasVideo = true;
          console.log(`📹 User ${user.uid} video enabled`);
        } else if (mediaType === "audio") {
          remoteUser.audioTrack = user.audioTrack;
          remoteUser.hasAudio = true;
          // Auto play audio
          user.audioTrack?.play();
          console.log(`🎤 User ${user.uid} audio enabled`);
        }

        this.remoteUsers.set(user.uid, remoteUser);
        this.handlers.onUserPublished?.(remoteUser, mediaType);

      } catch (error) {
        console.error(`❌ Failed to subscribe to ${user.uid}:`, error);
      }
    });

    // User unpublished (stopped video/audio)
    this.client.on("user-unpublished", (user, mediaType) => {
      console.log(`📴 User ${user.uid} unpublished ${mediaType}`);
      
      const remoteUser = this.remoteUsers.get(user.uid);
      if (remoteUser) {
        if (mediaType === "video") {
          // Stop the video track before removing it
          if (remoteUser.videoTrack) {
            remoteUser.videoTrack.stop();
            console.log(`🛑 Stopped video track for user ${user.uid}`);
          }
          remoteUser.videoTrack = undefined;
          remoteUser.hasVideo = false;
          console.log(`📹 User ${user.uid} video disabled`);
        } else if (mediaType === "audio") {
          // Stop the audio track before removing it
          if (remoteUser.audioTrack) {
            remoteUser.audioTrack.stop();
            console.log(`🛑 Stopped audio track for user ${user.uid}`);
          }
          remoteUser.audioTrack = undefined;
          remoteUser.hasAudio = false;
          console.log(`🎤 User ${user.uid} audio disabled`);
        }
        // Update the map with modified remote user
        this.remoteUsers.set(user.uid, remoteUser);
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
      // Try to create both tracks, but handle individual failures gracefully
      const trackPromises = await Promise.allSettled([
        AgoraRTC.createCameraVideoTrack({
          encoderConfig: "720p_2",
          optimizationMode: "balanced",
        }).catch((error) => {
          console.warn("⚠️ Failed to create video track:", error.message);
          return null;
        }),
        AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "music_standard",
        }).catch((error) => {
          console.warn("⚠️ Failed to create audio track:", error.message);
          return null;
        }),
      ]);

      // Extract the results
      const videoResult = trackPromises[0];
      const audioResult = trackPromises[1];

      // Set video track if successful
      if (videoResult.status === "fulfilled" && videoResult.value) {
        this.localVideoTrack = videoResult.value;
        console.log("✅ Video track created");
      } else {
        console.warn("⚠️ Continuing without video track");
      }

      // Set audio track if successful
      if (audioResult.status === "fulfilled" && audioResult.value) {
        this.localAudioTrack = audioResult.value;
        console.log("✅ Audio track created");
      } else {
        console.warn("⚠️ Continuing without audio track");
      }

      // If both failed, throw an error
      if (!this.localVideoTrack && !this.localAudioTrack) {
        throw new Error(
          "Failed to create both video and audio tracks. Please check camera/microphone permissions."
        );
      }

      console.log(
        `✅ Local tracks created (Video: ${!!this.localVideoTrack}, Audio: ${!!this.localAudioTrack})`
      );
    } catch (error) {
      console.error("❌ Failed to create local tracks:", error);
      throw error;
    }
  }

  /**
   * Publish local tracks
   */
  private async publishLocalTracks(): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    try {
      // Publish only the tracks that were successfully created
      const tracksToPublish = [];
      if (this.localVideoTrack) {
        tracksToPublish.push(this.localVideoTrack);
      }
      if (this.localAudioTrack) {
        tracksToPublish.push(this.localAudioTrack);
      }

      if (tracksToPublish.length > 0) {
        await this.client.publish(tracksToPublish);
        console.log(`✅ Local tracks published (${tracksToPublish.length} tracks)`);
      } else {
        console.warn("⚠️ No tracks to publish");
      }
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
   * Get Agora client instance
   */
  getClient(): IAgoraRTCClient | null {
    return this.client;
  }

  /**
   * Toggle camera on/off
   */
  async toggleCamera(): Promise<boolean> {
    // If no video track exists, try to create one
    if (!this.localVideoTrack) {
      try {
        console.log("📹 Attempting to create video track...");
        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: "720p_2",
          optimizationMode: "balanced",
        });
        
        // Publish the new track
        if (this.client) {
          await this.client.publish(this.localVideoTrack);
          console.log("✅ Video track created and published");
        }
        
        return true; // Camera is now enabled
      } catch (error) {
        console.warn("⚠️ Cannot create video track:", error);
        // Return false but don't throw - user can still use audio
        return false;
      }
    }

    // Toggle existing track
    const newState = !this.localVideoTrack.enabled;
    
    if (newState) {
      // Enable and publish
      await this.localVideoTrack.setEnabled(true);
      if (this.client && this.localVideoTrack) {
        await this.client.publish(this.localVideoTrack);
        console.log("✅ Camera enabled and published");
      }
    } else {
      // Disable and unpublish
      await this.localVideoTrack.setEnabled(false);
      if (this.client && this.localVideoTrack) {
        await this.client.unpublish(this.localVideoTrack);
        console.log("✅ Camera disabled and unpublished");
      }
    }
    
    return newState;
  }

  /**
   * Toggle microphone on/off
   */
  async toggleMicrophone(): Promise<boolean> {
    // If no audio track exists, try to create one
    if (!this.localAudioTrack) {
      try {
        console.log("🎤 Attempting to create audio track...");
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "music_standard",
        });
        
        // Publish the new track
        if (this.client) {
          await this.client.publish(this.localAudioTrack);
          console.log("✅ Audio track created and published");
        }
        
        return true; // Microphone is now enabled
      } catch (error) {
        console.warn("⚠️ Cannot create audio track:", error);
        // Return false but don't throw
        return false;
      }
    }

    // Toggle existing track
    const newState = !this.localAudioTrack.enabled;
    
    if (newState) {
      // Enable and publish
      await this.localAudioTrack.setEnabled(true);
      if (this.client && this.localAudioTrack) {
        await this.client.publish(this.localAudioTrack);
        console.log("✅ Microphone enabled and published");
      }
    } else {
      // Disable and unpublish
      await this.localAudioTrack.setEnabled(false);
      if (this.client && this.localAudioTrack) {
        await this.client.unpublish(this.localAudioTrack);
        console.log("✅ Microphone disabled and unpublished");
      }
    }
    
    return newState;
  }

  /**
   * Start screen sharing
   */
  async startScreenShare(): Promise<void> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    if (this.isScreenSharing) {
      console.warn("Already screen sharing");
      return;
    }

    try {
      // Create screen track
      const screenTrackResult = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: "1080p_1",
        optimizationMode: "detail", // Better for text/code
      }, "auto");

      // Handle both possible return types (single track or array)
      this.screenTrack = Array.isArray(screenTrackResult) 
        ? screenTrackResult[0] 
        : screenTrackResult;

      // Unpublish camera if it exists
      if (this.localVideoTrack) {
        try {
          await this.client.unpublish(this.localVideoTrack);
          console.log("📹 Camera unpublished for screen sharing");
        } catch (error) {
          console.warn("⚠️ Failed to unpublish camera:", error);
        }
      }

      // Publish screen
      if (this.screenTrack) {
        await this.client.publish(this.screenTrack);
        console.log("🖥️ Screen track published");
      }

      this.isScreenSharing = true;
      console.log("✅ Screen sharing started");

      // Handle screen share stop (when user clicks browser's stop button)
      if (this.screenTrack) {
        this.screenTrack.on("track-ended", () => {
          console.log("Screen sharing stopped by user");
          this.stopScreenShare().catch(console.error);
        });
      }

    } catch (error) {
      console.error("❌ Failed to start screen sharing:", error);
      this.isScreenSharing = false;
      
      // Check if user cancelled the screen share selection
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("Permission denied") || 
        errorMessage.includes("NotAllowedError") ||
        errorMessage.includes("PERMISSION_DENIED")
      ) {
        console.log("ℹ️ Screen share cancelled by user");
        // Don't throw error - user cancellation is not an error
        return;
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Stop screen sharing
   */
  async stopScreenShare(): Promise<void> {
    if (!this.client || !this.screenTrack) {
      return;
    }

    if (!this.isScreenSharing) {
      return;
    }

    try {
      // Close and unpublish screen track
      this.screenTrack.close();
      await this.client.unpublish(this.screenTrack);
      this.screenTrack = null;

      // Re-publish camera only if it exists
      if (this.localVideoTrack) {
        try {
          await this.client.publish(this.localVideoTrack);
          console.log("📹 Camera re-published after screen sharing");
        } catch (error) {
          console.warn("⚠️ Failed to re-publish camera:", error);
        }
      } else {
        console.log("ℹ️ No camera to re-publish");
      }

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
