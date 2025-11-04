"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Friend } from "@/model/friend/friendTypes";
import { useTokenInfoStorage } from "@/store/authStore";
import { getUserIdFromToken } from "@/utils/auth";

interface FriendListProps {
  friends: Friend[];
  onUnfriend: (friendshipId: number) => void;
  isLoading?: boolean;
}

export function FriendList({ friends, onUnfriend, isLoading }: FriendListProps) {
  const { token } = useTokenInfoStorage();
  const currentUserId = getUserIdFromToken(token);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-muted-foreground">Loading friends...</p>
        </CardContent>
      </Card>
    );
  }

  if (friends.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">You don't have any friends yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start by sending friend requests!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => {
        const friendUser = friend.friend;
        const displayName = `${friendUser.firstName} ${friendUser.lastName}`.trim() || friendUser.username;

        return (
          <Card key={friend.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold">
                    {friendUser.avatarUrl ? (
                      <img
                        src={friendUser.avatarUrl}
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
                    <p className="text-sm text-muted-foreground">@{friendUser.username}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Friends since {new Date(friend.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `/profile/${friendUser.id}`}
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove ${displayName} as a friend?`)) {
                        const friendshipId = typeof friend.id === 'number' 
                          ? friend.id 
                          : parseInt(String(friend.id));
                        if (!isNaN(friendshipId)) {
                          onUnfriend(friendshipId);
                        }
                      }
                    }}
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="17" y1="11" x2="23" y2="11" />
                    </svg>
                    Unfriend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

