"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import type { Conversation } from "@/model/messages/messageTypes";
import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Handle direct navigation to a specific user
  useEffect(() => {
    const userId = searchParams?.get("userId");
    if (userId) {
      // Create a temporary conversation object
      // In a real app, you'd fetch the actual conversation or create one
      // For now, we'll just let the user start chatting
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Tin Nhắn
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Trò chuyện với bạn bè của bạn
          </p>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] gap-4 h-[calc(100vh-250px)] min-h-[500px]">
          {/* Conversations List */}
          <div className="h-full">
            <ConversationList
              onSelectConversation={setSelectedConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>

          {/* Chat Window */}
          <div className="h-full">
            <ChatWindow conversation={selectedConversation} />
          </div>
        </div>
      </main>
    </div>
  );
}

