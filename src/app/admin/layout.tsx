"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenInfoStorage } from "@/store/authStore";
import { toast } from "@/lib/toast";
import { isAdmin } from "@/utils/auth";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useTokenInfoStorage();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Add small delay to allow store to hydrate from localStorage
    const checkAccess = async () => {
      // Check authentication
      if (!token) {
        toast.error("Vui lòng đăng nhập để truy cập trang này");
        router.replace("/login");
        return;
      }

      // Check if user has admin role
      const userIsAdmin = isAdmin(token);
      
      if (!userIsAdmin) {
        toast.error("Bạn không có quyền truy cập trang admin. Chỉ tài khoản admin mới được phép.");
        router.replace("/dashboard");
        return;
      }

      // User is authenticated and has admin role
      setIsChecking(false);
    };

    const timeoutId = setTimeout(() => {
      checkAccess();
    }, 50); // Small delay for store hydration

    return () => clearTimeout(timeoutId);
  }, [token, router]);

  // Show loading while checking
  if (isChecking || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-muted-foreground">Đang xác minh quyền admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <AdminNavbar />
      <main className="flex-1 px-6 py-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

