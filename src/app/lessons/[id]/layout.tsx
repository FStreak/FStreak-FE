import CourseSidebar from "@/components/CourseSidebar";

export default async function LessonLayout({children, params}: {children: React.ReactNode; params: {id?: string} | Promise<{id: string}>}){
  // Server component: params might be a Promise depending on Next.js internals — await if needed.
  function isPromiseLike(obj: unknown): obj is Promise<{id: string}> {
    // We need to defensively check for a `then` property on unknown — allow an any cast here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!obj && typeof obj === 'object' && 'then' in (obj as object) && typeof (obj as any)['then'] === 'function';
  }

  const resolvedParams = isPromiseLike(params) ? await params : params as {id?: string};
  const id = resolvedParams?.id;
  const base = `/lessons/${id ?? ''}`;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          <CourseSidebar baseHref={base} />
        </aside>

        <main className="col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}
