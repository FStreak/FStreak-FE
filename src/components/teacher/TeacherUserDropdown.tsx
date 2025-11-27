"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTokenInfoStorage } from "@/store/authStore";
import { User, LogOut, Home } from "lucide-react";
import ApiPrivate from "@/services/ApiPrivate";
import { privateApiService } from "@/services/ApiPrivate";
import { showSuccess, showError } from "@/lib/toast";
import type { UserProfile } from "@/model/authModel/authDataType";

export default function TeacherUserDropdown() {
  const { token, refreshToken, clear } = useTokenInfoStorage();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const profile = await privateApiService.getMyProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error loading teacher profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadProfile();
    }
  }, [open, token]);

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

  // Get display name
  const displayName = userProfile?.firstName && userProfile?.lastName
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : userProfile?.userName || userProfile?.email || "Teacher";

  // Get initials for avatar
  const getInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    if (userProfile?.userName) {
      return userProfile.userName.substring(0, 2).toUpperCase();
    }
    return "T";
  };

  return (
    <div className="relative" ref={ref}>
      {/* 👤 Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-orange-400 hover:ring-orange-500 transition-all bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold"
      >
        <span className="text-sm font-semibold">{getInitials()}</span>
      </button>

      {/* 📜 Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg animate-fadeIn z-50 overflow-hidden">
          {/* Profile Section */}
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              Đang tải...
            </div>
          ) : userProfile ? (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold">
                  <span className="text-sm">{getInitials()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {displayName}
                  </p>
                  {userProfile.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userProfile.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all"
              onClick={() => setOpen(false)}
            >
              <Home className="w-4 h-4 text-orange-500" />
              Về trang chủ
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all"
              onClick={() => setOpen(false)}
            >
              <User className="w-4 h-4 text-orange-500" />
              Profile
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
        </div>
      )}
    </div>
  );
}

