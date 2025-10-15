"use client";

import { Users, Lock, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { StudyRoomDto } from "@/model/studyRoom/studyRoomTypes";

interface ClassRoomCardProps {
  classroom: StudyRoomDto;
}

export default function ClassRoomCard({ classroom }: ClassRoomCardProps) {
  const router = useRouter();
  
  const handleJoin = () => {
    router.push(`/classroom/${classroom.studyRoomId}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Get online users count
  const onlineUsers = classroom.roomUsers.filter(u => u.isOnline).length;

  // Get theme icon based on room name (simple logic)
  const getIcon = () => {
    const name = classroom.name.toLowerCase();
    if (name.includes("programming") || name.includes("code") || name.includes("lập trình")) return "💻";
    if (name.includes("math") || name.includes("toán")) return "📐";
    if (name.includes("english") || name.includes("anh")) return "📚";
    if (name.includes("physics") || name.includes("vật lý")) return "⚡";
    if (name.includes("chemistry") || name.includes("hóa")) return "🧪";
    return "📖";
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{getIcon()}</div>
        <div className="flex items-center gap-2">
          {classroom.isPrivate && (
            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Private
            </div>
          )}
          {classroom.isActive && (
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
              Active
            </div>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white line-clamp-1">
        {classroom.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
        {classroom.description}
      </p>

      {/* Creator info */}
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
        <User className="w-3 h-3" />
        <span>
          by {classroom.createdBy.firstName} {classroom.createdBy.lastName}
        </span>
      </div>

      {/* Time info */}
      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="w-3 h-3" />
        <span>
          {formatDate(classroom.startTime)} - {formatDate(classroom.endTime)}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
          <Users className="w-4 h-4" />
          <span>
            {onlineUsers}/{classroom.roomUsers.length} online
          </span>
        </div>
        <Button 
          size="sm" 
          onClick={handleJoin}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:opacity-90"
        >
          Join
        </Button>
      </div>

      {/* Invite code if available */}
      {classroom.inviteCode && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Code: <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{classroom.inviteCode}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

