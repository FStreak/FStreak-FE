"use client";

import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { Post } from "./StudyWallFeed";

export default function PostCard({
  post,
  onLike,
}: {
  post: Post;
  onLike: (id: string) => void;
}) {
  return (
    <Card className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 text-white flex items-center justify-center font-bold">
          {post.author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {post.author}
          </p>
          <p className="text-xs text-gray-500">{post.timeAgo}</p>
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <motion.img
          src={post.image}
          alt=""
          className="w-full h-72 object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Caption */}
      <div className="px-5 py-4 text-sm text-gray-800 dark:text-gray-200">
        {post.caption}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 transition-all ${
              post.hasLiked
                ? "text-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-transform ${
                post.hasLiked ? "fill-current scale-110" : "scale-100"
              }`}
            />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm font-medium">Comment</span>
          </button>
        </div>

        <span className="text-sm font-semibold text-gray-500">
          {post.likes} Likes
        </span>
      </div>
    </Card>
  );
}
