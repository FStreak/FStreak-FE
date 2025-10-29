"use client";

import { useEffect, useState } from "react";
import { privateApiService } from "@/services/ApiPrivate";
import type { FriendRequest } from "@/model/friends/friendTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, UserPlus, Clock } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function FriendRequests() {
  const [received, setReceived] = useState<FriendRequest[]>([]);
  const [sent, setSent] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await privateApiService.getFriendRequests();
      setReceived(response.received || []);
      setSent(response.sent || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      showToast("Không thể tải lời mời kết bạn", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      setRespondingId(requestId);
      await privateApiService.respondToFriendRequest({ requestId, accept: true });
      setReceived(received.filter((r) => r.id !== requestId));
      showToast("Đã chấp nhận lời mời kết bạn", "success");
    } catch (error) {
      console.error("Error accepting request:", error);
      showToast("Không thể chấp nhận lời mời", "error");
    } finally {
      setRespondingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setRespondingId(requestId);
      await privateApiService.respondToFriendRequest({ requestId, accept: false });
      setReceived(received.filter((r) => r.id !== requestId));
      showToast("Đã từ chối lời mời kết bạn", "success");
    } catch (error) {
      console.error("Error rejecting request:", error);
      showToast("Không thể từ chối lời mời", "error");
    } finally {
      setRespondingId(null);
    }
  };

  const handleCancel = async (requestId: string) => {
    try {
      setCancelingId(requestId);
      await privateApiService.cancelFriendRequest(requestId);
      setSent(sent.filter((r) => r.id !== requestId));
      showToast("Đã hủy lời mời kết bạn", "success");
    } catch (error) {
      console.error("Error canceling request:", error);
      showToast("Không thể hủy lời mời", "error");
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
            {received.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
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
                        onClick={() => handleAccept(request.id)}
                        disabled={respondingId === request.id}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {respondingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        disabled={respondingId === request.id}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

