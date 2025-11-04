"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FriendRequest } from "@/model/friend/friendTypes";
import { useTokenInfoStorage } from "@/store/authStore";
import { getUserIdFromToken } from "@/utils/auth";

interface FriendRequestsProps {
  requests: FriendRequest[];
  onAccept: (requestId: number) => void;
  onDecline: (requestId: number) => void;
  onCancel: (requestId: number) => void;
  isLoading?: boolean;
}

export function FriendRequests({
  requests,
  onAccept,
  onDecline,
  onCancel,
  isLoading,
}: FriendRequestsProps) {
  const { token } = useTokenInfoStorage();
  const currentUserId = getUserIdFromToken(token);

  // Separate sent and received requests
  const receivedRequests = requests.filter(
    (req) => req.receiverId === currentUserId && req.status === "pending"
  );
  const sentRequests = requests.filter(
    (req) => req.senderId === currentUserId && req.status === "pending"
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-muted-foreground">Loading requests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Received Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Received Requests ({receivedRequests.length})
        </h3>
        {receivedRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No pending friend requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => {
              const sender = request.sender!;
              const displayName = `${sender.firstName} ${sender.lastName}`.trim() || sender.username;

              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold">
                          {sender.avatarUrl ? (
                            <img
                              src={sender.avatarUrl}
                              alt={displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>{displayName.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{displayName}</h3>
                          <p className="text-sm text-muted-foreground">@{sender.username}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onAccept(request.id)}
                        >
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
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDecline(request.id)}
                        >
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
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Sent Requests ({sentRequests.length})
        </h3>
        {sentRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No pending sent requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((request) => {
              const receiver = request.receiver!;
              const displayName = `${receiver.firstName} ${receiver.lastName}`.trim() || receiver.username;

              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold">
                          {receiver.avatarUrl ? (
                            <img
                              src={receiver.avatarUrl}
                              alt={displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>{displayName.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{displayName}</h3>
                          <p className="text-sm text-muted-foreground">@{receiver.username}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCancel(request.id)}
                      >
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
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Cancel Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

