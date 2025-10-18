"use client";

import Link from "next/link";
import { Flame, Home, BookOpen, Users2, User, FileText, CreditCard, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTokenInfoStorage } from "@/store/authStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, clear } = useTokenInfoStorage();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    clear();
    router.push("/");
  };

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

      {/* 🧭 Navigation + Theme Toggle + Login */}
      <div className="flex items-center gap-6">
        {/* Menu */}
        <div className="flex items-center gap-6 text-gray-800 dark:text-gray-200 font-medium text-base">
          <Link
            href="/"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive("/") ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          <Link
            href="/feed"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive("/feed") ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Feed
          </Link>

          <Link
            href="/classrooms"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive("/classrooms") ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            <Users2 className="w-4 h-4" />
            Classrooms
          </Link>

          <Link
            href="/studyWall"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive("/studyWall") ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            <FileText className="w-4 h-4" />
            StudyWall
          </Link>

          <Link
            href="/plans"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive("/plans") ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Plans
          </Link>

        

          <Link
            href="/profile"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive("/profile") ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* 🔐 Login/Logout Button */}
        {token ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-white font-medium text-base bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 transition-all shadow flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-white font-medium text-base bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 transition-all shadow"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
