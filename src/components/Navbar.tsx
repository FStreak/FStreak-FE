"use client";

import Link from "next/link";
import { Flame, Home, BookOpen, Users2, User, FileText, CreditCard, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { privateApiService } from "@/services/ApiPrivate";
import type { ReminderEntry } from "@/model/reminder/reminderTypes";
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

  // Notifications
  const [reminders, setReminders] = useState<ReminderEntry[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await privateApiService.getReminders();
        if (mounted) setReminders(res.filter(r => r.enabled));
      } catch {
        // ignore
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

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
            href="/lessons"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive("/lessons") ? "text-orange-500" : "hover:text-orange-500"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Lessons
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

        {/* Notifications Bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {reminders.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">{reminders.length}</span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border rounded shadow-lg z-50">
              <div className="p-3 border-b text-sm font-medium">Notifications</div>
              <div className="max-h-64 overflow-auto">
                {reminders.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No upcoming reminders</div>
                ) : (
                  reminders.slice(0, 8).map(r => (
                    <div key={r.id} className="p-3 flex items-start gap-3 border-b last:border-b-0">
                      <div className="w-2 h-2 mt-1 rounded-full bg-orange-400" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.schedule || r.detail}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 text-center border-t">
                <a href="/reminders" className="text-sm text-orange-600">Manage reminders</a>
              </div>
            </div>
          )}
        </div>

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
