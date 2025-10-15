"use client";

import { useParams, useRouter } from "next/navigation";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockClassrooms } from "@/utils/mockData";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ClassroomRoomPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const classroom = mockClassrooms.find(c => c.id === id);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  if (!classroom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="p-8 text-center bg-white dark:bg-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Classroom Not Found</h2>
          <Link href="/classrooms">
            <Button className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white">
              Back to Classrooms
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleLeave = () => {
    router.push("/classrooms");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{classroom.icon}</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">{classroom.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{classroom.theme}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{classroom.participants} members online</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Video Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Main User Video */}
            <Card className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center col-span-2 lg:col-span-3 border-2 border-purple-200 dark:border-purple-700 shadow-lg">
              {isVideoOn ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center mb-4 mx-auto shadow-lg">
                      <span className="text-5xl">👤</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Your Video</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Camera is off</p>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                You
              </div>
            </Card>

            {/* Other Participants Placeholder */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 shadow-md">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center mx-auto mb-2 shadow-md">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Participant {i}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Control Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant={isVideoOn ? "secondary" : "destructive"}
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-14 h-14 rounded-full shadow-lg ${
                  isVideoOn 
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" 
                    : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                }`}
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>
              
              <Button
                size="lg"
                variant={isAudioOn ? "secondary" : "destructive"}
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`w-14 h-14 rounded-full shadow-lg ${
                  isAudioOn 
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" 
                    : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                }`}
              >
                {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>

              <Button
                size="lg"
                variant="destructive"
                onClick={handleLeave}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
