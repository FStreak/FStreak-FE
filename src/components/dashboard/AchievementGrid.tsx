"use client";
import { Star, Flame, Trophy, Users } from "lucide-react";

export default function AchievementGrid() {
  const achievements = [
    { icon: Star, title: "First Step", desc: "Started your first lesson" },
    {
      icon: Flame,
      title: "7-Day Streak",
      desc: "1 week of continuous learning",
    },
    {
      icon: Trophy,
      title: "Lesson Master",
      desc: "Completed all quiz sessions",
    },
    { icon: Users, title: "Group Leader", desc: "Led a group study session" },
    { icon: Star, title: "Quick Learner", desc: "Top 10% in learning speed" },
    { icon: Star, title: "Consistency King", desc: "Perfect attendance" },
  ];

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Your Achievements
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {achievements.map((b, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-orange-50 dark:border-gray-700 shadow-sm hover:shadow-[0_6px_25px_rgba(255,140,0,0.15)] hover:border-orange-200 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-yellow-50 dark:from-orange-900/30 dark:to-amber-800/20 flex items-center justify-center mb-3 shadow-inner">
              <b.icon className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {b.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
