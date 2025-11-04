"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import { privateApiService } from "@/services/ApiPrivate";
import { useTokenInfoStorage } from "@/store/authStore";
import { getUserIdFromToken } from "@/utils/auth";
import type { Friend, FriendRequest } from "@/model/friend/friendTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FriendList } from "./components/FriendList";
import { FriendRequests } from "./components/FriendRequests";
import { SendFriendRequest } from "./components/SendFriendRequest";
import { toast } from "@/lib/toast";

type TabType = "friends" | "requests" | "send";

export default function FriendsPage() {
  const { token } = useTokenInfoStorage();
  const currentUserId = getUserIdFromToken(token);
  
  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Ensure requests is always an array
  const safeRequests = Array.isArray(requests) ? requests : [];

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const data = await privateApiService.getFriends();
      setFriends(data);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      toast.error("Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const data = await privateApiService.getFriendRequests();
      // Ensure data is always an array
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load friend requests");
      setRequests([]); // Set empty array on error
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleUnfriend = async (friendshipId: number) => {
    try {
      await privateApiService.deleteFriend(friendshipId);
      setFriends(friends.filter((f) => parseInt(f.id) !== friendshipId));
      toast.success("Friend removed successfully");
    } catch (error) {
      console.error("Failed to unfriend:", error);
      toast.error("Failed to remove friend");
    }
  };

  const handleAccept = async (requestId: number) => {
    try {
      await privateApiService.respondFriendRequest({
        requestId,
        accept: true,
      });
      toast.success("Friend request accepted!");
      await Promise.all([fetchFriends(), fetchRequests()]);
    } catch (error) {
      console.error("Failed to accept request:", error);
      toast.error("Failed to accept friend request");
    }
  };

  const handleDecline = async (requestId: number) => {
    try {
      await privateApiService.respondFriendRequest({
        requestId,
        accept: false,
      });
      toast.success("Friend request declined");
      await fetchRequests();
    } catch (error) {
      console.error("Failed to decline request:", error);
      toast.error("Failed to decline friend request");
    }
  };

  const handleCancel = async (requestId: number) => {
    try {
      await privateApiService.cancelFriendRequest(requestId);
      toast.success("Friend request cancelled");
      await fetchRequests();
    } catch (error) {
      console.error("Failed to cancel request:", error);
      toast.error("Failed to cancel friend request");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Friends
          </h1>
          <p className="text-muted-foreground">Manage your friends and friend requests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "friends"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 relative ${
              activeTab === "requests"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Requests
            {currentUserId && safeRequests.filter((r) => r.status === "pending" && r.receiverId === currentUserId).length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                {safeRequests.filter((r) => r.status === "pending" && r.receiverId === currentUserId).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("send")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "send"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Send Request
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "friends" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Friends</h2>
              <Button onClick={fetchFriends} variant="outline" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Refresh
              </Button>
            </div>
            <FriendList
              friends={friends}
              onUnfriend={handleUnfriend}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === "requests" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Friend Requests</h2>
              <Button onClick={fetchRequests} variant="outline" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Refresh
              </Button>
            </div>
            <FriendRequests
              requests={safeRequests}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onCancel={handleCancel}
              isLoading={isLoadingRequests}
            />
          </div>
        )}

        {activeTab === "send" && (
          <div>
            <SendFriendRequest />
          </div>
        )}
        </div>
      </div>
    </>
  );
}
