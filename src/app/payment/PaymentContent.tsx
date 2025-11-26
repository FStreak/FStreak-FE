"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlanSummary from "./components/PlanSummary";
import PaymentMethods from "./components/PaymentMethods";
import PaymentInstructions from "./components/PaymentInstructions";
import { Plan } from "@/components/plans/PlanCard";
import paymentService from "@/services/paymentService";
import { useRouter } from "next/navigation";

export default function PaymentContent() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

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

  // ✅ Parse giá tiền từ string (ví dụ: "30.000₫" -> 30000)
  const parsePrice = (priceStr: string): number => {
    // Loại bỏ ký tự không phải số
    const numStr = priceStr.replace(/[^\d]/g, "");
    return parseInt(numStr) || 0;
  };

  // ✅ Khi chọn phương thức thanh toán - Gọi API PayOS
  const handlePaymentMethod = async (method: string) => {
    if (!plan || isProcessing) return;

    setIsProcessing(true);

    try {
      const amount = parsePrice(plan.price);

      // Tạo payment link qua API
      const paymentData = {
        planId: plan.id,
        amount: amount,
        description: `Thanh toán gói ${plan.title} - FStreak`,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
      };

      console.log("📤 Đang tạo thanh toán:", paymentData);

      const response = await paymentService.createPayment(paymentData);

      console.log("✅ Nhận được payment URL:", response);

      // Lưu orderCode để check status sau
      localStorage.setItem("orderCode", response.orderCode);
      localStorage.setItem("selectedPayment", JSON.stringify({ method, plan }));

      // Redirect đến PayOS payment URL
      window.location.href = response.paymentUrl;
    } catch (error: any) {
      console.error("❌ Lỗi tạo thanh toán:", error);
      alert(
        error?.response?.data?.message ||
          "Không thể tạo thanh toán. Vui lòng thử lại!"
      );
      setIsProcessing(false);
    }
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
        <PlanSummary plan={plan} />
        <PaymentMethods onSelect={handlePaymentMethod} isProcessing={isProcessing} />
        <PaymentInstructions />
      </div>
    </div>
  );
}
