"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function LessonHeader() {
  return (
    <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        {/* 🔥 Gradient title matching F-Streak theme */}
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent select-none">
          Lessons
        </h1>
        <p className="text-[13px] md:text-sm text-gray-600 dark:text-gray-300 mt-2">
          Learn slowly, but steadily. A little every day is enough.
          <Heart className="w-3.5 h-3.5 text-orange-400 inline ml-1" />
        </p>
      </div>

      <div className="flex gap-3">
        {/* 🧡 Primary action: gradient */}
        <Link
          href="/lessons/continue"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-sm hover:shadow-lg transition-all"
        >
          Continue Learning
        </Link>

        {/* ⚪ Secondary action: soft border matching tone */}
        <Link
          href="/lessons/new"
          className="px-5 py-2.5 rounded-xl border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all font-medium"
        >
          Create Lesson
        </Link>
      </div>
    </section>
  );
}
