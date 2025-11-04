"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { privateApiService } from "@/services/ApiPrivate";
import { toast } from "@/lib/toast";

export function SendFriendRequest() {
  const [username, setUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Implement user search API
      // For now, we'll use a placeholder
      toast.info("User search feature coming soon!");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await privateApiService.sendFriendRequest({ receiverId: userId });
      toast.success("Friend request sent!");
      setUsername("");
      setSearchResults([]);
    } catch (error) {
      console.error("Send request error:", error);
      toast.error("Failed to send friend request");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Friend Request</CardTitle>
        <CardDescription>Search for users and send friend requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username or Email</Label>
          <div className="flex gap-2">
            <Input
              id="username"
              placeholder="Enter username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Search Results:</p>
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{user.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(user.id)}
                  >
                    Send Request
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

