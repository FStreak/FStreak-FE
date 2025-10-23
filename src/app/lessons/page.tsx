"use client";

import Navbar from "@/components/navbar/Navbar";
import LessonHeader from "./components/LessonHeader";
import FeaturedLessonCard from "./components/FeaturedLessonCard";
import LessonCard from "./components/LessonCard";

const mockLessons = [
  {
    id: "l1",
    title: "Basic Calculus",
    level: "Beginner",
    desc: "Understand derivatives and integrals through simple real-world examples.",
    progress: 65,
  },
  {
    id: "l2",
    title: "Physics Fundamentals",
    level: "Beginner",
    desc: "Explore the laws of motion and energy with practical insights.",
    progress: 20,
  },
  {
    id: "l3",
    title: "Introduction to Python",
    level: "Intermediate",
    desc: "Write simple scripts, handle data, and learn coding logic.",
    progress: 0,
  },
  {
    id: "l4",
    title: "Spanish for Travelers",
    level: "Beginner",
    desc: "Learn easy-to-remember phrases for your next trip.",
    progress: 40,
  },
];

export default function LessonsPage() {
  const featured = mockLessons[0];
  const rest = mockLessons.slice(1);

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0B0B0B]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 md:px-8 py-10 md:py-14 space-y-10">
        <LessonHeader />
        <FeaturedLessonCard lesson={featured} />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
        </section>
      </main>
    </div>
  );
}
