// ✅ src/app/page.tsx
"use client";

import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-orange-50">
        <h1 className="text-3xl font-bold">Welcome to F-Streak!</h1>
      </main>
    </>
  );
}
