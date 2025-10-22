"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import Navbar from "@/components/Navbar";
const mockLesson = {
  id: 'l1',
  title: 'Introduction to Advanced Algebra',
  video: {
    title: 'Lecture 1: Why we Program?',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    minutes: 6,
  },
  readings: [
    { id: 'r1', title: 'Welcome to the Class', minutes: 10 },
    { id: 'r2', title: 'Course Syllabus', minutes: 10 },
  ],
};

export default function LessonDetailPage(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold mb-3">{mockLesson.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="font-medium text-sm text-muted-foreground">{mockLesson.video.title} • {mockLesson.video.minutes} min</div>
                  <div className="mt-3">
                    <video controls src={mockLesson.video.src} className="w-full rounded" />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Readings</h3>
                  <ul className="space-y-3">
                    {mockLesson.readings.map(r => (
                      <li key={r.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-muted-foreground">Reading • {r.minutes} min</div>
                        </div>
                        <Link href={`#/`} className="px-3 py-1 rounded bg-orange-50 text-orange-600">Open</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="space-y-4">
              <Card>
                <CardContent>
                  <h3 className="font-semibold">About this lesson</h3>
                  <p className="text-sm text-muted-foreground mt-2">This lesson introduces core concepts used throughout the course.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
