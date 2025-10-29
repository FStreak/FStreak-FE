"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { privateApiService } from "@/services/ApiPrivate";
import type { UserProfile } from "@/model/authModel/authDataType";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UserSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Fetch all users once on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await privateApiService.getAllUsers();
        setAllUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = allUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const username = user.userName.toLowerCase();
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || username.includes(search);
    });

    setResults(filtered);
    setShowResults(true);
  }, [searchTerm, allUsers]);

  const handleSearch = useCallback(() => {
    // Search is now handled by useEffect above
    // This function is kept for the button click
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    setShowResults(false);
    setSearchTerm("");
  };

  return (
    <section className="relative">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Tìm kiếm người dùng
      </h2>
      
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Nhập tên người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold hover:from-orange-600 hover:to-yellow-500"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}

      {showResults && (
        <Card className="absolute z-10 w-full max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-4">
            {results.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Không tìm thấy người dùng nào
              </p>
            ) : (
              <div className="space-y-2">
                {results.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-white font-bold">
                      {user.firstName?.[0]?.toUpperCase() || user.userName[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.userName}
                      </div>
                    </div>
                    <div className="text-sm text-orange-500 font-semibold">
                      🔥 {user.currentStreak} streak
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}

