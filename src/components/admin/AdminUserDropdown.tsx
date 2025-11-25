"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTokenInfoStorage } from "@/store/authStore";
import { User, Settings, LogOut, Home } from "lucide-react";
import ApiPrivate from "@/services/ApiPrivate";
import { showSuccess, showError } from "@/lib/toast";

export default function AdminUserDropdown() {
  const { token, refreshToken, clear } = useTokenInfoStorage();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  /** 🧩 Xử lý logout */
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await ApiPrivate.logout({
        accessToken: token ?? "",
        refreshToken: refreshToken ?? "",
      });
    } catch (err) {
      console.warn("⚠️ Logout API failed (ignored)", err);
    } finally {
      console.log("🧹 Full logout: clear Zustand + localStorage");
      useTokenInfoStorage.persist.clearStorage();
      localStorage.removeItem("fstreak-auth-storage");
      localStorage.removeItem("user");

      setLoggingOut(false);
      setOpen(false);
      router.push("/");
      window.location.reload();
    }
  };

  /** 🔁 Đóng dropdown khi click ra ngoài */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* 👤 Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-orange-400 hover:ring-orange-500 transition-all bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold"
      >
        <User className="w-5 h-5" />
      </button>

      {/* 📜 Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg animate-fadeIn z-50 overflow-hidden">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all"
          >
            <Home className="w-4 h-4 text-orange-500" />
            Về trang chủ
          </Link>

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
            disabled={loggingOut}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm font-medium transition-all ${
              loggingOut
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-500 hover:bg-red-50 dark:hover:bg-gray-800"
            }`}
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? "Đang đăng xuất..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}


