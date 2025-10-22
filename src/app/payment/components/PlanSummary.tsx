"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: PlanFeature[]; // ✅ sửa lại kiểu
}

export default function PlanSummary({ plan }: { plan?: Plan }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plan ?? null);

  useEffect(() => {
    if (!plan) {
      const saved = localStorage.getItem("selectedPlan");
      if (saved) {
        try {
          setSelectedPlan(JSON.parse(saved));
        } catch (err) {
          console.error("❌ Lỗi parse selectedPlan:", err);
        }
      }
    }
  }, [plan]);

  if (!selectedPlan) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 dark:text-gray-400">
        Đang tải thông tin gói của bạn...
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-orange-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
      {/* 🌈 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-yellow-100/20 dark:from-orange-500/10 dark:to-yellow-400/10 pointer-events-none" />

      <div className="relative p-10 space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
          Gói bạn đã chọn
        </h2>

        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 border border-orange-100 dark:border-gray-700 shadow-inner p-8">
          <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2 text-center">
            {selectedPlan.title}
          </h3>

          <div className="text-center mb-6">
            <span className="text-4xl font-extrabold text-orange-600 dark:text-orange-400">
              {selectedPlan.price}
            </span>
            <span className="text-base text-gray-500 dark:text-gray-400 ml-1">
              {selectedPlan.period}
            </span>
          </div>

          <ul className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            {selectedPlan.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-3 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                {feature.text} {/* ✅ sửa lại để lấy đúng field */}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-orange-100 dark:border-gray-700 pt-5 text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tổng thanh toán
            </p>
            <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 mt-1">
              {selectedPlan.price} VND
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
