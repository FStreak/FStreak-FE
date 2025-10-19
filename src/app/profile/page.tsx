"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import useUserProfile from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const { data, loading, error, refetch } = useUserProfile();

  const fullName = data ? `${data.firstName} ${data.lastName}`.trim() : "";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6">
      {/* Left menu placeholder to mimic Figma sidebar spacing */}
      <div className="hidden md:block" />

      <div className="space-y-8">
        {/* Header Card */}
        <Card>
          <CardContent className="p-6 flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden ring-2 ring-orange-500">
              <Image src="/vercel.svg" alt="avatar" fill className="object-contain bg-orange-50" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{loading ? "Loading..." : fullName || data?.userName}</h1>
              <p className="text-sm text-muted-foreground">#{data?.id?.slice(0, 6)}</p>
              {error && (
                <div className="mt-2 text-sm text-red-600 flex items-center gap-3">
                  <span>{error}</span>
                  <Button size="sm" onClick={() => refetch()} className="ml-2">Retry</Button>
                </div>
              )}
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="font-medium">Major</span>
                <span className="h-px w-10 bg-orange-500" />
                <span className="text-muted-foreground">Graphic Design</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Ho Chi Minh City</div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">Edit</Button>
          </CardContent>
        </Card>

        {/* Streak */}
        <div>
          <h2 className="text-center text-xl font-semibold mb-3">Streak</h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-[160px,1fr] items-center">
                <Link href="/streakHistory" className="bg-orange-500 text-white text-center py-10 block hover:opacity-90 transition-opacity">
                  <div className="text-6xl font-extrabold">
                    {data?.currentStreak ?? 0}
                  </div>
                  <div className="text-xs tracking-wider mt-1">DAYS STREAK</div>
                </Link>
                <div className="px-6 py-6 text-sm text-muted-foreground">
                  The person has been active in recent days.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts placeholder */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Post</h2>
          <Card>
            <CardContent className="p-4">
              <div className="h-56 w-full rounded-md bg-muted" />
              <div className="mt-3 text-xs text-muted-foreground">Caption here...</div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>Like</span>
                <span>Comment</span>
                <span>Share</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}


