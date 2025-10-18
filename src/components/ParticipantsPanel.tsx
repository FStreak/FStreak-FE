"use client";

import { useState, useEffect } from "react";
import { signalRService } from "@/services/signalRService";
import { privateApiService } from "@/services/ApiPrivate";
import { Users, Video, VideoOff, Mic, MicOff, Monitor, Hand } from "lucide-react";
import type { RoomUserDto, MediaStatusUpdate } from "@/model/studyRoom/studyRoomTypes";
import type { RemoteUser } from "@/services/agoraService";

interface ParticipantsPanelProps {
  roomId: number;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  localVideoOn: boolean;
  localAudioOn: boolean;
  remoteUsers: RemoteUser[];
}

interface ParticipantWithStatus extends RoomUserDto {
  isVideoOn?: boolean;
  isAudioOn?: boolean;
  isScreenSharing?: boolean;
  isHandRaised?: boolean;
}

export default function ParticipantsPanel({
  roomId,
  currentUserId,
  isOpen,
  onClose,
  localVideoOn,
  localAudioOn,
  remoteUsers,
}: ParticipantsPanelProps) {
  const [participants, setParticipants] = useState<ParticipantWithStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing participants when panel opens (ONLY ONCE)
  useEffect(() => {
    if (!isOpen) return;

    const fetchParticipants = async () => {
      try {
        setIsLoading(true);
        console.log("📋 Fetching participants for room:", roomId);
        console.log("📋 Current user ID:", currentUserId);
        console.log("📋 Initial local media state:", { video: localVideoOn, audio: localAudioOn });
        
        const roomData = await privateApiService.getRoomById(roomId);
        const existingUsers = roomData.roomUsers || [];
        
        console.log("📋 Room users from API:", existingUsers.map(u => ({ 
          userId: u.userId, 
          userName: u.userName,
          roomUserId: u.roomUserId 
        })));
        
        const currentUidNum = typeof currentUserId === 'number' ? currentUserId : parseInt(currentUserId.toString(), 10);
        
        console.log("🔍 Looking for current user with roomUserId:", currentUidNum);
        console.log("🔍 All roomUserIds from API:", existingUsers.map(u => u.roomUserId));
        const currentUserInApi = existingUsers.find(u => u.roomUserId === currentUidNum);
        console.log("🔍 Current user found in API?", currentUserInApi ? `Yes: ${currentUserInApi.userName}` : "No");
        
        if (!currentUserInApi && existingUsers.length > 0) {
          console.log("⚠️ DEBUG: Current UID doesn't match any API roomUserId");
          console.log("⚠️ Current UID type:", typeof currentUidNum, "Value:", currentUidNum);
          console.log("⚠️ API roomUserIds types:", existingUsers.map(u => ({
            value: u.roomUserId,
            type: typeof u.roomUserId,
            matches: u.roomUserId === currentUidNum
          })));
        }
        
        // Filter out current user - we don't show "You" in participants list
        const usersWithoutCurrentUser = existingUsers.filter(u => u.roomUserId !== currentUidNum);
        console.log(`🚫 Filtered out current user. Showing ${usersWithoutCurrentUser.length}/${existingUsers.length} participants`);
        
        // Map users with initial state (all remote users)
        const allUsers = usersWithoutCurrentUser.map((user) => {
          return {
            ...user,
            // Remote users start with media off, Agora sync will update
            isVideoOn: false,
            isAudioOn: false,
            isScreenSharing: false,
            isHandRaised: false,
          };
        });
        
        setParticipants(allUsers);
        console.log(`✅ Loaded ${allUsers.length} remote participants (excluding current user)`);
      } catch (error) {
        console.error("❌ Failed to fetch participants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
    // Note: Only run on panel open, not when localVideoOn/localAudioOn change
    // Those updates are handled by the Agora sync effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, roomId, currentUserId]);

  // Sync Agora media state (real-time camera/mic status)
  useEffect(() => {
    if (!isOpen) return;

    console.log("🔄 Syncing Agora state - Local:", { video: localVideoOn, audio: localAudioOn });
    console.log("🔄 Current Agora UID:", currentUserId);
    console.log("🔄 Remote users from Agora:", remoteUsers.map(u => ({ 
      uid: u.uid, 
      hasVideo: u.hasVideo, 
      hasAudio: u.hasAudio 
    })));

    setParticipants((prev) => {
      console.log("🔄 Current participants:", prev.map(p => ({ 
        roomUserId: p.roomUserId, 
        userId: p.userId, 
        userName: p.userName 
      })));
      
      const currentUidNum = typeof currentUserId === 'number' ? currentUserId : parseInt(currentUserId.toString(), 10);
      
      // Now update all participants with latest Agora state
      // IMPORTANT: Filter out current user AND users who left (only show remote users)
      return prev
        .filter((participant) => {
          const isCurrentUser = participant.roomUserId === currentUidNum;
          if (isCurrentUser) {
            console.log("🚫 Filtering out current user (You) from participants list");
            return false; // Don't show current user
          }
          
          // Check if this user is still in Agora (active remote user)
          const stillInAgora = remoteUsers.some((remote) => {
            const remoteUidNum = typeof remote.uid === 'number' ? remote.uid : parseInt(remote.uid.toString(), 10);
            return remoteUidNum === participant.roomUserId;
          });
          
          if (!stillInAgora) {
            console.log("🗑️ Filtering out user who left:", participant.userName, { roomUserId: participant.roomUserId });
          }
          
          return stillInAgora; // Only keep users still in Agora
        })
        .map((participant) => {
          // Update remote users' media status from Agora (match by roomUserId)
          const remoteUser = remoteUsers.find(
            (remote) => {
              const remoteUidNum = typeof remote.uid === 'number' ? remote.uid : parseInt(remote.uid.toString(), 10);
              return remoteUidNum === participant.roomUserId;
            }
          );

          if (remoteUser) {
            console.log("✅ Updating remote user:", participant.userName, {
              roomUserId: participant.roomUserId,
              agoraUid: remoteUser.uid,
              video: remoteUser.hasVideo,
              audio: remoteUser.hasAudio
            });
            return {
              ...participant,
              isVideoOn: remoteUser.hasVideo ?? false,
              isAudioOn: remoteUser.hasAudio ?? false,
            };
          }

          return participant;
        });
    });
  }, [isOpen, localVideoOn, localAudioOn, remoteUsers, currentUserId]);

  useEffect(() => {
    if (!isOpen) return;

    // Check connection
    const connected = signalRService.isConnected();
    setIsConnected(connected);

    // Listen for participant events
    const handleUserJoined = (user: RoomUserDto) => {
      console.log("👤 User joined:", user);
      
      setParticipants((prev) => {
        const currentUidNum = typeof currentUserId === 'number' ? currentUserId : parseInt(currentUserId.toString(), 10);
        
        // Skip if this is the current user (don't show "You" in participants)
        if (user.roomUserId === currentUidNum) {
          console.log("⚠️ Skipping current user (You) - not showing in participants list");
          return prev;
        }
        
        // Check if user already exists by userId OR roomUserId
        const existsByUserId = prev.find((p) => p.userId === user.userId);
        const existsByRoomUserId = prev.find((p) => p.roomUserId === user.roomUserId);
        
        if (existsByUserId || existsByRoomUserId) {
          // Update existing entry (e.g., replace "You" with real name)
          return prev.map((p) => {
            if (p.userId === user.userId || p.roomUserId === user.roomUserId) {
              console.log(`✅ Updating existing user: "${p.userName}" → "${user.userName}"`);
              return {
                ...p,
                ...user, // Update with real data from SignalR
                // Keep current media state
                isVideoOn: p.isVideoOn,
                isAudioOn: p.isAudioOn,
                isScreenSharing: p.isScreenSharing,
                isHandRaised: p.isHandRaised,
              };
            }
            return p;
          });
        } else {
          // Add new user
          return [...prev, { 
            ...user, 
            isVideoOn: false, 
            isAudioOn: false,
            isScreenSharing: false,
            isHandRaised: false,
          }];
        }
      });
    };

    const handleUserLeft = (user: RoomUserDto) => {
      console.log("👋 User left:", user);
      setParticipants((prev) => prev.filter((p) => p.userId !== user.userId));
    };

    const handleMediaStatusUpdate = (update: MediaStatusUpdate) => {
      console.log("📹 Media status update:", update);
      setParticipants((prev) =>
        prev.map((p) =>
          p.userId === update.userId
            ? { ...p, isVideoOn: update.isVideoOn, isAudioOn: update.isAudioOn }
            : p
        )
      );
    };

    const handleScreenSharingUpdate = (update: any) => {
      console.log("🖥️ Screen sharing update:", update);
      setParticipants((prev) =>
        prev.map((p) =>
          p.userId === update.userId
            ? { ...p, isScreenSharing: update.isSharing }
            : p
        )
      );
    };

    // Register event handlers
    signalRService.on({
      onUserJoined: handleUserJoined,
      onUserLeft: handleUserLeft,
      onMediaStatusUpdated: handleMediaStatusUpdate,
      onScreenSharingStatusUpdated: handleScreenSharingUpdate,
    });

    return () => {
      // Cleanup if needed
    };
  }, [isOpen, roomId]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 w-80 h-[600px] bg-card rounded-lg shadow-2xl flex flex-col z-50 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Users size={20} />
          <h3 className="font-semibold">Người tham gia</h3>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {participants.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded p-1 transition"
        >
          ✕
        </button>
      </div>

      {/* Connection status */}
      {!isConnected && (
        <div className="p-3 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm">
          ⚠️ Đang kết nối lại...
        </div>
      )}

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {/* All Participants (including current user) */}
        {participants
          // Deduplicate by roomUserId to prevent duplicate "You" entries
          .filter((participant, index, self) => 
            index === self.findIndex(p => p.roomUserId === participant.roomUserId)
          )
          .map((participant) => {
          const currentUidNum = typeof currentUserId === 'number' ? currentUserId : parseInt(currentUserId.toString(), 10);
          const isCurrentUser = participant.roomUserId === currentUidNum;

          return (
            <div
              key={`participant-${participant.roomUserId}`}
              className={`p-3 border-b border-border transition ${
                isCurrentUser 
                  ? "bg-primary/5 hover:bg-primary/10" 
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    isCurrentUser
                      ? "bg-gradient-to-br from-blue-400 to-blue-600"
                      : "bg-gradient-to-br from-purple-400 to-pink-400"
                  }`}>
                    {participant.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {participant.userName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Bạn
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {participant.isScreenSharing ? "🖥️ Đang chia sẻ màn hình" : "Đang trong phòng"}
                    </p>
                  </div>
                </div>

                {/* Media Status Icons */}
                <div className="flex items-center space-x-1">
                  <div
                    className={`p-1.5 rounded ${
                      participant.isVideoOn
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {participant.isVideoOn ? (
                      <Video size={14} />
                    ) : (
                      <VideoOff size={14} />
                    )}
                  </div>
                  <div
                    className={`p-1.5 rounded ${
                      participant.isAudioOn
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {participant.isAudioOn ? (
                      <Mic size={14} />
                    ) : (
                      <MicOff size={14} />
                    )}
                  </div>
                  {participant.isScreenSharing && (
                    <div className="p-1.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Monitor size={14} />
                    </div>
                  )}
                  {participant.isHandRaised && (
                    <div className="p-1.5 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                      <Hand size={14} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm">Đang tải...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && participants.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Users size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chưa có người tham gia khác</p>
            <p className="text-xs mt-1">
              Chia sẻ link phòng để mời bạn bè
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground text-center">
          💡 Tip: Biểu tượng hiển thị trạng thái camera/mic
        </div>
      </div>
    </div>
  );
}
