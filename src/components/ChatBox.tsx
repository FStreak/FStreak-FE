"use client";

import { useState, useEffect, useRef } from "react";
import { signalRService } from "@/services/signalRService";
import { MessageCircle, Send, Smile } from "lucide-react";
import type { RoomMessageDto } from "@/model/studyRoom/studyRoomTypes";

interface ChatBoxProps {
  roomId: number;
  userName: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBox({ roomId, userName, userId, isOpen, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<RoomMessageDto[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup SignalR message listener
  useEffect(() => {
    if (!isOpen) return;

    // Check connection
    const connected = signalRService.isConnected();
    setIsConnected(connected);

    // Listen for messages
    const handleNewMessage = (message: RoomMessageDto) => {
      console.log("💬 New message received:", message);
      setMessages((prev) => [...prev, message]);
    };

    const handleNewEmoji = (message: RoomMessageDto) => {
      console.log("😊 New emoji received:", message);
      setMessages((prev) => [...prev, message]);
    };

    // Register event handlers
    signalRService.on({
      onMessageReceived: handleNewMessage,
    });

    // Add welcome message
    setMessages([
      {
        messageId: 0,
        roomId: roomId,
        content: `Chào mừng ${userName} đến phòng học!`,
        userId: "system",
        userName: "Hệ thống",
        sentAt: new Date().toISOString(),
        messageType: 0,
      },
    ]);

    return () => {
      // Cleanup if needed
    };
  }, [isOpen, userName, roomId]);

  // Send text message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConnected) return;

    try {
      await signalRService.sendMessage(roomId, inputMessage.trim());
      setInputMessage("");
      console.log("✅ Message sent");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  // Send emoji
  const handleSendEmoji = async (emoji: string) => {
    if (!isConnected) return;

    try {
      await signalRService.sendEmoji(roomId, emoji);
      console.log("✅ Emoji sent");
    } catch (error) {
      console.error("❌ Failed to send emoji:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-4 w-96 h-[600px] bg-card dark:bg-card rounded-lg shadow-2xl border border-border flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <h3 className="font-semibold">Chat phòng học</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span className="text-xs">{isConnected ? "Online" : "Offline"}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:bg-white/20 rounded p-1 transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30 dark:bg-muted/30">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.userId === userId;
          const isSystemMessage = msg.userId === "system";

          if (isSystemMessage) {
            return (
              <div key={`${msg.messageId}-${index}`} className="flex justify-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-xs">
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={`${msg.messageId}-${index}`}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                {!isOwnMessage && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                      {msg.userName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {msg.userName}
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isOwnMessage
                      ? "bg-blue-500 dark:bg-blue-600 text-white rounded-br-none"
                      : "bg-card dark:bg-card border border-border text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(msg.sentAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji picker */}
      <div className="px-4 py-2 border-t border-border bg-card flex gap-2">
        {["👍", "❤️", "😊", "🎉", "🔥", "💯"].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleSendEmoji(emoji)}
            disabled={!isConnected}
            className="text-xl hover:scale-125 transition-transform disabled:opacity-50"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={
              isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."
            }
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border border-input bg-background text-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-muted disabled:text-muted-foreground text-white p-2 rounded-full transition-colors disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
