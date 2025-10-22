"use client";
import { Flame } from "lucide-react";

export default function HeroSummary() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-10 shadow-[0_8px_40px_rgba(255,140,0,0.30)] overflow-hidden border border-white/30 flex flex-col md:flex-row items-center justify-between">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-sm">
          28-Day Streak 🔥
        </h1>
        <p className="mt-4 text-white/90 text-base max-w-md leading-relaxed">
          You’ve been learning consistently for almost a month. Keep up your
          streak and unlock new milestones!
        </p>
      </div>

      <div className="relative flex flex-col items-center mt-8 md:mt-0">
        <div className="w-36 h-36 bg-white/25 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center shadow-inner ring-1 ring-white/20">
          <Flame className="w-16 h-16 text-white animate-pulse" />
        </div>
        <p className="mt-3 text-sm text-white/80">Your Mascot</p>
      </div>
    </div>
  );
}
