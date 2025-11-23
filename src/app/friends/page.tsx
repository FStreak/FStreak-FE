"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import FriendList from "@/components/friends/FriendList";
import FriendRequests from "@/components/friends/FriendRequests";
import UserSearchForFriends from "@/components/friends/UserSearchForFriends";
import { Users, UserPlus, Search } from "lucide-react";

type Tab = "friends" | "requests" | "search";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("friends");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Bạn Bè
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Kết nối và tương tác với những người học cùng bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "friends"
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            <Users className="w-5 h-5" />
            Danh sách bạn bè
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Lời mời kết bạn
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === "search"
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
            }`}
          >
            <Search className="w-5 h-5" />
            Tìm bạn mới
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === "friends" && <FriendList />}
          {activeTab === "requests" && <FriendRequests />}
          {activeTab === "search" && <UserSearchForFriends />}
        </div>
      </main>
    </div>
  );
}

