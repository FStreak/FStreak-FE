"use client";

import { useEffect, useState } from "react";
import { privateApiService } from "@/services/ApiPrivate";
import type { FriendRequest } from "@/model/friends/friendTypes";
import { FriendshipStatus } from "@/model/friends/friendTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, UserPlus, Clock } from "lucide-react";
import { toast } from "@/lib/toast";

export default function FriendRequests() {
  const [received, setReceived] = useState<FriendRequest[]>([]);
  const [sent, setSent] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
    
    // Auto-refresh every 5 seconds to get new friend requests
    const interval = setInterval(() => {
      fetchRequests(false); // Don't show loading spinner on auto-refresh
    }, 5000);

    // Listen for friend request sent event to refresh immediately
    const handleFriendRequestSent = () => {
      console.log("Friend request sent event received, refreshing...");
      setTimeout(() => fetchRequests(false), 1000); // Wait 1 second for backend to process
    };
    window.addEventListener('friendRequestSent', handleFriendRequestSent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('friendRequestSent', handleFriendRequestSent);
    };
  }, []);

  const fetchRequests = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await privateApiService.getFriendRequests();
      console.log("Friend requests fetched (full response):", response);
      console.log("Response keys:", Object.keys(response || {}));
      
      // Handle different response formats from backend
      // Try camelCase first
      let receivedList = response.received;
      let sentList = response.sent;
      
      // If undefined, try PascalCase
      if (!receivedList && !sentList) {
        receivedList = (response as any).Received;
        sentList = (response as any).Sent;
      }
      
      // If still undefined, try data property
      if (!receivedList && !sentList && (response as any).data) {
        const data = (response as any).data;
        receivedList = data.received || data.Received;
        sentList = data.sent || data.Sent;
      }
      
      // If response is an array directly, might be all requests
      if (!receivedList && !sentList && Array.isArray(response)) {
        console.log("Response is array, need to separate by sender/receiver");
        // This would require current user ID to separate, skip for now
      }
      
      console.log("Received requests (after parsing):", receivedList);
      console.log("Sent requests (after parsing):", sentList);
      
      // Log status values to debug
      if (receivedList && receivedList.length > 0) {
        console.log("Sample received request status:", receivedList[0]?.status, typeof receivedList[0]?.status);
        console.log("All received statuses:", receivedList.map((r: FriendRequest) => r.status));
      }
      if (sentList && sentList.length > 0) {
        console.log("Sample sent request status:", sentList[0]?.status, typeof sentList[0]?.status);
        console.log("All sent statuses:", sentList.map((r: FriendRequest) => r.status));
      }
      
      // Filter to only show PENDING requests
      // Backend returns status as string "Pending" (capital P, rest lowercase)
      const pendingReceived = (receivedList || []).filter((req: FriendRequest) => {
        const status = req.status;
        // Handle all possible formats: number 0, string "0", "PENDING", "Pending", "pending", or enum
        if (status === 0 || status === "0" || status === FriendshipStatus.PENDING) return true;
        if (typeof status === "string") {
          const statusUpper = status.toUpperCase();
          return statusUpper === "PENDING" || statusUpper === "0";
        }
        return false;
      });
      const pendingSent = (sentList || []).filter((req: FriendRequest) => {
        const status = req.status;
        // Handle all possible formats: number 0, string "0", "PENDING", "Pending", "pending", or enum
        if (status === 0 || status === "0" || status === FriendshipStatus.PENDING) return true;
        if (typeof status === "string") {
          const statusUpper = status.toUpperCase();
          return statusUpper === "PENDING" || statusUpper === "0";
        }
        return false;
      });
      
      console.log("Pending received:", pendingReceived.length);
      console.log("Pending sent:", pendingSent.length);
      
      setReceived(pendingReceived);
      setSent(pendingSent);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      if (showLoading) {
        toast.error("Không thể tải lời mời kết bạn");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      setRespondingId(requestId);
      console.log("Accepting friend request with ID:", requestId);
      const response = await privateApiService.respondToFriendRequest({ requestId, accept: true });
      console.log("Accept response:", response);
      
      // Refresh the requests list after accepting
      await fetchRequests(false);
      
      // Trigger event to notify FriendList to refresh
      window.dispatchEvent(new CustomEvent('friendRequestAccepted'));
      
      toast.success("Đã chấp nhận lời mời kết bạn");
    } catch (error: any) {
      console.error("Error accepting request:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestId: requestId
      });
      const message = error.response?.data?.message || error.response?.data?.title || error.message || "Không thể chấp nhận lời mời";
      toast.error(message);
    } finally {
      setRespondingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setRespondingId(requestId);
      console.log("Rejecting friend request with ID:", requestId);
      const response = await privateApiService.respondToFriendRequest({ requestId, accept: false });
      console.log("Reject response:", response);
      
      // Refresh the list after rejecting
      await fetchRequests(false);
      toast.success("Đã từ chối lời mời kết bạn");
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        requestId: requestId
      });
      const message = error.response?.data?.message || error.response?.data?.title || error.message || "Không thể từ chối lời mời";
      toast.error(message);
    } finally {
      setRespondingId(null);
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      setCancelingId(requestId);
      await privateApiService.cancelFriendRequest(requestId);
      setSent(sent.filter((r) => r.id !== requestId));
      toast.success("Đã hủy lời mời kết bạn");
    } catch (error) {
      console.error("Error canceling request:", error);
      toast.error("Không thể hủy lời mời");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Received Requests */}
      {received.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-orange-500" />
            Lời mời nhận được ({received.length})
          </h3>
          <div className="space-y-3">
            {received.map((request) => {
              // Handle both camelCase and PascalCase for id
              const requestId = request.id || (request as any).Id || (request as any).requestId || (request as any).RequestId;
              console.log("Request object:", request);
              console.log("Extracted requestId:", requestId);
              
              return (
                <Card key={requestId || Math.random()} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {request.senderName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                            {request.senderName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            @{request.senderUsername}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <Button
                          size="sm"
                          onClick={() => {
                            console.log("Accept button clicked, requestId:", requestId);
                            handleAccept(requestId);
                          }}
                          disabled={respondingId === requestId || !requestId}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          {respondingId === requestId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            console.log("Reject button clicked, requestId:", requestId);
                            handleReject(requestId);
                          }}
                          disabled={respondingId === requestId || !requestId}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Sent Requests */}
      {sent.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Lời mời đã gửi ({sent.length})
          </h3>
          <div className="space-y-3">
            {sent.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {request.receiverName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {request.receiverName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{request.receiverUsername} • Đang chờ
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(request.id)}
                      disabled={cancelingId === request.id}
                      className="text-red-500 hover:text-red-600 flex-shrink-0 ml-4"
                    >
                      {cancelingId === request.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Hủy"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {received.length === 0 && sent.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Không có lời mời kết bạn nào
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

