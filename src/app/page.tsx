// ✅ src/app/page.tsx
"use client";

import { useTokenInfoStorage } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GuestNavbar from "@/components/GuestNavbar";
import LandingPage from "@/components/LandingPage";
import { isAdmin, isTeacher } from "@/utils/auth";

export default function Page() {
  const { token } = useTokenInfoStorage();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã đăng nhập, redirect dựa theo role
    if (token) {
      let targetPath = "/dashboard";
      if (isAdmin(token)) {
        targetPath = "/admin";
      } else if (isTeacher(token)) {
        targetPath = "/teacher";
      }
      router.push(targetPath);
    }
  }, [token, router]);

  // Nếu đã đăng nhập, không hiển thị gì (đang redirect)
  if (token) {
    return null;
  }

  // Hiển thị landing page cho guest
  return (
    <>
      <GuestNavbar />
      <LandingPage />
    </>
  );
}
