"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePosts() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
        Your Posts
      </h2>
      <Card className="border-none shadow-md hover:shadow-lg bg-white dark:bg-gray-900 transition-all">
        <CardContent className="p-4">
          <div className="h-56 w-full rounded-md bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700" />
          <div className="mt-3 text-xs text-muted-foreground">
            No posts yet. Start sharing your study journey!
          </div>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span>Like</span>
            <span>Comment</span>
            <span>Share</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
