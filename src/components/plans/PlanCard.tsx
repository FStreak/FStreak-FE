"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface PlanFeature {
  text: string;
}

export interface Plan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: PlanFeature[];
  isRecommended?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onBuyNow: (plan: Plan) => void;
}

export default function PlanCard({ plan, onBuyNow }: PlanCardProps) {
  const recommended = plan.isRecommended;

  // ✅ Kiểm tra nếu plan là miễn phí
  const isFree =
    plan.price.trim() === "0₫" ||
    plan.price.trim() === "0" ||
    plan.price.toLowerCase().includes("free");

  return (
    <Card
      className={`relative flex flex-col items-center justify-between text-center h-full min-h-[460px] rounded-3xl border transition-all duration-500 backdrop-blur-md
        ${
          recommended
            ? "border-transparent shadow-[0_0_35px_rgba(255,165,0,0.25)] bg-gradient-to-b from-orange-100 via-yellow-50 to-white scale-[1.05]"
            : "border-gray-200 hover:border-orange-200 hover:shadow-lg bg-white dark:bg-gray-900"
        }`}
    >
      {/* 🏅 Recommended Badge */}
      {recommended && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-xs font-semibold py-2 rounded-t-3xl tracking-wide">
          ⭐ RECOMMENDED
        </div>
      )}

      {/* 📦 Nội dung */}
      <div className="flex flex-col items-center justify-between p-8 pt-12 w-full h-full">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {plan.title}
        </h3>

        {/* Price */}
        <div className="mb-6">
          <span
            className={`text-4xl font-extrabold ${
              recommended
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent"
                : "text-orange-500"
            }`}
          >
            {plan.price}
          </span>
          <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
        </div>

        {/* Features */}
        <ul className="text-sm text-gray-700 dark:text-gray-300 text-left mb-8 space-y-2 w-fit mx-auto">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>{f.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={() => !isFree && onBuyNow(plan)}
          disabled={isFree}
          className={`w-full font-semibold rounded-xl py-2.5 transition-all duration-300 ${
            isFree
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : recommended
              ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:shadow-[0_0_20px_rgba(255,165,0,0.4)]"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {isFree
            ? "In Current Plan"
            : recommended
            ? "Upgrade Now"
            : "Get This Plan"}
        </Button>
      </div>

      {/* ✨ Glow effect dưới card */}
      {recommended && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 blur-xl opacity-60" />
      )}
    </Card>
  );
}
