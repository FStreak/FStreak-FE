"use client";

import React from "react";
import Navbar from "@/components/navbar/Navbar";
import { BookOpen, FileText, ExternalLink } from "lucide-react";

export default function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: "Course Slides (PDF)",
      link: "#",
      icon: <FileText className="w-5 h-5 text-orange-500" />,
      desc: "Download the official course presentation slides.",
    },
    {
      id: 2,
      title: "Supplemental Reading",
      link: "#",
      icon: <BookOpen className="w-5 h-5 text-orange-500" />,
      desc: "Additional materials to deepen your understanding.",
    },
    {
      id: 3,
      title: "External Reference Site",
      link: "#",
      icon: <ExternalLink className="w-5 h-5 text-orange-500" />,
      desc: "Visit external resources for more practice.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-[#FFFDFB] to-[#FFF7EC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-14 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
              Resources
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Access course materials, readings, and helpful links.
            </p>
          </div>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              className="group flex flex-col justify-between p-6 rounded-2xl border border-[#FFEBD2] bg-white/95 shadow-sm hover:shadow-md hover:bg-[#FFF8F0]/90 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-50">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-500 mt-4 font-medium">
                Open Resource
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
