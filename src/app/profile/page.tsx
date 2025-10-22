"use client";

import Navbar from "@/components/navbar/Navbar";
import useUserProfile from "@/hooks/useUserProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStreak from "@/components/profile/ProfileStreak";
import ProfilePosts from "@/components/profile/ProfilePosts";

export default function ProfilePage() {
  const { data, loading, error, refetch } = useUserProfile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
        <div className="hidden md:block" />
        <div className="space-y-10">
          <ProfileHeader
            data={data}
            loading={loading}
            error={error}
            refetch={refetch}
          />
          <ProfileStreak />
          <ProfilePosts />
        </div>
      </div>
    </div>
  );
}
