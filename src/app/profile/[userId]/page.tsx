"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { privateApiService } from "@/services/ApiPrivate";
import type { UserProfile } from "@/model/authModel/authDataType";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTokenInfoStorage } from "@/store/authStore";
import { MessageCircle, UserPlus, Loader2 } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const { userId: currentUserId } = useTokenInfoStorage();

  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [friendshipStatus, setFriendshipStatus] = useState<"none" | "pending" | "friend">("none");
  const [sendingRequest, setSendingRequest] = useState<boolean>(false);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try to get user by ID
      const user = await privateApiService.getUserById(userId);
      setData(user);
    } catch (e: any) {
      console.error("Error fetching user profile:", e);
      setError(e.message || "Không thể tải hồ sơ người dùng");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      checkFriendshipStatus();
    }
  }, [userId, currentUserId]);

  const checkFriendshipStatus = async () => {
    if (!userId || !currentUserId || userId === currentUserId) return;
    
    try {
      // Check if already friends
      const friendsResponse = await privateApiService.getFriends();
      const isAlreadyFriend = friendsResponse.friends?.some(f => f.friendId === userId);
      
      if (isAlreadyFriend) {
        setIsFriend(true);
        setFriendshipStatus("friend");
        return;
      }
      
      // Check if there's a pending request
      const requestsResponse = await privateApiService.getFriendRequests();
      const hasPendingRequest = requestsResponse.sent?.some(r => r.receiverId === userId) ||
                                requestsResponse.received?.some(r => r.senderId === userId);
      
      if (hasPendingRequest) {
        setFriendshipStatus("pending");
      } else {
        setFriendshipStatus("none");
      }
    } catch (error) {
      console.error("Error checking friendship status:", error);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!userId || sendingRequest) return;
    
    try {
      setSendingRequest(true);
      await privateApiService.sendFriendRequest({ receiverId: userId });
      setFriendshipStatus("pending");
      showToast("Đã gửi lời mời kết bạn", "success");
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      const message = error.response?.data?.message || "Không thể gửi lời mời kết bạn";
      showToast(message, "error");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleMessage = () => {
    router.push(`/messages?userId=${userId}`);
  };

  const isViewingOwnProfile = currentUserId === userId;

  const fullName = data ? `${data.firstName} ${data.lastName}`.trim() : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="space-y-10">
          {loading ? (
            <Card className="border-none shadow-md bg-white dark:bg-gray-900">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">Đang tải...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-none shadow-md bg-white dark:bg-gray-900">
              <CardContent className="p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchUserProfile}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg"
                >
                  Thử lại
                </button>
              </CardContent>
            </Card>
          ) : data ? (
            <>
              <Card className="border-none shadow-md hover:shadow-lg bg-white dark:bg-gray-900 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-orange-400 shadow-md bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {data.firstName?.[0]?.toUpperCase() || data.userName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent mb-2">
                        {fullName || data.userName}
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        @{data.userName}
                      </p>

                      {/* Streak Info */}
                      <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🔥</span>
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Streak hiện tại</p>
                            <p className="text-xl font-bold text-orange-500">{data.currentStreak}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Streak dài nhất</p>
                            <p className="text-xl font-bold text-orange-500">{data.longestStreak}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Only show if viewing other user's profile */}
                      {!isViewingOwnProfile && (
                        <div className="flex gap-3 mt-4">
                          {isFriend ? (
                            <Button
                              onClick={handleMessage}
                              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Nhắn tin
                            </Button>
                          ) : friendshipStatus === "pending" ? (
                            <Button
                              disabled
                              variant="outline"
                              className="text-gray-500"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Đã gửi lời mời
                            </Button>
                          ) : (
                            <Button
                              onClick={handleSendFriendRequest}
                              disabled={sendingRequest}
                              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white"
                            >
                              {sendingRequest ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <UserPlus className="w-4 h-4 mr-2" />
                              )}
                              Kết bạn
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="border-none shadow-md bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    Thông tin
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{data.email || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-1">Tham gia</p>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {data.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "Chưa có thông tin"}
                      </p>
                    </div>
                    {(data as any).roles && Array.isArray((data as any).roles) && (data as any).roles.length > 0 && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Vai trò</p>
                        <div className="flex flex-wrap gap-2">
                          {(data as any).roles.map((role: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded text-xs font-medium">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

