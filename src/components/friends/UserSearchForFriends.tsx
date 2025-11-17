"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { privateApiService } from "@/services/ApiPrivate";
import type { UserProfile } from "@/model/authModel/authDataType";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function UserSearchForFriends() {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const filtered = allUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const username = user.userName.toLowerCase();
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || username.includes(search);
    });

    setResults(filtered.slice(0, 10)); // Limit to 10 results
  }, [searchTerm, allUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await privateApiService.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string, userName: string) => {
    try {
      setSendingTo(userId);
      const response = await privateApiService.sendFriendRequest({ receiverId: userId });
      console.log("Friend request sent successfully:", response);
      showToast(`Đã gửi lời mời kết bạn đến ${userName}`, "success");
      // Remove from results after sending
      setResults(results.filter((u) => u.id !== userId));
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      const message = error.response?.data?.message || error.response?.data?.title || error.message || "Không thể gửi lời mời kết bạn";
      showToast(message, "error");
    } finally {
      setSendingTo(null);
    }
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm người dùng để kết bạn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2"
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
        </div>
      )}

      {searchTerm && results.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleViewProfile(user.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.firstName?.[0]?.toUpperCase() || user.userName[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{user.userName}
                      </p>
                    </div>
                    <div className="text-sm text-orange-500 font-semibold flex-shrink-0">
                      🔥 {user.currentStreak}
                    </div>
                  </button>
                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(user.id, user.userName)}
                    disabled={sendingTo === user.id}
                    className="ml-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white flex-shrink-0"
                  >
                    {sendingTo === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Kết bạn
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

