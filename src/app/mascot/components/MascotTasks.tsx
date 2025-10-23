"use client";

import {
  CheckCircle2,
  Clock,
  Target,
  Flame,
  ClipboardList,
} from "lucide-react";

export default function MascotTasks() {
  const tasks = [
    {
      icon: <ClipboardList className="w-5 h-5 text-orange-500" />,
      title: "Complete one study session",
      status: "done",
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      title: "Maintain a 3-day streak",
      status: "in-progress",
    },
    {
      icon: <Target className="w-5 h-5 text-orange-500" />,
      title: "Share a StudyWall post",
      status: "new",
    },
  ];

  const statusStyle = {
    done: (
      <span className="inline-flex items-center gap-1 text-green-600 font-medium text-xs">
        <CheckCircle2 className="w-4 h-4" /> Completed
      </span>
    ),
    "in-progress": (
      <span className="inline-flex items-center gap-1 text-yellow-500 font-medium text-xs">
        <Clock className="w-4 h-4" /> In Progress
      </span>
    ),
    new: (
      <span className="inline-flex items-center gap-1 text-orange-500 font-medium text-xs">
        <Target className="w-4 h-4" /> New
      </span>
    ),
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-orange-100 dark:border-gray-800 rounded-3xl shadow-lg p-6 transition-all hover:shadow-2xl">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-orange-500" />
        Daily Tasks
      </h3>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 last:border-none group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                {task.icon}
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {task.title}
              </p>
            </div>
            {statusStyle[task.status as keyof typeof statusStyle]}
          </div>
        ))}
      </div>

      <button className="mt-6 w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300">
        Claim Rewards
      </button>
    </div>
  );
}
