"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Lock, 
  Globe, 
  Calendar, 
  Clock,
  Video,
  Copy,
  Check,
  Plus,
  Key
} from "lucide-react";
import { privateApiService } from "@/services/ApiPrivate";
import type { StudyRoomDto } from "@/model/studyRoom/studyRoomTypes";
import { CreateRoomForm } from "./CreateRoomDialog";
import { JoinRoomByCode } from "./JoinRoomByCode";

type ViewMode = "list" | "create" | "join";

export function RoomList() {
  const router = useRouter();
  const [rooms, setRooms] = useState<StudyRoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const activeRooms = await privateApiService.getActiveRooms();
      setRooms(activeRooms);
      setError(null);
    } catch (err) {
      console.error("Failed to load rooms:", err);
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: number) => {
    try {
      const response = await privateApiService.joinRoom(roomId, true);
      console.log("Joined room:", response);
      
      // Navigate to the room
      router.push(`/classroom/${roomId}`);
    } catch (err) {
      console.error("Failed to join room:", err);
      alert("Failed to join room. Please try again.");
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (viewMode === "create") {
    return (
      <CreateRoomForm
        onRoomCreated={(room) => {
          setRooms([room, ...rooms]);
          setViewMode("list");
          // Auto join the created room
          router.push(`/classroom/${room.studyRoomId}`);
        }}
        onCancel={() => setViewMode("list")}
      />
    );
  }

  if (viewMode === "join") {
    return (
      <JoinRoomByCode
        onJoined={(response) => {
          // Navigate to the joined room
          const roomId = response.roomUser.roomUserId; // Get room ID from response
          router.push(`/classroom/${roomId}`);
        }}
        onCancel={() => setViewMode("list")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Rooms</h1>
          <p className="text-muted-foreground mt-1">
            Join active study rooms or create your own
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode("join")} className="gap-2">
            <Key className="w-4 h-4" />
            Join by Code
          </Button>
          <Button onClick={() => setViewMode("create")} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Room
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : rooms.length === 0 ? (
        /* Empty State */
        <Card className="p-12 text-center">
          <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No active rooms</h3>
          <p className="text-muted-foreground mb-6">
            Create a new study room to get started
          </p>
          <Button onClick={() => setViewMode("create")} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Room
          </Button>
        </Card>
      ) : (
        /* Room Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card key={room.studyRoomId} className="p-6 hover:shadow-lg transition-shadow">
              {/* Room Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {room.description || "No description"}
                  </p>
                </div>
                <div className="ml-2">
                  {room.isPrivate ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Globe className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Room Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{room.roomUsers.length} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(room.startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Ends {formatDateTime(room.endTime)}</span>
                </div>
              </div>

              {/* Invite Code */}
              {room.isPrivate && room.inviteCode && (
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Invite Code</p>
                      <p className="font-mono font-semibold">{room.inviteCode}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyInviteCode(room.inviteCode!)}
                    >
                      {copiedCode === room.inviteCode ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Join Button */}
              <Button
                className="w-full"
                onClick={() => handleJoinRoom(room.studyRoomId)}
              >
                <Video className="w-4 h-4 mr-2" />
                Join Room
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
