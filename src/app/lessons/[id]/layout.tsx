import LessonSidebar from "@/components/lesson/LessonSidebar";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const id = (await params)?.id; // chỉ cần destructure đơn giản
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
