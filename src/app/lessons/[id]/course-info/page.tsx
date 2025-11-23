"use client";

import React from "react";
import Navbar from "@/components/navbar/Navbar";
import { Star, CheckSquare, Clock, Globe, Award } from "lucide-react";

export default function CourseInfoPage() {
  const rows = [
    {
      icon: <Award className="w-5 h-5 text-orange-500" />,
      title: "Basic Info",
      value: "Course 1 of 5 in the Python for Everybody Specialization",
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-orange-500" />,
      title: "Level",
      value: "Beginner",
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: "Commitment",
      value: "2–4 hours/week",
    },
    {
      icon: <Globe className="w-5 h-5 text-orange-500" />,
      title: "Language",
      value: "English",
    },
    {
      icon: <Star className="w-5 h-5 text-orange-500" />,
      title: "User Ratings",
      value: "4.8 ★★★★★ (Average)",
    },
  ];

  const instructor = {
    name: "Dr. Charles Severance",
    institution: "University of Michigan",
    subject: "Programming and Python",
    rating: 4.8,
    intro:
      "Dr. Chuck is a professor and popular course author who focuses on beginner-friendly programming education. His courses emphasize hands-on practice and real-world examples.",
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
            CS
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
