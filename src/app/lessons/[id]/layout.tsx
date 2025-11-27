import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import LessonSidebar from "@/components/lesson/LessonSidebar";

interface LessonLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

export default async function LessonLayout({
  children,
  params,
}: LessonLayoutProps) {
  const { id } = await params;
  const base = `/lessons/${id}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* 🧭 Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-6">
              <LessonSidebar baseHref={base} lessonId={id} />
            </div>
          </aside>

          {/* 📚 Nội dung chính */}
          <main className="col-span-12 lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
