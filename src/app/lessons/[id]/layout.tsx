import { ReactNode } from "react";
import LessonSidebar from "@/components/lesson/LessonSidebar";

interface LessonLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>; // ✅ Next.js 15: params là Promise
}

export default async function LessonLayout({
  children,
  params,
}: LessonLayoutProps) {
  const { id } = await params; // ✅ Bắt buộc phải await
  const base = `/lessons/${id}`;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* 🧭 Sidebar */}
        <aside className="col-span-3">
          <LessonSidebar baseHref={base} lessonId={id} />
        </aside>

        {/* 📚 Nội dung chính */}
        <main className="col-span-9">{children}</main>
      </div>
    </div>
  );
}
