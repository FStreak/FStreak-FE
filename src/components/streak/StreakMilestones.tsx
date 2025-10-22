"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function StreakMilestones() {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-semibold mb-3 text-lg text-gray-800">
            Streak Milestones
          </div>
          <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
            <li>🔥 Achieved 7-day streak!</li>
            <li>🎯 Started new streak!</li>
            <li>🏆 Reached 30-day streak!</li>
          </ul>
        </div>
        <div className="w-40 h-40 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center shadow-inner">
          <span className="text-5xl">🔥</span>
        </div>
      </CardContent>
    </Card>
  );
}
