"use client";

import { useState, useEffect } from "react";
import { signalRService } from "@/services/signalRService";
import { Users, Video, VideoOff, Mic, MicOff, Monitor, Hand } from "lucide-react";
import type { RoomUserDto, MediaStatusUpdate } from "@/model/studyRoom/studyRoomTypes";

interface ParticipantsPanelProps {
  roomId: number;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
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
}: ParticipantsPanelProps) {
  const [participants, setParticipants] = useState<ParticipantWithStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Check connection
    const connected = signalRService.isConnected();
    setIsConnected(connected);

    // Listen for participant events
    const handleUserJoined = (user: RoomUserDto) => {
      console.log("👤 User joined:", user);
      setParticipants((prev) => {
        const exists = prev.find((p) => p.userId === user.userId);
        if (!exists) {
          return [...prev, { ...user, isVideoOn: false, isAudioOn: false }];
        }
        return prev;
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
    <div className="fixed right-4 bottom-4 w-80 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Users size={20} />
          <h3 className="font-semibold">Người tham gia</h3>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {participants.length + 1}
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
        <div className="p-3 bg-yellow-50 border-b border-yellow-200 text-yellow-700 text-sm">
          ⚠️ Đang kết nối lại...
        </div>
      )}

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {/* Current User */}
        <div className="p-3 border-b bg-blue-50 hover:bg-blue-100 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                You
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Bạn
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                    Host
                  </span>
                </p>
                <p className="text-xs text-gray-500">Đang trong phòng</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="p-1.5 rounded bg-green-100 text-green-600">
                <Video size={14} />
              </div>
              <div className="p-1.5 rounded bg-green-100 text-green-600">
                <Mic size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Other Participants */}
        {participants.map((participant, index) => {
          const isCurrentUser = participant.userId === currentUserId;
          if (isCurrentUser) return null;

          return (
            <div
              key={`${participant.userId}-${index}`}
              className="p-3 border-b hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {participant.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {participant.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {participant.isScreenSharing ? "🖥️ Đang chia sẻ màn hình" : "Đang trong phòng"}
                    </p>
                  </div>
                </div>

                {/* Media Status Icons */}
                <div className="flex items-center space-x-1">
                  <div
                    className={`p-1.5 rounded ${
                      participant.isVideoOn
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
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
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {participant.isAudioOn ? (
                      <Mic size={14} />
                    ) : (
                      <MicOff size={14} />
                    )}
                  </div>
                  {participant.isScreenSharing && (
                    <div className="p-1.5 rounded bg-blue-100 text-blue-600">
                      <Monitor size={14} />
                    </div>
                  )}
                  {participant.isHandRaised && (
                    <div className="p-1.5 rounded bg-yellow-100 text-yellow-600">
                      <Hand size={14} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {participants.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Chưa có người tham gia khác</p>
            <p className="text-xs mt-1">
              Chia sẻ link phòng để mời bạn bè
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          💡 Tip: Biểu tượng hiển thị trạng thái camera/mic
        </div>
      </div>
    </div>
  );
}
