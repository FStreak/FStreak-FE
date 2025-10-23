"use client";

import Link from "next/link";

interface Reading {
  id: string;
  title: string;
  minutes: number;
}

export default function LessonReadings({ readings }: { readings: Reading[] }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
        Readings
      </h3>
      <ul className="space-y-3">
        {readings.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between p-3 border border-orange-100 dark:border-gray-700 rounded-xl hover:bg-orange-50/40 dark:hover:bg-gray-700/50 transition-all"
          >
            <div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {r.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Reading • {r.minutes} min
              </div>
            </div>
            <Link
              href={`#${r.id}`}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-sm font-semibold hover:shadow-md transition-all"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
