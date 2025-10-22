"use client";

import Link from "next/link";
import {
  Flame,
  Home,
  BookOpen,
  Users2,
  FileText,
  CreditCard,
  Bell,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTokenInfoStorage } from "@/store/authStore";
import { privateApiService } from "@/services/ApiPrivate";
import { useEffect, useState, useRef } from "react";
import type { ReminderEntry } from "@/model/reminder/reminderTypes";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const { token } = useTokenInfoStorage();

  const isActive = (path: string) => pathname === path;

  // Notifications
  const [reminders, setReminders] = useState<ReminderEntry[]>([]);
  const [openNotif, setOpenNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await privateApiService.getReminders();
        if (mounted) setReminders(res.filter((r) => r.enabled));
      } catch {}
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!notifRef.current?.contains(e.target as Node)) setOpenNotif(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
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

      {/* 🧭 Navigation */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-gray-800 dark:text-gray-200 font-medium text-base">
          {[
            { href: "/", icon: Home, label: "Home" },
            { href: "/lessons", icon: BookOpen, label: "Lessons" },
            { href: "/classrooms", icon: Users2, label: "Classrooms" },
            { href: "/studyWall", icon: FileText, label: "StudyWall" },
            { href: "/plans", icon: CreditCard, label: "Plans" },
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

        {/* 🔔 Notifications */}
        {token && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setOpenNotif((v) => !v)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            >
              <Bell className="w-5 h-5" />
              {reminders.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
                  {reminders.length}
                </span>
              )}
            </button>

            {openNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b text-sm font-medium">
                  Notifications
                </div>
                <div className="max-h-64 overflow-auto">
                  {reminders.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      No upcoming reminders
                    </div>
                  ) : (
                    reminders.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 flex items-start gap-3 border-b last:border-b-0"
                      >
                        <div className="w-2 h-2 mt-1 rounded-full bg-orange-400" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{r.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.schedule || r.detail}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 👤 User Dropdown */}
        {token ? (
          <UserDropdown />
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
