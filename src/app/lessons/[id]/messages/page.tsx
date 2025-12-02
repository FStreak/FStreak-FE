"use client";

import React from "react";
import { MessageCircle, Mail, Clock } from "lucide-react";

export default function MessagesPage() {
  const messages = [
    {
      id: 1,
      sender: "Instructor",
      content: "Reminder: Office hours tomorrow at 10 AM.",
      time: "2h ago",
      isNew: true,
    },
    {
      id: 2,
      sender: "System",
      content: "Your course progress has been updated successfully.",
      time: "1d ago",
      isNew: false,
    },
    {
      id: 3,
      sender: "Support",
      content: "We received your feedback. Thank you for helping us improve!",
      time: "3d ago",
      isNew: false,
    },
  ];

  return (
    <div className="space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
              Messages
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Stay connected with your instructors and system updates.
            </p>
          </div>
          <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-xl shadow-sm">
            <Mail className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        {/* Messages List */}
        <div className="rounded-2xl border border-[#FFEBD2] bg-white/95 shadow-sm overflow-hidden">
          <ul>
            {messages.map((msg, idx) => (
              <li
                key={msg.id}
                className={`flex items-start justify-between p-6 transition-all ${
                  msg.isNew
                    ? "bg-gradient-to-r from-[#FFF8F0] to-[#FFF6EB]"
                    : "hover:bg-[#FFF9F4]"
                } ${
                  idx !== messages.length - 1 ? "border-b border-[#FFEBD2]" : ""
                }`}
              >
                {/* Left side: icon + text */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {msg.sender}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>

                {/* Right side: time + badge */}
                <div className="flex flex-col items-end gap-1 text-xs text-gray-500 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{msg.time}</span>
                  </div>
                  {msg.isNew && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 font-medium">
                      New
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}
