"use client";

import React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Sparkles } from "lucide-react"; // 🔥 icon chuyên nghiệp
import PlanList from "./PlanList";
import { Plan } from "./PlanCard";

type TabType = "individual" | "team" | "mascot";

interface PlanTabsProps {
  plans: Plan[];
  onBuyNow: (plan: Plan) => void;
}

export default function PlanTabs({ plans, onBuyNow }: PlanTabsProps) {
  const [tab, setTab] = useState<TabType>("individual");
  const hasMounted = useRef(false);

  // ✅ Nhóm gói theo tab
  const filteredPlans =
    tab === "individual"
      ? plans.filter((p) => ["1", "2", "5"].includes(p.id)) // Free, Premium, Full Combo
      : tab === "team"
      ? plans.filter((p) => ["3"].includes(p.id)) // Team / Club
      : plans.filter((p) => ["4"].includes(p.id)); // Mascot

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "individual",
      label: "Individual Plans",
      icon: <User className="w-5 h-5" />,
    },
    { id: "team", label: "Team / Club", icon: <Users className="w-5 h-5" /> },
    {
      id: "mascot",
      label: "Mascot & Combo",
      icon: <Sparkles className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* 🧭 TAB SWITCHER */}
      <div className="relative flex justify-center">
        <div className="flex bg-white/80 dark:bg-gray-900/70 rounded-2xl p-2 shadow-md backdrop-blur-md space-x-2 w-fit border border-gray-200 dark:border-gray-800">
          {tabs.map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  hasMounted.current = true;
                }}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-orange-500 to-yellow-400 shadow-md scale-[1.03]"
                    : "text-gray-600 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800/60"
                }`}
              >
                <div
                  className={`transition-colors duration-300 ${
                    isActive ? "text-white" : "text-orange-500"
                  }`}
                >
                  {item.icon}
                </div>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌈 Underline chuyển tab */}
      <motion.div
        layoutId="tabHighlight"
        className="absolute bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl h-[3px]"
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      />

      {/* 💎 PLAN LIST */}
      <AnimatePresence mode="sync">
        <motion.div
          key={tab}
          initial={
            hasMounted.current ? { opacity: 0, y: 25 } : { opacity: 1, y: 0 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
            duration: hasMounted.current ? 0.35 : 0,
          }}
        >
          <div className="flex justify-center">
            <div className="max-w-6xl w-full flex justify-center">
              <PlanList plans={filteredPlans} onBuyNow={onBuyNow} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
