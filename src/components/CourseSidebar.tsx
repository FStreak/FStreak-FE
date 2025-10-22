"use client";

import Link from "next/link";
import { BookOpen, Layers, MessageCircle, Mail, Info, Calendar } from "lucide-react";

export default function CourseSidebar({
  title = "Programming for Everybody (Getting Started with Python)",
  instructor = "University of Michigan",
  modules = [],
  baseHref = "",
}: {
  title?: string;
  instructor?: string;
  modules?: { id: string; title: string }[];
  baseHref?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded border bg-card">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center text-white font-bold">M</div>
          <div>
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-xs text-muted-foreground mt-1">{instructor}</div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded border bg-white">
        <div className="font-semibold mb-3">Course Material</div>
        <ul className="space-y-2">
          {modules.length ? modules.map(m => (
            <li key={m.id} className="flex items-center gap-2 text-sm">
              <input type="radio" name="module" className="accent-orange-500" />
              <Link href={`#${m.id}`} className="hover:underline">{m.title}</Link>
            </li>
          )) : (
            <li className="text-sm text-muted-foreground">No modules</li>
          )}
        </ul>
      </div>

        <nav className="p-3 rounded border bg-white space-y-2 text-sm">
          <a className="flex items-center gap-2" href={`${baseHref}/grades`}><Layers className="w-4 h-4"/> Grades</a>
          <a className="flex items-center gap-2" href={`${baseHref}/notes`}><BookOpen className="w-4 h-4"/> Notes</a>
          <a className="flex items-center gap-2" href={`${baseHref}/discussion`}><MessageCircle className="w-4 h-4"/> Discussion Forums</a>
          <a className="flex items-center gap-2" href={`${baseHref}/messages`}><Mail className="w-4 h-4"/> Messages <span className="ml-2 inline-block bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">1</span></a>
          <a className="flex items-center gap-2" href={`${baseHref}/resources`}><Info className="w-4 h-4"/> Resources</a>
          <a className="flex items-center gap-2" href={`${baseHref}/course-info`}><Calendar className="w-4 h-4"/> Course Info</a>
        </nav>
    </div>
  );
}
