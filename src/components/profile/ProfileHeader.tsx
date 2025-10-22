"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@/model/authModel/authDataType";

interface ProfileHeaderProps {
  data?: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export default function ProfileHeader({
  data,
  loading,
  error,
  refetch,
}: ProfileHeaderProps) {
  const fullName = data ? `${data.firstName} ${data.lastName}`.trim() : "";

  return (
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
            {loading ? "Loading..." : fullName || data?.userName}
          </h1>
          <p className="text-sm text-muted-foreground">
            #{data?.id?.slice(0, 6)}
          </p>

          {error && (
            <div className="mt-2 text-sm text-red-600 flex items-center gap-3">
              <span>{error}</span>
              <Button size="sm" onClick={refetch} className="ml-2">
                Retry
              </Button>
            </div>
          )}

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="font-medium text-orange-700">Major</span>
            <span className="h-px w-10 bg-orange-400" />
            <span className="text-muted-foreground">Graphic Design</span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Ho Chi Minh City
          </div>
        </div>

        <Button className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-md hover:shadow-lg transition-all">
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}
