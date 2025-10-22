"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlanSummary from "./components/PlanSummary";
import PaymentMethods from "./components/PaymentMethods";
import PaymentInstructions from "./components/PaymentInstructions";
import { Plan } from "@/components/plans/PlanCard"; // ✅ import đúng Plan chuẩn

export default function PaymentContent() {
  const [plan, setPlan] = useState<Plan | null>(null);

  // ✅ Lấy dữ liệu gói từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedPlan");
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch (err) {
        console.error("❌ Lỗi parse selectedPlan:", err);
      }
    }
  }, []);

  // ✅ Khi chọn phương thức thanh toán
  const handlePaymentMethod = (method: string) => {
    if (!plan) return;
    localStorage.setItem("selectedPayment", JSON.stringify({ method, plan }));
    window.location.href = `/payment/qr-code?method=${method}`;
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
        <Navbar />
        <p className="mt-10 text-lg">
          ⚠️ Không tìm thấy thông tin gói. Vui lòng quay lại chọn gói.
        </p>
        <button
          onClick={() => (window.location.href = "/plans")}
          className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all"
        >
          Quay lại trang chọn gói
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
        <PlanSummary plan={plan} /> {/* ✅ cùng kiểu dữ liệu chuẩn */}
        <PaymentMethods onSelect={handlePaymentMethod} />
        <PaymentInstructions />
      </div>
    </div>
  );
}
