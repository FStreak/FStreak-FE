"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { privateApiService } from "@/services/ApiPrivate";
import type { Friend } from "@/model/friends/friendTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, UserMinus, Loader2 } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function FriendList() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [unfriendingId, setUnfriendingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchFriends(false); // Don't show loading spinner on auto-refresh
    }, 5000);
    
    // Listen for friend request accepted event to refresh immediately
    const handleFriendAccepted = () => {
      console.log("Friend accepted event received, refreshing friends list...");
      setTimeout(() => fetchFriends(false), 1000); // Wait 1 second for backend to process, don't show loading
    };
    window.addEventListener('friendRequestAccepted', handleFriendAccepted);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('friendRequestAccepted', handleFriendAccepted);
    };
  }, []);

  const fetchFriends = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await privateApiService.getFriends();
      console.log("Friends fetched:", response);
      console.log("Friends count:", response.friends?.length || 0);
      setFriends(response.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
      if (showLoading) {
        showToast("Không thể tải danh sách bạn bè", "error");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleUnfriend = async (friendId: string, friendName: string) => {
    if (!confirm(`Bạn có chắc muốn hủy kết bạn với ${friendName}?`)) return;

    try {
      setUnfriendingId(friendId);
      await privateApiService.unfriend(friendId);
      setFriends(friends.filter((f) => f.friendId !== friendId));
      showToast("Đã hủy kết bạn", "success");
    } catch (error) {
      console.error("Error unfriending:", error);
      showToast("Không thể hủy kết bạn", "error");
    } finally {
      setUnfriendingId(null);
    }
  };

  const handleMessage = (friendId: string) => {
    router.push(`/messages?userId=${friendId}`);
  };

  const handleViewProfile = (friendId: string) => {
    router.push(`/profile/${friendId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-500">Đang tải danh sách bạn bè...</p>
        </CardContent>
      </Card>
    );
  }

  if (friends.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Chưa có bạn bè
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Bắt đầu kết nối với mọi người bằng cách gửi lời mời kết bạn!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Bạn bè ({friends.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend, index) => {
          // Get real name (firstName + lastName) - same as UserSearchForFriends
          const firstName = (friend as any).firstName || "";
          const lastName = (friend as any).lastName || "";
          
          // Display name: firstName + lastName (same format as UserSearchForFriends)
          const displayName = firstName && lastName 
            ? `${firstName} ${lastName}`.trim()
            : friend.friendName || friend.friendUsername || "Người dùng";
          
          // Get first letter for avatar (use firstName if available)
          const firstLetter = firstName?.[0]?.toUpperCase() || 
                             displayName?.[0]?.toUpperCase() || 
                             friend.friendUsername?.[0]?.toUpperCase() || 
                             "?";
          
          // Ensure unique key - use friendId first, then id, then index as fallback
          const uniqueKey = friend.friendId || friend.id || `friend-${index}`;
          
          return (
            <Card key={uniqueKey} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {firstLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handleViewProfile(friend.friendId)}
                      className="font-semibold text-gray-800 dark:text-gray-100 hover:text-orange-500 truncate block w-full text-left"
                    >
                      {displayName}
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      @{friend.friendUsername || "username"}
                    </p>
                    <p className="text-xs text-orange-500 font-medium mt-1">
                      🔥 {friend.friendStreak || 0} streak
                    </p>
                  </div>
                </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMessage(friend.friendId)}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Nhắn tin
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUnfriend(friend.friendId, displayName)}
                  disabled={unfriendingId === friend.friendId}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  {unfriendingId === friend.friendId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserMinus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        })}
      </div>
    </div>
  );
}

