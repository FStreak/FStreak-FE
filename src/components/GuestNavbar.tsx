"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function GuestNavbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      {/* 🔥 Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-400 shadow">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent select-none">
          F-Streak
        </h1>
      </Link>

      {/* 🧭 Navigation + Theme Toggle + Auth Buttons */}
      <div className="flex items-center gap-6">
        {/* Menu */}
        <div className="flex items-center gap-6 text-gray-800 dark:text-gray-200 font-medium text-base">
          <Link
            href="/about"
            className="transition-colors hover:text-orange-500"
          >
            About Us
          </Link>

          <Link
            href="/plans"
            className="transition-colors hover:text-orange-500"
          >
            Plans
          </Link>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* 🔐 Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium text-base border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg text-white font-medium text-base bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 transition-all shadow"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
