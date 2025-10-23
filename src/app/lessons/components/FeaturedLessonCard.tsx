"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface Lesson {
  id: string;
  title: string;
  desc: string;
  progress: number;
}

export default function FeaturedLessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="border border-[#E9E7E2] dark:border-[#232323] rounded-2xl bg-white/70 dark:bg-[#0F0F10]/60 shadow-sm hover:shadow transition-all">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF4E6] dark:bg-[#2A1E12] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#E07924]" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-[#8A8A8A] dark:text-[#9A9A9A]">
              Continue Learning
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1F1F1F] dark:text-white">
              {lesson.title}
            </h2>
          </div>
        </div>

        <div className="md:ml-auto w-full md:w-2/3">
          <p className="text-sm text-[#555] dark:text-[#B7B7B7] mb-4">
            {lesson.desc}
          </p>

          <ProgressBar value={lesson.progress} />
          <div className="mt-5">
            <Link
              href={`/lessons/${lesson.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F6E7D7] text-[#8B4C12] hover:brightness-105 dark:bg-[#251D14] dark:text-[#E7C39A] font-semibold transition"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
