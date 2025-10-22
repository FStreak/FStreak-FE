"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTokenInfoStorage } from "@/store/authStore";
import { User, Settings, LogOut } from "lucide-react";

export default function UserDropdown() {
  const { clear } = useTokenInfoStorage();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    clear();
    router.push("/");
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-orange-400 hover:ring-orange-500 transition-all"
      >
        <Image
          src="/avatar-default.png"
          alt="User avatar"
          fill
          className="object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg animate-fadeIn z-50 overflow-hidden">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all"
          >
            <User className="w-4 h-4 text-orange-500" />
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all"
          >
            <Settings className="w-4 h-4 text-orange-500" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
