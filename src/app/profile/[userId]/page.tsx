"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { privateApiService } from "@/services/ApiPrivate";
import type { UserProfile } from "@/model/authModel/authDataType";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      // Since there's no individual user endpoint, fetch all users and find the one we need
      const allUsers = await privateApiService.getAllUsers();
      const user = allUsers.find(u => u.id === userId);
      if (user) {
        setData(user);
      } else {
        setError("Không tìm thấy người dùng");
      }
    } catch (e) {
      console.error("Error fetching user profile:", e);
      setError("Không thể tải hồ sơ người dùng");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

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
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-orange-400 shadow-md">
                    <Image
                      src="/vercel.svg"
                      alt="avatar"
                      fill
                      className="object-contain bg-orange-50"
                    />
                  </div>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                      {fullName || data.userName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      @{data.userName}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-medium text-orange-700">Streak hiện tại: </span>
                        <span className="text-orange-500 font-bold">🔥 {data.currentStreak}</span>
                      </div>
                      <div>
                        <span className="font-medium text-orange-700">Streak dài nhất: </span>
                        <span className="text-orange-500 font-bold">🏆 {data.longestStreak}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    Thông tin thêm
                  </h2>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>Tham gia: {new Date(data.createdAt).toLocaleDateString('vi-VN')}</p>
                    <p className="text-xs text-gray-500">ID: {data.id}</p>
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

