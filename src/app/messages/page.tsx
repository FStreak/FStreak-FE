"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import ConversationList from "@/components/messages/ConversationList";
import ChatWindow from "@/components/messages/ChatWindow";
import type { Conversation } from "@/model/messages/messageTypes";
import { privateApiService } from "@/services/ApiPrivate";
import { MessageCircle } from "lucide-react";

function MessagesContent() {
  const searchParams = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
    
    // Listen for conversation created event to refresh
    const handleConversationCreated = () => {
      setTimeout(async () => {
        await fetchConversations();
        // After refresh, try to find and select the conversation
        const userId = searchParams?.get("userId");
        if (userId) {
          const response = await privateApiService.getConversations();
          const convs = response.conversations || [];
          const foundConversation = convs.find(c => c.otherUserId === userId);
          if (foundConversation) {
            setSelectedConversation(foundConversation);
          }
        }
      }, 500);
    };
    window.addEventListener('conversationCreated', handleConversationCreated);
    
    return () => {
      window.removeEventListener('conversationCreated', handleConversationCreated);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await privateApiService.getConversations();
      const convs = response.conversations || [];
      setConversations(convs);
      
      // After fetching, check if we need to select a conversation from query params
      const userId = searchParams?.get("userId");
      if (userId && convs.length > 0) {
        const foundConversation = convs.find(c => c.otherUserId === userId);
        if (foundConversation) {
          setSelectedConversation(foundConversation);
        } else {
          // Conversation doesn't exist yet, create a temporary one
          // We'll need to get user info from friends list or create conversation on first message
          const tempConversation: Conversation = {
            id: `temp-${userId}`,
            userId: "",
            otherUserId: userId,
            otherUserName: "Người dùng",
            otherUserUsername: "",
            lastMessage: "",
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            isOnline: false
          };
          setSelectedConversation(tempConversation);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Handle direct navigation to a specific user
  useEffect(() => {
    const userId = searchParams?.get("userId");
    if (userId && conversations.length > 0) {
      const foundConversation = conversations.find(c => c.otherUserId === userId);
      if (foundConversation) {
        setSelectedConversation(foundConversation);
      } else {
        // Try to get user info from friends list
        privateApiService.getFriends().then(response => {
          const friend = response.friends?.find(f => f.friendId === userId);
          if (friend) {
            const tempConversation: Conversation = {
              id: `temp-${userId}`,
              userId: "",
              otherUserId: userId,
              otherUserName: friend.friendName || "Người dùng",
              otherUserUsername: friend.friendUsername || "",
              lastMessage: "",
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0,
              isOnline: false
            };
            setSelectedConversation(tempConversation);
          }
        }).catch(() => {
          // If can't get friend info, just create temp conversation
          const tempConversation: Conversation = {
            id: `temp-${userId}`,
            userId: "",
            otherUserId: userId,
            otherUserName: "Người dùng",
            otherUserUsername: "",
            lastMessage: "",
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            isOnline: false
          };
          setSelectedConversation(tempConversation);
        });
      }
    }
  }, [searchParams, conversations]);

  return (
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
            onSelectConversation={(conv) => {
              setSelectedConversation(conv);
              // Refresh conversations when selecting
              fetchConversations();
            }}
            selectedConversationId={selectedConversation?.id}
          />
        </div>

        {/* Chat Window */}
        <div className="h-full">
          <ChatWindow conversation={selectedConversation} />
        </div>
      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <Suspense
        fallback={
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-[calc(100vh-250px)] min-h-[500px]">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-500">Đang tải...</p>
              </div>
            </div>
          </main>
        }
      >
        <MessagesContent />
      </Suspense>
    </div>
  );
}

