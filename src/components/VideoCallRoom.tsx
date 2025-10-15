"use client";

import { useEffect, useState, useRef } from "react";
import { useVideoCall } from "@/hooks/useVideoCall";
import { signalRService } from "@/services/signalRService";
import { privateApiService } from "@/services/ApiPrivate";
import type { StudyRoomDto, MediaStatusUpdate, ScreenSharingStatusUpdate } from "@/model/studyRoom/studyRoomTypes";
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Phone, PhoneOff } from "lucide-react";

interface VideoCallRoomProps {
  roomId: number;
}

export default function VideoCallRoom({ roomId }: VideoCallRoomProps) {
  const [roomData, setRoomData] = useState<StudyRoomDto | null>(null);
  const [isSignalRConnected, setIsSignalRConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);

  const {
    isConnected,
    isVideoOn,
    isAudioOn,
    isScreenSharing,
    remoteUsers,
    localVideoTrack,
    localAudioTrack,
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
      setError(err.message);
    },
  });

  // Initialize SignalR and load room data
  useEffect(() => {
    const init = async () => {
      try {
        // 1. Load room data
        const response = await privateApiService.getRoomById(roomId);
        setRoomData(response.data);

        // 2. Connect SignalR
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        await signalRService.connect(token);
        setIsSignalRConnected(true);

        // 3. Join room via SignalR
        await signalRService.joinRoom(roomId);

        // 4. Setup SignalR event handlers
        signalRService.on({
          onMediaStatusUpdated: (update: MediaStatusUpdate) => {
            console.log("Media status updated:", update);
            // Update UI based on other users' media status
          },
          onScreenSharingStatusUpdated: (update: ScreenSharingStatusUpdate) => {
            console.log("Screen sharing status updated:", update);
            // Update UI when someone starts/stops screen sharing
          },
          onUserStatusUpdated: (update) => {
            console.log("User status updated:", update);
          },
        });

      } catch (err) {
        console.error("Initialization error:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize");
      }
    };

    init();

    return () => {
      if (isConnected) {
        leaveVideoCall();
      }
      signalRService.leaveRoom(roomId);
    };
  }, [roomId]);

  // Play local video when track is available
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{roomData.name}</h1>
            <p className="text-sm text-gray-400">{roomData.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {roomData.roomUsers.filter(u => u.isOnline).length} participants
            </span>
            {isSignalRConnected && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
        </div>
      </header>

      {/* Video Grid */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className={`grid gap-4 h-full ${
          remoteUsers.length === 0 ? 'grid-cols-1' :
          remoteUsers.length === 1 ? 'grid-cols-2' :
          remoteUsers.length <= 4 ? 'grid-cols-2 grid-rows-2' :
          'grid-cols-3 grid-rows-3'
        }`}>
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div
              ref={localVideoRef}
              className="w-full h-full"
            />
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              You {isScreenSharing && "(Sharing)"}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {!isVideoOn && <VideoOff className="w-5 h-5 text-red-500" />}
              {!isAudioOn && <MicOff className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          {/* Remote Videos */}
          {remoteUsers.map((user) => (
            <div key={user.uid} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={(ref) => {
                  if (ref && user.videoTrack) {
                    user.videoTrack.play(ref);
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!user.videoTrack && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <VideoOff className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                User {user.uid}
              </div>
              {user.audioTrack && (
                <div className="absolute top-4 right-4">
                  <Mic className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Controls */}
      <footer className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center gap-4">
          {!isConnected ? (
            <button
              onClick={joinVideoCall}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <Phone className="w-5 h-5" />
              Join Video Call
            </button>
          ) : (
            <>
              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                className={`p-4 rounded-full transition-colors ${
                  isVideoOn
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <VideoOff className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Microphone Toggle */}
              <button
                onClick={toggleMicrophone}
                className={`p-4 rounded-full transition-colors ${
                  isAudioOn
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isAudioOn ? (
                  <Mic className="w-6 h-6 text-white" />
                ) : (
                  <MicOff className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Screen Share Toggle */}
              <button
                onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                className={`p-4 rounded-full transition-colors ${
                  isScreenSharing
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                {isScreenSharing ? (
                  <MonitorOff className="w-6 h-6 text-white" />
                ) : (
                  <Monitor className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Leave Call */}
              <button
                onClick={leaveVideoCall}
                className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                title="Leave call"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
