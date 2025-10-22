"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CreatePostCard({
  onPost,
}: {
  onPost: (caption: string) => void;
}) {
  const [text, setText] = useState("");

  const handlePost = () => {
    if (text.trim()) {
      onPost(text.trim());
      setText("");
    }
  };

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 bg-white dark:bg-gray-800">
      <div className="p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-white flex items-center justify-center font-bold">
          U
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 bg-transparent border-none resize-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm"
          rows={1}
        />
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500"
        >
          <ImagePlus className="w-4 h-4" />
          Photo
        </Button>
        <Button
          onClick={handlePost}
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg px-6 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
        >
          Post
        </Button>
      </div>
    </Card>
  );
}
