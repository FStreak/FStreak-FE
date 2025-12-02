"use client";

import React from "react";
import { ClipboardList, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function GradesPage() {
  const assignments = [
    { name: "Quiz 1", status: "Not submitted", score: null },
    { name: "Project 1", status: "Submitted", score: 85 },
  ];

  return (
    <div className="space-y-10">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="flex justify-center">
            <ClipboardList className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
            Grades
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Track your progress and see how well you&apos;re performing in each
            course.
          </p>
        </header>

        {/* No grades yet */}
        <Card className="rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center text-gray-600 dark:text-gray-300">
            <BookOpen className="w-6 h-6 text-orange-400 mx-auto mb-3" />
            <p className="text-sm">No grades available yet for this course.</p>
          </CardContent>
        </Card>

        {/* Assignments section */}
        <Card className="rounded-2xl border border-orange-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Assignments
            </h3>

            <ul className="space-y-4">
              {assignments.map((a, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b last:border-0 border-orange-100 dark:border-gray-700 pb-3"
                >
                  <div className="flex items-center gap-3">
                    {a.score ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {a.name}
                    </span>
                  </div>

                  <div className="text-right">
                    {a.score ? (
                      <span className="text-sm text-orange-600 font-semibold">
                        {a.score}%
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Not submitted
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
    </div>
  );
}
