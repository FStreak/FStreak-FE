"use client";

import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Classroom } from "@/utils/mockData";

interface ClassRoomCardProps {
  classroom: Classroom;
}

export default function ClassRoomCard({ classroom }: ClassRoomCardProps) {
  const router = useRouter();
  
  const handleJoin = () => {
    router.push(`/classroom/${classroom.id}`);
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{classroom.icon}</div>
        <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">
          {classroom.theme}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{classroom.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {classroom.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
          <Users className="w-4 h-4" />
          <span>{classroom.participants} members</span>
        </div>
        <Button 
          size="sm" 
          onClick={handleJoin}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:opacity-90"
        >
          Join
        </Button>
      </div>
    </Card>
  );
}
