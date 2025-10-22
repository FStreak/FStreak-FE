"use client";

import { useState } from "react";
import { Camera, Heart, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

interface Post {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
  caption: string;
  likes: number;
  hasLiked: boolean;
}

export default function StudyWall() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Club 1",
      timeAgo: "2 hour ago",
      content: "",
      caption: "Caption here...",
      likes: 0,
      hasLiked: false,
    },
    {
      id: "2",
      author: "Person 1",
      timeAgo: "2 hour ago",
      content: "",
      caption: "Caption here...",
      likes: 0,
      hasLiked: false,
    },
  ]);

  const handlePost = () => {
    if (newPost.trim()) {
      const newPostData: Post = {
        id: Date.now().toString(),
        author: "You",
        timeAgo: "now",
        content: "",
        caption: newPost,
        likes: 0,
        hasLiked: false,
      };
      setPosts([newPostData, ...posts]);
      setNewPost("");
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            hasLiked: !post.hasLiked,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />
      
      

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Create New Post Section */}
        <Card className="bg-orange-500 border-orange-500 mb-8 rounded-xl shadow-lg">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
            
            <div className="mb-6">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your academic achievements or thoughts..."
                className="w-full p-5 rounded-xl border-0 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none text-lg"
                rows={4}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="bg-transparent border-2 border-orange-300 text-white hover:bg-orange-400 hover:text-white hover:border-orange-400 px-6 py-3 rounded-xl font-medium"
              >
                <Camera className="w-5 h-5 mr-2" />
                Add Photo
              </Button>
              
              <Button
                onClick={handlePost}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg"
              >
                Post to Wall
              </Button>
            </div>
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.map((post) => (
            <Card key={post.id} className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
              <div className="p-8">
                {/* Post Header */}
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{post.author}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{post.timeAgo}</p>
                  </div>
                </div>

                {/* Post Content */}
                {post.content && (
                  <div className="mb-6">
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-lg">Content placeholder</span>
                    </div>
                  </div>
                )}

                {/* Post Caption */}
                <p className="text-gray-900 dark:text-white mb-6 text-lg">{post.caption}</p>

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 text-lg font-medium ${
                        post.hasLiked 
                          ? "text-red-500" 
                          : "text-gray-500 hover:text-red-500"
                      } transition-colors`}
                    >
                      <Heart className={`w-6 h-6 ${post.hasLiked ? "fill-current" : ""}`} />
                      <span>Like</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors text-lg font-medium">
                      <MessageCircle className="w-6 h-6" />
                      <span>Comment</span>
                    </button>
                  </div>
                  
                  <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    {post.likes} Likes
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
