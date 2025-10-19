// ✅ src/app/page.tsx
"use client";

import { useTokenInfoStorage } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GuestNavbar from "@/components/GuestNavbar";
import LandingPage from "@/components/LandingPage";

export default function Page() {
  const { token } = useTokenInfoStorage();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã đăng nhập, redirect đến dashboard
    if (token) {
      router.push("/dashboard");
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
