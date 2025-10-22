"use client";
import { Bell, Users, Star } from "lucide-react";

export default function NotificationsList() {
  const notifications = [
    { icon: Bell, msg: "New lesson on Time Management is live!" },
    { icon: Users, msg: "Study group challenge updated" },
    { icon: Star, msg: "You’ve unlocked the ‘Focus Master’ badge!" },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Notifications
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-orange-50 dark:border-gray-700 shadow-sm">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-none hover:bg-gradient-to-r from-orange-50 to-yellow-50 dark:hover:bg-gray-700/40 rounded-xl px-3 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-orange-200/50">
              <n.icon className="w-5 h-5" />
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">
              {n.msg}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
