"use client";

import { useEffect, useState, useRef } from "react";
import { privateApiService } from "@/services/ApiPrivate";
import type { Conversation, Message } from "@/model/messages/messageTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "@/lib/toast";

interface ChatWindowProps {
  conversation: Conversation | null;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (conversation) {
      // Don't fetch messages if it's a temporary conversation (not created yet)
      if (conversation.id && !conversation.id.startsWith("temp-")) {
        fetchMessages();
      } else {
        setMessages([]);
        setLoading(false);
      }
    } else {
      setMessages([]);
    }
  }, [conversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!conversation || conversation.id?.startsWith("temp-")) return;

    try {
      setLoading(true);
      const response = await privateApiService.getMessages({
        conversationId: conversation.id,
        page: 1,
        pageSize: 100,
      });
      setMessages(response.messages || []);
      
      // Mark messages as read
      if (conversation.unreadCount > 0) {
        await privateApiService.markMessagesAsRead({
          conversationId: conversation.id,
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!conversation || !messageText.trim() || sending) return;

    try {
      setSending(true);
      const newMessage = await privateApiService.sendMessage({
        receiverId: conversation.otherUserId,
        content: messageText.trim(),
      });
      
      // If this was a temp conversation, the backend created a real one
      // Trigger event to refresh conversations list
      if (conversation.id?.startsWith("temp-")) {
        window.dispatchEvent(new CustomEvent('conversationCreated'));
      }
      
      setMessages([...messages, newMessage]);
      setMessageText("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMyMessage = (message: Message) => {
    return message.senderId !== conversation?.otherUserId;
  };

  if (!conversation) {
    return (
      <Card className="h-full">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
          <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Chọn một hội thoại để bắt đầu nhắn tin
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-900 rounded-t-lg">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold">
            {conversation.otherUserName?.[0]?.toUpperCase() || "?"}
          </div>
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            {conversation.otherUserName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            @{conversation.otherUserUsername}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMyMessage(message)
                      ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-tr-none"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isMyMessage(message)
                        ? "text-white/70"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-lg">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Nhập tin nhắn..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!messageText.trim() || sending}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:opacity-90"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

