"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useVideoCall } from "@/hooks/useVideoCall";
import { signalRService } from "@/services/signalRService";
import { privateApiService } from "@/services/ApiPrivate";
import { useTokenInfoStorage } from "@/store/authStore";
import type { StudyRoomDto, MediaStatusUpdate, ScreenSharingStatusUpdate } from "@/model/studyRoom/studyRoomTypes";
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, PhoneOff, MessageCircle, Users } from "lucide-react";
import ChatBox from "./ChatBox";
import ParticipantsPanel from "./ParticipantsPanel";
import { ThemeToggle } from "./theme-toggle";
import type { RemoteUser } from "@/services/agoraService";

// Remote Video Card Component
function RemoteVideoCard({ 
  user, 
  userName 
}: { 
  user: RemoteUser; 
  userName?: string;
}) {
  const videoRef = useRef<HTMLDivElement>(null);
  const displayName = userName || `User ${user.uid}`;

  useEffect(() => {
    if (videoRef.current && user.videoTrack) {
      console.log(`🎬 Playing video for user ${user.uid}`);
      user.videoTrack.play(videoRef.current);
    }

    // No cleanup needed - track.stop() is handled by agoraService
  }, [user.videoTrack, user.uid]);

  return (
    <div className="relative aspect-video bg-muted/50 flex items-center justify-center rounded-lg overflow-hidden border border-border">
      {user.videoTrack ? (
        <div
          ref={videoRef}
          className="w-full h-full"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-sm text-muted-foreground">{displayName}</p>
            {user.hasVideo === false && (
              <p className="text-xs text-muted-foreground mt-1">📹 Camera off</p>
            )}
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
        {displayName}
      </div>
      {user.audioTrack && (
        <div className="absolute top-4 right-4 bg-green-500 rounded-full p-1.5">
          <Mic className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

interface VideoCallRoomProps {
  roomId: number;
  roomName: string;
  agoraAppId: string;
  agoraToken: string;
  channelName: string;
  uid: string;
  onLeave: () => void;
}

export default function VideoCallRoom({ 
  roomId, 
  roomName,
  agoraAppId,
  agoraToken,
  channelName,
  uid,
  onLeave
}: VideoCallRoomProps) {
  const [roomData, setRoomData] = useState<StudyRoomDto | null>(null);
  const [isSignalRConnected, setIsSignalRConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [currentRoomUserId, setCurrentRoomUserId] = useState<number | null>(null); // 🆕 Store roomUserId
  const [uidToUserNameMap, setUidToUserNameMap] = useState<Map<string, string>>(new Map()); // 🆕 Map Agora uid to userName
  const hasInitializedRef = useRef(false);
  const isCleaningUpRef = useRef(false); // 🆕 Track cleanup to prevent multiple calls
  const localVideoRef = useRef<HTMLDivElement>(null);
  
  // 🆕 Get user info from JWT token
  const getUserInfoFromToken = () => {
    const token = useTokenInfoStorage.getState().token;
    if (!token) return { userId: "", userName: "Unknown" };
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub || payload.userId || "",
        userName: payload.name || payload.username || payload.unique_name || "Unknown"
      };
    } catch {
      return { userId: "", userName: "Unknown" };
    }
  };

  const {
    isConnected,
    isVideoOn,
    isAudioOn,
    isScreenSharing,
    remoteUsers,
    localVideoTrack,
    joinVideoCall,
    leaveVideoCall,
    toggleCamera,
    toggleMicrophone,
    startScreenShare,
    stopScreenShare,
  } = useVideoCall({
    roomId,
    onError: (err) => {
      console.error("Video call error:", err);
      const errorMessage = err.message;
      
      // Provide user-friendly error messages
      if (errorMessage.includes("NOT_READABLE") || errorMessage.includes("Could not start video source")) {
        setError(
          "Unable to access camera/microphone.\n\n" +
          "Possible solutions:\n" +
          "• Close other tabs or applications using your camera\n" +
          "• Check browser permissions for camera/microphone\n" +
          "• Try refreshing the page\n" +
          "• Restart your browser"
        );
      } else if (errorMessage.includes("permission")) {
        setError(
          "Camera/microphone permission denied.\n\n" +
          "Please allow access in your browser settings and refresh the page."
        );
      } else {
        setError(errorMessage);
      }
    },
  });

  // Helper function to get username from uid
  const getUserName = useCallback((uid: string | number): string | undefined => {
    const uidStr = uid.toString();
    const uidNum = typeof uid === 'number' ? uid : parseInt(uid, 10);
    
    // First, check the Map (fastest)
    const mappedName = uidToUserNameMap.get(uidStr);
    if (mappedName) {
      return mappedName;
    }
    
    if (!roomData?.roomUsers) {
      return undefined;
    }
    
    // Try to find by roomUserId (this is the Agora UID!)
    const userByRoomUserId = roomData.roomUsers.find(u => u.roomUserId === uidNum);
    
    if (userByRoomUserId) {
      // Cache it in the map for faster future lookups
      setUidToUserNameMap(prev => new Map(prev).set(uidStr, userByRoomUserId.userName));
      return userByRoomUserId.userName;
    }
    
    return undefined;
  }, [roomData, uidToUserNameMap]);

  // Initialize SignalR and Agora video call
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitializedRef.current) {
      console.log("⏭️ Already initialized, skipping...");
      return;
    }

    const init = async () => {
      try {
        console.log("🟢 START: VideoCallRoom init function");
        console.log("🟢 Props:", { 
          roomId, 
          channelName, 
          agoraAppId, 
          agoraToken: agoraToken?.substring(0, 20) + "...",
          uid 
        });
        
        hasInitializedRef.current = true;

        // 1. Connect SignalR - Get token from Zustand store
        const authStore = useTokenInfoStorage.getState();
        const token = authStore.token;
        
        if (!token) {
          throw new Error("No access token found. Please login again.");
        }

        console.log("🔗 About to connect SignalR...");
        await signalRService.connect(token);
        setIsSignalRConnected(true);
        console.log("✅ SignalR connected");

        // 2. Fetch room data to get user names
        console.log("📋 Fetching room data for usernames...");
        const roomDataResponse = await privateApiService.getRoomById(roomId);
        setRoomData(roomDataResponse);
        console.log("✅ Room data loaded:", roomDataResponse.roomUsers?.length, "users");
        
        // Debug: Log roomUserId and userId comparison
        if (roomDataResponse?.roomUsers) {
          console.log("🔍 Room users detailed info:");
          roomDataResponse.roomUsers.forEach(user => {
            console.log(`  👤 ${user.userName}:`);
            console.log(`     roomUserId: ${user.roomUserId}`);
            console.log(`     userId: ${user.userId}`);
          });
          console.log(`🔍 Current Agora UID from props: ${uid}`);
        }

        // 3. Join room via SignalR
        console.log("🚪 About to join SignalR room:", roomId);
        await signalRService.joinRoom(roomId);
        console.log("✅ Joined SignalR room");

        // 3.5. Set current user's roomUserId immediately from props (don't wait for SignalR)
        // Backend sends uid (roomUserId) in the join response
        if (uid !== null && uid !== undefined) {
          const parsedUid = typeof uid === 'string' ? parseInt(uid, 10) : uid;
          if (!isNaN(parsedUid)) {
            setCurrentRoomUserId(parsedUid);
            console.log("✅ Set current user roomUserId from backend:", parsedUid);
          }
        }

        // 4. Setup SignalR event handlers
        signalRService.on({
          onUserJoined: (user) => {
            console.log("� SignalR onUserJoined triggered:", {
              userName: user.userName,
              roomUserId: user.roomUserId,
              userId: user.userId,
            });
            console.log("�👋 User joined room:", user);
            // Update roomData with new user (avoid duplicates)
            setRoomData((prev) => {
              console.log("📊 Current roomData before add:", {
                hasRoomData: !!prev,
                currentUsersCount: prev?.roomUsers?.length || 0,
                currentUsers: prev?.roomUsers?.map(u => ({ name: u.userName, roomUserId: u.roomUserId })),
              });
              
              if (!prev) return prev;
              
              // Check if user already exists
              const existingUser = prev.roomUsers?.find(u => 
                u.userId === user.userId || u.roomUserId === user.roomUserId
              );
              
              if (existingUser) {
                console.log("⚠️ User already in roomData, skipping add:", user.userName);
                return prev;
              }
              
              console.log("✅ Adding new user to roomData:", user.userName);
              return {
                ...prev,
                roomUsers: [...(prev.roomUsers || []), user],
              };
            });
            // Update username map for quick lookup
            setUidToUserNameMap((prev) => new Map(prev).set(user.roomUserId.toString(), user.userName));
          },
          onUserLeft: (user) => {
            console.log("👋 User left room:", user);
            // Update participants list
          },
          onMessageReceived: (message) => {
            console.log("💬 Message received:", message);
            // Update chat messages
          },
          onMediaStatusUpdated: (update: MediaStatusUpdate) => {
            console.log("📹 Media status updated:", update);
            // Update remote users' media status in UI
            // This syncs camera/mic status across all participants
          },
          onScreenSharingStatusUpdated: (update: ScreenSharingStatusUpdate) => {
            console.log("🖥️ Screen sharing status updated:", update);
            // Update UI when someone starts/stops screen sharing
            // Show/hide screen sharing indicator
          },
          onUserStatusUpdated: (update) => {
            console.log("👤 User status updated:", update);
            // Handle "joined-video", "left-video" status changes
          },
        });

        // 4. Join Agora video call with tokens from props
        // ✅ Use roomUserId from SignalR as Agora UID
        
        // ✅ VALIDATE: Ensure props are not undefined/null FIRST
        if (!agoraAppId || !agoraToken || !channelName) {
          throw new Error(
            "❌ MISSING AGORA CREDENTIALS\n\n" +
            "Props validation failed:\n" +
            `- agoraAppId: ${agoraAppId ? '✅ Present' : '❌ Missing'}\n` +
            `- agoraToken: ${agoraToken ? '✅ Present' : '❌ Missing'}\n` +
            `- channelName: ${channelName ? '✅ Present' : '❌ Missing'}\n\n` +
            "These should come from backend API response (joinData.agoraTokens).\n" +
            "Check parent component props passing."
          );
        }
        
        // DEBUG: Log all props
        console.log("🔍 Props received in VideoCallRoom:", {
          agoraAppId,
          channelName,
          agoraToken: agoraToken?.substring(0, 20) + "...",
          uidFromBackend: uid,
          roomUserId: currentRoomUserId,
        });
        
        // ✅ Use roomUserId as Agora UID (from SignalR UserJoined event)
        // If not available, fallback to uid from backend
        let agoraUid: string | number = 0;
        
        if (currentRoomUserId !== null && currentRoomUserId !== undefined) {
          // Use roomUserId from SignalR (e.g., 101)
          agoraUid = Number(currentRoomUserId);
          console.log("✅ Using roomUserId as Agora UID:", agoraUid);
        } else if (uid !== null && uid !== undefined) {
          // Fallback to uid from backend
          const parsedUid = typeof uid === 'string' ? parseInt(uid, 10) : uid;
          if (!isNaN(parsedUid)) {
            agoraUid = parsedUid;
          } else {
            agoraUid = 0; // Default to 0 if parsing fails
          }
          console.log("⚠️ Fallback: Using backend uid as Agora UID:", agoraUid);
        } else {
          console.warn("⚠️ No valid UID available, using 0");
        }
        
        console.log("🔍 Final UID for Agora:", {
          roomUserId: currentRoomUserId,
          backendUid: uid,
          finalAgoraUid: agoraUid,
          type: typeof agoraUid,
        });
        
        const joinParams = {
          appId: agoraAppId,
          channel: channelName,
          token: agoraToken,
          uid: agoraUid, // Use UID from backend token response
        };
        
        console.log("🔍 Join params object:", joinParams);
        
        await joinVideoCall(joinParams);
        console.log("✅ Joined Agora video call");

      } catch (err) {
        console.error("❌ Initialization error:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize";
        
        // Provide user-friendly error messages
        if (errorMessage.includes("NOT_READABLE") || errorMessage.includes("Could not start video source")) {
          setError(
            "Unable to access camera/microphone.\n\n" +
            "Possible solutions:\n" +
            "• Close other tabs or applications using your camera\n" +
            "• Check browser permissions for camera/microphone\n" +
            "• Try refreshing the page\n" +
            "• Restart your browser"
          );
        } else if (errorMessage.includes("permission")) {
          setError(
            "Camera/microphone permission denied.\n\n" +
            "Please allow access in your browser settings and refresh the page."
          );
        } else {
          setError(errorMessage);
        }
      }
    };

    init();

    return () => {
      console.log("🧹 Cleaning up VideoCallRoom...");
      // 🔥 Only cleanup once when component actually unmounts
      if (!isCleaningUpRef.current) {
        isCleaningUpRef.current = true;
        if (isConnected) {
          leaveVideoCall();
        }
        signalRService.leaveRoom(roomId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Play local video when track is available
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  // Debug: Log remote users changes
  useEffect(() => {
    console.log("👥 Remote users updated:", {
      count: remoteUsers.length,
      users: remoteUsers.map(u => ({
        uid: u.uid,
        hasVideo: !!u.videoTrack,
        hasAudio: !!u.audioTrack
      }))
    });
  }, [remoteUsers]);

  if (error) {
    const isAgoraConfigError = error.includes("INVALID AGORA APP ID") || error.includes("invalid vendor key");
    
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
        <div className={`max-w-2xl w-full text-center p-8 rounded-lg ${
          isAgoraConfigError 
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500' 
            : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <h1 className={`text-2xl font-bold mb-4 ${
            isAgoraConfigError ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {isAgoraConfigError ? '⚠️ Agora Configuration Required' : '❌ Error'}
          </h1>
          
          {isAgoraConfigError ? (
            <div className="text-left space-y-4 text-sm">
              <p className="text-yellow-700 dark:text-yellow-300 font-semibold">
                Your Agora AppId is invalid or expired. Follow these steps to fix it:
              </p>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-3">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-2">1️⃣ Get a valid Agora AppId:</p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>Go to <a href="https://console.agora.io/" target="_blank" className="text-blue-600 underline">https://console.agora.io/</a></li>
                    <li>Sign up or log in</li>
                    <li>Create a new project or select existing one</li>
                    <li>Copy the <strong>AppId</strong> and <strong>AppCertificate</strong></li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-2">2️⃣ Update backend configuration:</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">File: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">FStreak-BE/FStreak.API/appsettings.json</code></p>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto text-left">
{`"Agora": {
  "AppId": "YOUR_NEW_APP_ID",
  "AppCertificate": "YOUR_NEW_APP_CERTIFICATE"
}`}
                  </pre>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-2">3️⃣ Restart backend server</p>
                  <p className="text-gray-700 dark:text-gray-300">Stop and restart your ASP.NET Core backend</p>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-2">4️⃣ Refresh this page</p>
                  <p className="text-gray-700 dark:text-gray-300">Try joining the room again</p>
                </div>
              </div>
              
              <details className="text-left">
                <summary className="cursor-pointer font-semibold text-yellow-700 dark:text-yellow-300">
                  🔍 Technical Details
                </summary>
                <pre className="mt-2 bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                  {error}
                </pre>
              </details>
            </div>
          ) : (
            <div>
              <p className="text-red-500 mb-4 whitespace-pre-wrap">{error}</p>
            </div>
          )}
          
          <button
            onClick={onLeave}
            className={`mt-6 px-6 py-3 rounded-lg font-semibold transition ${
              isAgoraConfigError
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            ← Back to Classrooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Modern UI from FStreak-FE-Temp */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📚</div>
            <div>
              <h1 className="text-xl font-bold">{roomName}</h1>
              <p className="text-sm text-muted-foreground">Room #{roomId}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{remoteUsers.length + 1} members online</span>
              {isSignalRConnected && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full" title="Connected" />
              )}
            </div>
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content - Centered Layout from FStreak-FE-Temp */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Video Grid - Card style from FStreak-FE-Temp */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Local Video - Main Card */}
            <div className={`relative aspect-video bg-muted flex items-center justify-center rounded-lg overflow-hidden border border-border ${
              remoteUsers.length === 0 ? 'col-span-2 lg:col-span-3' : 'col-span-1'
            }`}>
              <div
                ref={localVideoRef}
                className="w-full h-full"
              />
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                      <span className="text-5xl">👤</span>
                    </div>
                    <p className="text-muted-foreground">Camera is off</p>
                    {!localVideoTrack && (
                      <p className="text-xs text-muted-foreground/70 mt-2 max-w-xs mx-auto">
                        Click camera button to enable
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                You {isScreenSharing && "• Sharing"}
              </div>
              {(!isVideoOn || !isAudioOn) && (
                <div className="absolute top-4 right-4 flex gap-2">
                  {!isVideoOn && (
                    <div className="bg-red-500 rounded-full p-1.5">
                      <VideoOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {!isAudioOn && (
                    <div className="bg-red-500 rounded-full p-1.5">
                      <MicOff className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Remote Videos - Card style */}
            {remoteUsers.map((user) => (
              <RemoteVideoCard 
                key={user.uid} 
                user={user} 
                userName={getUserName(user.uid)}
              />
            ))}
          </div>
          {/* Control Bar - Modern Card style from FStreak-FE-Temp */}
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <div className="flex items-center justify-center gap-4">
              {!isConnected ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                  <span>Connecting to video call...</span>
                </div>
              ) : (
                <>
                  {/* Camera Toggle */}
                  <button
                    onClick={toggleCamera}
                    className={`w-14 h-14 rounded-full transition-all flex items-center justify-center ${
                      isVideoOn
                        ? 'bg-secondary hover:bg-secondary/80'
                        : 'bg-destructive hover:bg-destructive/90'
                    }`}
                    title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isVideoOn ? (
                      <Video className="w-6 h-6" />
                    ) : (
                      <VideoOff className="w-6 h-6" />
                    )}
                  </button>

                  {/* Microphone Toggle */}
                  <button
                    onClick={toggleMicrophone}
                    className={`w-14 h-14 rounded-full transition-all flex items-center justify-center ${
                      isAudioOn
                        ? 'bg-secondary hover:bg-secondary/80'
                        : 'bg-destructive hover:bg-destructive/90'
                    }`}
                    title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    {isAudioOn ? (
                      <Mic className="w-6 h-6" />
                    ) : (
                      <MicOff className="w-6 h-6" />
                    )}
                  </button>

                  {/* Screen Share Toggle */}
                  <button
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                    className={`w-14 h-14 rounded-full transition-all flex items-center justify-center ${
                      isScreenSharing
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                  >
                    {isScreenSharing ? (
                      <MonitorOff className="w-6 h-6" />
                    ) : (
                      <Monitor className="w-6 h-6" />
                    )}
                  </button>

                  {/* Leave Call */}
                  <button
                    onClick={() => {
                      leaveVideoCall();
                      onLeave();
                    }}
                    className="w-14 h-14 bg-destructive hover:bg-destructive/90 rounded-full transition-all flex items-center justify-center"
                    title="Leave call"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>

                  {/* Separator */}
                  <div className="h-8 w-px bg-border mx-2" />

                  {/* Chat Button */}
                  <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`w-14 h-14 rounded-full transition-all flex items-center justify-center ${
                      isChatOpen
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    title="Toggle chat"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>

                  {/* Participants Button */}
                  <button
                    onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
                    className={`w-14 h-14 rounded-full transition-all flex items-center justify-center ${
                      isParticipantsOpen
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                    title="Toggle participants"
                  >
                    <Users className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Chat Box */}
      <ChatBox
        roomId={roomId}
        userName={getUserInfoFromToken().userName}
        userId={getUserInfoFromToken().userId}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Participants Panel */}
      <ParticipantsPanel
        roomId={roomId}
        currentUserId={uid}
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        localVideoOn={isVideoOn}
        localAudioOn={isAudioOn}
        remoteUsers={remoteUsers}
      />
    </div>
  );
}
