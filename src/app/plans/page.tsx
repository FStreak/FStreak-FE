"use client";

import Navbar from "@/components/navbar/Navbar";
import PlanTabs from "@/components/plans/PlanTabs";
import { useTokenInfoStorage } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Plan } from "@/components/plans/PlanCard";

export default function PlansPage() {
  const router = useRouter();
  const { token } = useTokenInfoStorage();

  const handleBuyNow = (plan: Plan) => {
    if (!token) return router.push("/login");
    // Xóa customShopItems nếu có để tránh conflict
    localStorage.removeItem("customShopItems");
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    router.push("/payment");
  };

  const plans: Plan[] = [
    {
      id: "1",
      title: "Free",
      price: "0₫",
      period: "/month",
      features: [
        { text: "Basic access to lessons" },
        { text: "Limited study rooms" },
        { text: "Standard mascot" },
      ],
    },
    {
      id: "2",
      title: "Premium",
      price: "30.000₫",
      period: "/month",
      features: [
        { text: "Ad-free experience" },
        { text: "Unlimited studyrooms" },
        { text: "Custom mascot expressions" },
        { text: "AI study assistant" },
      ],
      isRecommended: true,
    },
    {
      id: "3",
      title: "Team / Club",
      price: "80.000₫",
      period: "/month",
      features: [
        { text: "Create or join study clubs" },
        { text: "Unlimited members" },
        { text: "Leaderboards & group XP" },
      ],
    },
    {
      id: "4",
      title: "Unique Mascot",
      price: "59.000₫",
      period: "/month",
      features: [
        { text: "Mascot outfit & styles" },
        { text: "Individual customization" },
      ],
    },
    {
      id: "5",
      title: "Full Combo",
      price: "89.000₫",
      period: "/month",
      features: [
        { text: "All Premium features" },
        { text: "Full mascot collection" },
        { text: "10 bonus coins" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16 text-center space-y-12">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent mb-3">
            Choose Your Membership Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base">
            Unlock advanced features to boost your F-Streak journey — faster,
            smarter, and with more style.
          </p>
        </div>

        {/* ✅ Tabs */}
        <PlanTabs plans={plans} onBuyNow={handleBuyNow} />
      </main>
    </div>
  );
}
