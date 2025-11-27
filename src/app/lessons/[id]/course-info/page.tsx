"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { Star, CheckSquare, Clock, Globe, Award } from "lucide-react";
import { useLesson } from "@/hooks/useLesson";
import { privateApiService } from "@/services/ApiPrivate";
import type { UserProfile } from "@/model/authModel/authDataType";

export default function CourseInfoPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { lesson, isLoading } = useLesson(lessonId);
  const [teacher, setTeacher] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!lesson?.teacherId) return;

      try {
        const teacherData = await privateApiService.getUserById(lesson.teacherId);
        setTeacher(teacherData);
      } catch (error) {
        console.error("Error fetching teacher:", error);
      }
    };

    if (lesson) {
      fetchTeacher();
    }
  }, [lesson]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-[#FFFDFB] to-[#FFF7EC]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 md:px-10 py-14">
          <div className="text-center text-gray-600">Loading course info...</div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-[#FFFDFB] to-[#FFF7EC]">
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 md:px-10 py-14">
          <div className="text-center text-gray-600">Lesson not found</div>
        </main>
      </div>
    );
  }

  const rows: Array<{
    icon: JSX.Element;
    title: string;
    value: string;
  }> = [
    {
      icon: <Award className="w-5 h-5 text-orange-500" />,
      title: "Category",
      value: lesson.category || "Not specified",
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-orange-500" />,
      title: "Status",
      value: lesson.isPublished ? "Published" : "Draft",
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: "Duration",
      value: lesson.durationMinutes
        ? `${lesson.durationMinutes} minutes`
        : "Not specified",
    },
    {
      icon: <Globe className="w-5 h-5 text-orange-500" />,
      title: "Created",
      value: lesson.createdAt
        ? new Date(lesson.createdAt).toLocaleDateString()
        : "Unknown",
    },
    ...(lesson.startAt
      ? [
          {
            icon: <Star className="w-5 h-5 text-orange-500" />,
            title: "Start Date",
            value: new Date(lesson.startAt).toLocaleDateString(),
          },
        ]
      : []),
  ];

  const instructor = teacher
    ? {
        name: `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() || teacher.userName,
        institution: teacher.email || "Not specified",
        subject: lesson.category || "General",
        rating: 0,
        intro: `Teacher: ${teacher.userName}`,
      }
    : {
        name: "Unknown Teacher",
        institution: "Not specified",
        subject: lesson.category || "General",
        rating: 0,
        intro: "Teacher information not available",
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-[#FFFDFB] to-[#FFF7EC]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-14 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
              Course Info
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Learn more about your instructor and course overview.
            </p>
          </div>
        </div>

        {/* Instructor Card */}
        <div className="rounded-3xl border border-[#FFEBD2] bg-white/95 shadow-sm p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center text-2xl font-bold text-orange-600 shadow-inner">
            {instructor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "?"}
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {instructor.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {instructor.institution} • {instructor.subject}
                </p>
              </div>
              <div className="flex items-center gap-2 text-orange-500 font-semibold">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                {instructor.rating.toFixed(1)} / 5.0
              </div>
            </div>

            <p className="mt-4 text-gray-700 text-sm leading-relaxed">
              {instructor.intro}
            </p>
          </div>
        </div>

        {/* Course Details */}
        <div className="rounded-3xl border border-[#FFEBD2] bg-white/95 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Course Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl border border-[#FFF0DA] hover:bg-[#FFF9F0] transition-all"
              >
                <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-xl">
                  {r.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{r.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{r.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
