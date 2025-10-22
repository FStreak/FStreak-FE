"use client";
import React from "react";
import Navbar from "@/components/Navbar";
export default function GradesPage() {
  return (
    <div className="space-y-4">
      <Navbar />
      <h2 className="text-lg font-semibold">Grades</h2>
      <div className="p-4 rounded border bg-card">
        <p className="text-sm text-muted-foreground">No grades available yet for this course.</p>
      </div>
      <div className="p-4 rounded border bg-card">
        <h3 className="font-medium">Assignments</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Quiz 1</span>
            <span className="text-muted-foreground">Not submitted</span>
          </li>
          <li className="flex justify-between">
            <span>Project 1</span>
            <span className="text-muted-foreground">85%</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
