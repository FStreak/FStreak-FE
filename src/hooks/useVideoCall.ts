"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { agoraService, type AgoraConfig, type RemoteUser } from "../services/agoraService";
import { signalRService } from "../services/signalRService";
import { privateApiService } from "../services/ApiPrivate";
import type { Participant } from "../model/studyRoom/studyRoomTypes";

interface UseVideoCallOptions {
  roomId: number;
  onError?: (error: Error) => void;
}

export interface JoinVideoCallParams {
  appId: string;
  channel: string;
  token: string;
  uid: string | number | null;
}

interface UseVideoCallReturn {
  // State
  isConnected: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  participants: Participant[];
  remoteUsers: RemoteUser[];
  
  // Actions
  joinVideoCall: (params: JoinVideoCallParams) => Promise<void>;
  leaveVideoCall: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  toggleMicrophone: () => Promise<void>;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => Promise<void>;
  
  // Local tracks (for rendering)
  localVideoTrack: any;
  localAudioTrack: any;
}

export const useVideoCall = ({ roomId, onError }: UseVideoCallOptions): UseVideoCallReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);

  const tokenRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Join video call
   */
  const joinVideoCall = useCallback(async (params: JoinVideoCallParams) => {
    try {
      const { appId, channel, token, uid } = params;

      // Initialize Agora
      const config: AgoraConfig = {
        appId,
        channelName: channel,
        token,
        uid,
      };

      await agoraService.initialize(config);

      // 3. Setup Agora event handlers
      agoraService.on({
        onUserJoined: (user) => {
          console.log("Remote user joined:", user.uid);
          setRemoteUsers((prev) => [...prev, user]);
        },
        onUserLeft: (uid) => {
          console.log("Remote user left:", uid);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== uid));
        },
        onUserPublished: (user, mediaType) => {
          console.log(`Remote user published ${mediaType}:`, user.uid);
          setRemoteUsers((prev) =>
            prev.map((u) => (u.uid === user.uid ? user : u))
          );
        },
        onUserUnpublished: (uid, mediaType) => {
          console.log(`Remote user unpublished ${mediaType}:`, uid);
        },
        onTokenPrivilegeWillExpire: async () => {
          // Refresh token
          try {
            const tokenResponse = await privateApiService.refreshAgoraTokens(roomId);
            await agoraService.renewToken(tokenResponse.token);
            console.log("Token refreshed successfully");
          } catch (error) {
            console.error("Failed to refresh token:", error);
            onError?.(error as Error);
          }
        },
        onError: (error) => {
          console.error("Agora error:", error);
          onError?.(error);
        },
      });

      // 4. Get local tracks
      const videoTrack = agoraService.getLocalVideoTrack();
      const audioTrack = agoraService.getLocalAudioTrack();
      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);

      // 5. Notify others via SignalR
      await signalRService.updateUserStatus(roomId, "joined-video");

      setIsConnected(true);
      console.log("✅ Successfully joined video call");

      // 6. Setup token refresh timer (refresh every 50 minutes)
      tokenRefreshTimerRef.current = setInterval(async () => {
        try {
          const tokenResponse = await privateApiService.refreshAgoraTokens(roomId);
          await agoraService.renewToken(tokenResponse.token);
          console.log("Token auto-refreshed");
        } catch (error) {
          console.error("Failed to auto-refresh token:", error);
        }
      }, 50 * 60 * 1000); // 50 minutes

    } catch (error) {
      console.error("Failed to join video call:", error);
      onError?.(error as Error);
      throw error;
    }
  }, [roomId, onError]);

  /**
   * Leave video call
   */
  const leaveVideoCall = useCallback(async () => {
    try {
      // 1. Notify others via SignalR
      await signalRService.updateUserStatus(roomId, "left-video");

      // 2. Leave Agora
      await agoraService.leave();

      // 3. Clear state
      setIsConnected(false);
      setRemoteUsers([]);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setIsScreenSharing(false);

      // 4. Clear token refresh timer
      if (tokenRefreshTimerRef.current) {
        clearInterval(tokenRefreshTimerRef.current);
        tokenRefreshTimerRef.current = null;
      }

      console.log("✅ Successfully left video call");
    } catch (error) {
      console.error("Failed to leave video call:", error);
      onError?.(error as Error);
    }
  }, [roomId, onError]);

  /**
   * Toggle camera
   */
  const toggleCamera = useCallback(async () => {
    try {
      const newState = await agoraService.toggleCamera();
      setIsVideoOn(newState);

      // Notify others via SignalR
      await signalRService.updateMediaStatus(roomId, newState, isAudioOn);

      console.log(`Camera ${newState ? "on" : "off"}`);
    } catch (error) {
      console.error("Failed to toggle camera:", error);
      onError?.(error as Error);
    }
  }, [roomId, isAudioOn, onError]);

  /**
   * Toggle microphone
   */
  const toggleMicrophone = useCallback(async () => {
    try {
      const newState = await agoraService.toggleMicrophone();
      setIsAudioOn(newState);

      // Notify others via SignalR
      await signalRService.updateMediaStatus(roomId, isVideoOn, newState);

      console.log(`Microphone ${newState ? "on" : "off"}`);
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
      onError?.(error as Error);
    }
  }, [roomId, isVideoOn, onError]);

  /**
   * Start screen sharing
   */
  const startScreenShare = useCallback(async () => {
    try {
      await agoraService.startScreenShare();
      setIsScreenSharing(true);

      // Notify others via SignalR
      await signalRService.updateScreenSharingStatus(roomId, true);

      console.log("Screen sharing started");
    } catch (error) {
      console.error("Failed to start screen sharing:", error);
      onError?.(error as Error);
    }
  }, [roomId, onError]);

  /**
   * Stop screen sharing
   */
  const stopScreenShare = useCallback(async () => {
    try {
      await agoraService.stopScreenShare();
      setIsScreenSharing(false);

      // Notify others via SignalR
      await signalRService.updateScreenSharingStatus(roomId, false);

      console.log("Screen sharing stopped");
    } catch (error) {
      console.error("Failed to stop screen sharing:", error);
      onError?.(error as Error);
    }
  }, [roomId, onError]);

  /**
   * Cleanup on unmount only
   * ⚠️ Don't add dependencies here - we only want cleanup on unmount, not on re-renders
   */
  useEffect(() => {
    return () => {
      // Only cleanup when hook is truly unmounting
      // Using agoraService directly to avoid stale closure issues
      if (agoraService.getClient()) {
        console.log("🧹 useVideoCall unmounting - cleaning up Agora connection");
        agoraService.leave().catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run cleanup on unmount

  return {
    // State
    isConnected,
    isVideoOn,
    isAudioOn,
    isScreenSharing,
    participants,
    remoteUsers,
    
    // Actions
    joinVideoCall,
    leaveVideoCall,
    toggleCamera,
    toggleMicrophone,
    startScreenShare,
    stopScreenShare,
    
    // Local tracks
    localVideoTrack,
    localAudioTrack,
  };
};

export default useVideoCall;
