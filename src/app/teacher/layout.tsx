"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenInfoStorage } from "@/store/authStore";
import { isTeacher } from "@/utils/auth";
import { toast } from "@/lib/toast";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useTokenInfoStorage();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Add small delay to allow store to hydrate from localStorage
    const checkAccess = setTimeout(() => {
      console.log('🔍 Teacher Layout - Checking access with token:', token ? 'Present' : 'Missing');
      
      // Check authentication
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        toast.error("Please login to access this page");
        router.replace("/login");
        return;
      }

      // Check if user is a teacher
      const hasTeacherRole = isTeacher(token);
      console.log('🎓 Is teacher?', hasTeacherRole);
      
      if (!hasTeacherRole) {
        console.log('❌ Not a teacher, redirecting to dashboard');
        toast.error("Access denied. This page is for teachers only.");
        router.replace("/dashboard");
        return;
      }
      
      console.log('✅ Access granted - rendering teacher page');
      setIsChecking(false);
    }, 50); // Small delay for store hydration

    return () => clearTimeout(checkAccess);
  }, [token, router]);

  // Show loading while checking
  if (isChecking || !token || !isTeacher(token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-muted-foreground">Verifying teacher access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

