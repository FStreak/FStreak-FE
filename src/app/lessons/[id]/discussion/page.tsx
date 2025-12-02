"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Send, User } from "lucide-react";
import { useLesson } from "@/hooks/useLesson";

function Post({ author, text }: { author: string; text: string }) {
  return (
    <div className="p-5 rounded-2xl border border-[#FFEBD2] bg-white hover:bg-[#FFF8F0]/80 transition-all shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center text-orange-600 font-semibold">
          {author[0]}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800 mb-1">
            {author}
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">{text}</div>
        </div>
      </div>
    </div>
  );
}

export default function DiscussionPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { lesson, isLoading } = useLesson(lessonId);
  const [posts, setPosts] = useState([
    { author: "Alice", text: "When is the assignment due?" },
    { author: "Bob", text: "I found the readings helpful." },
  ]);
  const [text, setText] = useState("");

  function add() {
    if (!text.trim()) return;
    setPosts((p) => [{ author: "You", text: text.trim() }, ...p]);
    setText("");
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-600 dark:text-gray-400 py-10">
          Loading discussion...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
              Discussion Forums
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {lesson?.title ? `Discussion for: ${lesson.title}` : "Share thoughts, ask questions, and discuss with your classmates."}
            </p>
          </div>
          <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-xl shadow-sm">
            <User className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        {/* Post Input Box */}
        <div className="rounded-2xl border border-[#FFEBD2] bg-white/95 shadow-sm p-6 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share your question or thoughts..."
            className="w-full p-3 rounded-xl border border-[#FFEBD2] focus:border-orange-400 bg-[#FFFDF9] text-gray-700 text-sm placeholder-gray-400 outline-none resize-none transition-all"
          ></textarea>
          <div className="text-right">
            <button
              onClick={add}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium text-sm hover:shadow-[0_0_15px_rgba(255,180,0,0.4)] transition-all flex items-center justify-center gap-2 ml-auto"
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No discussions yet. Be the first to post!
            </div>
          ) : (
            posts.map((p, i) => (
              <Post key={i} author={p.author} text={p.text} />
            ))
          )}
        </div>
    </div>
  );
}
