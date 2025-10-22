"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const mockLessons = [
  { id: 'l1', title: 'Basic Calculus', level: 'Beginner', desc: 'Understand the fundamentals of derivatives and integrals', progress: 65 },
  { id: 'l2', title: 'Physics Fundamentals', level: 'Beginner', desc: 'Explore the laws of motion and energy', progress: 20 },
  { id: 'l3', title: 'Introduction to Python', level: 'Intermediate', desc: 'Learn the basics of programming with Python', progress: 0 },
  { id: 'l4', title: 'Spanish for Travelers', level: 'Beginner', desc: 'Essential phrases and grammar for your next trip', progress: 40 },
];

export default function LessonsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">LESSONS</h1>
            <p className="text-sm text-muted-foreground mt-2">Continue learning and track progress across lessons.</p>
          </div>
          <div className="space-x-3">
            <Link href="/lessons/continue" className="px-4 py-2 bg-orange-500 text-white rounded">Continue Lesson</Link>
            <Link href="/lessons/new" className="px-4 py-2 border rounded">Create Lesson</Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockLessons.map(l => (
                <div key={l.id} className="relative p-4 rounded border bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-foreground">{l.title}</div>
                    <div className="text-xs text-muted-foreground uppercase">{l.level}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">{l.desc}</div>
                  <Link href={`/lessons/${l.id}`} className="inline-block px-3 py-2 bg-orange-50 text-orange-600 rounded">Start Lesson • {l.progress}%</Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
