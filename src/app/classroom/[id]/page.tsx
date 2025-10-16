"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { privateApiService } from "@/services/ApiPrivate";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import type { JoinRoomResponse, StudyRoomDto } from "@/model/studyRoom/studyRoomTypes";
import { ArrowLeft, Users, Clock, Lock } from "lucide-react";

// ✅ Dynamic import to prevent SSR issues with Agora RTC SDK
const VideoCallRoom = dynamic(() => import("@/components/VideoCallRoom"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading video call...</p>
      </div>
    </div>
  ),
});

export default function ClassroomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = Number(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<StudyRoomDto | null>(null);
  const [joinData, setJoinData] = useState<JoinRoomResponse | null>(null);
  const [hasJoined, setHasJoined] = useState(false);

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setIsLoading(true);
        const room = await privateApiService.getRoomById(roomId);
        setRoomData(room);
        console.log("✅ Room details loaded:", room);
      } catch (err) {
        console.error("❌ Failed to fetch room details:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load room";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  // Join room with video call tokens
  const handleJoinRoom = async () => {
    try {
      setIsJoining(true);
      console.log("🚪 Joining room:", roomId);

      // ✅ Call API with includeTokens=true to get Agora tokens
      const response = await privateApiService.joinRoom(roomId, true);
      
      console.log("✅ Join room response:", response);
      console.log("🔑 Full Agora Tokens:", JSON.stringify(response.agoraTokens, null, 2));
      console.log("🔑 Agora AppId from backend:", response.agoraTokens?.appId);
      console.log("🎫 Agora Token FULL:", response.agoraTokens?.token);
      console.log("🎫 Token Length:", response.agoraTokens?.token?.length);
      console.log("🎫 Token First 50 chars:", response.agoraTokens?.token?.substring(0, 50));
      console.log("📺 Channel Name:", response.agoraTokens?.channelName);
      console.log("🆔 UID from backend:", response.agoraTokens?.uid);
      console.log("⏰ Token expiration:", response.agoraTokens?.expiration);
      
      // 🔍 TOKEN FORMAT CHECK
      if (response.agoraTokens?.token) {
        const token = response.agoraTokens.token;
        console.log("\n🔍 TOKEN FORMAT ANALYSIS:");
        console.log("  Version prefix:", token.substring(0, 3));
        
        if (token.startsWith("007eJx")) {
          console.log("  ✅ CORRECT: Token uses compressed format (007eJx...)");
          console.log("  ✅ Backend is using RtcTokenBuilder2!");
        } else if (token.startsWith("007" + response.agoraTokens.appId)) {
          console.log("  ❌ ERROR: Token contains AppId after version!");
          console.log("  ❌ Format: 007 + AppId + content (WRONG!)");
          console.log("  ❌ Backend is still using OLD RtcTokenBuilder!");
          console.log("  🔧 FIX: Make sure backend code was rebuilt and restarted");
        } else if (token.startsWith("007")) {
          console.log("  ⚠️ Token starts with 007 but format unclear");
          console.log("  Next chars:", token.substring(3, 10));
        } else {
          console.log("  ❌ Unknown token format!");
        }
      }
      
      // Validate that we got Agora tokens
      if (!response.agoraTokens || !response.agoraTokens.appId || !response.agoraTokens.token) {
        throw new Error(
          "⚠️ Backend did not return valid Agora tokens.\n\n" +
          "Please check:\n" +
          "1. Backend Agora configuration in appsettings.json\n" +
          "2. Make sure AppId and AppCertificate are set correctly\n" +
          "3. Restart your backend server\n\n" +
          "Response received: " + JSON.stringify(response.agoraTokens, null, 2)
        );
      }
      
      // ✅ AppId validation removed - using valid AppId from Agora Console
      
      // 🟢 Use token from backend (no more hardcode)
      // const AGORA_CONSOLE_TOKEN = "007eJxTYOA1WuD3qGyN5+R1qv9kZ0/dnW35pfTnXN2onfNO/Jz1bdM3BYa0RKNkM0sT8zRDk2QT49SkxERDs8Qkg7TU5GRzU7Mki4ANHzIaAhkZfILfMDMyQCCIz8ZQlJ+fG2/OwAAAg9IkAw==";
      // const AGORA_CONSOLE_APPID = "fa2c6947f14c43ebaa16ab0fecc756b8"; // AppId của bạn
      // if (response.agoraTokens) {
      //   response.agoraTokens.token = AGORA_CONSOLE_TOKEN;
      //   response.agoraTokens.appId = AGORA_CONSOLE_APPID;
      // }
      
      setJoinData(response);
      setHasJoined(true);
      toast.success("Joined room successfully! 🎉");
    } catch (err) {
      console.error("❌ Failed to join room:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to join room";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  // Leave room
  const handleLeaveRoom = async () => {
    try {
      await privateApiService.leaveRoom(roomId);
      toast.success("Left room successfully");
      router.push("/classrooms");
    } catch (err) {
      console.error("❌ Failed to leave room:", err);
      toast.error("Failed to leave room");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error && !roomData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4 text-lg font-semibold">{error}</p>
          <button
            onClick={() => router.push("/classrooms")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md"
          >
            Back to Classrooms
          </button>
        </div>
      </div>
    );
  }

  // If not joined yet, show room preview
  if (!hasJoined && roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.push("/classrooms")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Classrooms
          </button>

          {/* Room preview card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {roomData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {roomData.description}
                </p>
              </div>
              {roomData.isPrivate && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Private</span>
                </div>
              )}
            </div>

            {/* Room info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <Users className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {roomData.roomUsers.filter(u => u.isOnline).length}/{roomData.roomUsers.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    {new Date(roomData.startTime).toLocaleDateString()} - {new Date(roomData.endTime).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {roomData.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>

            {/* Host info */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hosted by</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {roomData.createdBy.firstName} {roomData.createdBy.lastName}
              </p>
            </div>

            {/* Join button */}
            <button
              onClick={handleJoinRoom}
              disabled={isJoining || !roomData.isActive}
              className="w-full py-4 text-white text-lg font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Joining...
                </span>
              ) : !roomData.isActive ? (
                "Room is not active"
              ) : (
                "Join Room with Video Call"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If joined, show video call room
  if (hasJoined && joinData && roomData) {
    // Type guard to ensure agoraTokens exists
    const agoraTokens = joinData.agoraTokens;
    if (!agoraTokens) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">Error: No Agora tokens available</p>
        </div>
      );
    }

    return (
      <VideoCallRoom
        roomId={roomId}
        roomName={roomData.name}
        agoraAppId={agoraTokens.appId}
        agoraToken={agoraTokens.token}
        channelName={agoraTokens.channelName}
        uid={agoraTokens.uid}
        onLeave={handleLeaveRoom}
      />
    );
  }

  return null;
}
