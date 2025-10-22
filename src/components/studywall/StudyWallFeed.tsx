"use client";

import { useState } from "react";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";

export interface Post {
  id: string;
  author: string;
  timeAgo: string;
  caption: string;
  image?: string;
  likes: number;
  hasLiked: boolean;
}

export default function StudyWallFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "FPTU Design Club",
      timeAgo: "2h ago",
      caption: "New workshop about UI motion effects! 🚀",
      image: "/post1.jpg",
      likes: 23,
      hasLiked: false,
    },
    {
      id: "2",
      author: "Nam Nguyen",
      timeAgo: "5h ago",
      caption: "Study streak 10 days strong 🔥",
      image: "/post2.jpg",
      likes: 12,
      hasLiked: true,
    },
  ]);

  const addPost = (caption: string) => {
    if (!caption.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: "You",
      timeAgo: "Just now",
      caption,
      image: "/post-placeholder.jpg",
      likes: 0,
      hasLiked: false,
    };
    setPosts([newPost, ...posts]);
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              hasLiked: !p.hasLiked,
              likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  return (
    <section className="flex flex-col gap-8">
      <CreatePostCard onPost={addPost} />
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onLike={toggleLike} />
      ))}
    </section>
  );
}
