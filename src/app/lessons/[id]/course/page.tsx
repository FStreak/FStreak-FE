"use client";

import Navbar from "@/components/navbar/Navbar";
import LessonInfoCard from "../components/LessonInfoCard";
import LessonVideo from "../components/LessonVideo";
import LessonReadings from "../components/LessonReadings";

export default function LessonCoursePage() {
  // 🎥 Dữ liệu video
  const videoData = {
    title: "Lecture 1: Why We Program?",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    minutes: 6,
  };

  // 📚 Dữ liệu đọc thêm
  const readings = [
    { id: "1", title: "Welcome to the Class", minutes: 10 },
    { id: "2", title: "Course Syllabus", minutes: 10 },
    { id: "3", title: "Additional Python Resources", minutes: 8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      {/* 🌐 Navbar chung */}
      <Navbar />

      {/* 📚 Nội dung chính */}
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        {/* 🧭 Tiêu đề */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lesson Course
        </h1>

        {/* 🎥 Video bài học */}
        <LessonVideo
          title={videoData.title}
          src={videoData.src}
          minutes={videoData.minutes}
        />

        {/* 📚 Tài liệu đọc thêm */}
        <div className="rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 shadow-sm p-6">
          <LessonReadings readings={readings} />
        </div>

        {/* 🧾 Thông tin tổng quan */}
        <LessonInfoCard />
      </div>
    </div>
  );
}
