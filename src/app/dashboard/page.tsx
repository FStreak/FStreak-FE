"use client";
import Navbar from "@/components/navbar/Navbar";
import HeroSummary from "@/components/dashboard/HeroSummary";
import LearningProgress from "@/components/dashboard/LearningProgress";
import AchievementGrid from "@/components/dashboard/AchievementGrid";
import LeaderboardSection from "@/components/dashboard/LeaderboardSection";
import NotificationsList from "@/components/dashboard/NotificationsList";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDFBF8] dark:from-gray-950 dark:to-gray-900">
        <section className="max-w-6xl mx-auto px-6 py-16 space-y-20">
          <HeroSummary />
          <LearningProgress />
          <AchievementGrid />
          <LeaderboardSection />
          <NotificationsList />
        </section>
      </main>
    </>
  );
}
