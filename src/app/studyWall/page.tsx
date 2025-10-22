"use client";

import Navbar from "@/components/navbar/Navbar";
import StudyWallFeed from "@/components/studywall/StudyWallFeed";

export default function StudyWallPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <StudyWallFeed />
      </main>
    </div>
  );
}
