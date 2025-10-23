"use client";

import Navbar from "@/components/navbar/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Clock, Star } from "lucide-react";

export default function LessonOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* 🧭 Tiêu đề bài học */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lesson Overview
        </h1>

        {/* 📘 Thông tin tổng quan bài học */}
        <Card className="rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Info className="text-orange-500 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                About this lesson
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              This lesson introduces the fundamental concepts of programming and
              problem solving. You’ll explore topics such as algorithms,
              variables, data types, and logical operations through interactive
              examples.
            </p>
          </CardContent>
        </Card>

        {/* 📈 Thông tin tiến độ */}
        <Card className="rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>Estimated completion time: 6 hours</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Difficulty: Beginner</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
