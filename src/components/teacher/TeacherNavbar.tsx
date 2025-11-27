"use client";

import Link from "next/link";
import { Flame, BookOpen, GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import TeacherUserDropdown from "./TeacherUserDropdown";

export default function TeacherNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      {/* 🔥 Logo */}
      <Link href="/teacher" className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-400 shadow">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent select-none">
          F-Streak Teacher
        </h1>
      </Link>

      {/* 🧭 Navigation */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-gray-800 dark:text-gray-200 font-medium text-base">
          {[
            { href: "/teacher", icon: BookOpen, label: "Lessons" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 transition-colors ${
                isActive(href) ? "text-orange-500" : "hover:text-orange-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        <ThemeToggle />

        {/* 👤 Teacher Profile Dropdown */}
        <TeacherUserDropdown />
      </div>
    </nav>
  );
}


