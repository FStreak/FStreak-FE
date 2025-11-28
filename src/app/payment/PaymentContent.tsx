"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlanSummary from "./components/PlanSummary";
import PaymentMethods from "./components/PaymentMethods";
import PaymentInstructions from "./components/PaymentInstructions";
import { Plan } from "@/components/plans/PlanCard";
import paymentService from "@/services/paymentService";
import { useRouter } from "next/navigation";

interface CustomShopItems {
  mascot?: { id: string | number; name: string; img: string; price?: number } | null;
  frame?: { id: string | number; name: string; img: string; price?: number } | null;
  totalPrice: number;
}

export default function PaymentContent() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [customItems, setCustomItems] = useState<CustomShopItems | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // ✅ Lấy dữ liệu từ localStorage (plan hoặc custom shop items)
  useEffect(() => {
    // Kiểm tra selectedPlan trước (ưu tiên plan từ plans page)
    const savedPlan = localStorage.getItem("selectedPlan");
    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan));
        // Nếu có plan, xóa customShopItems để tránh conflict
        localStorage.removeItem("customShopItems");
        return;
      } catch (err) {
        console.error("❌ Lỗi parse selectedPlan:", err);
      }
    }
    
    // Nếu không có plan, kiểm tra custom shop items
    const customShopItems = localStorage.getItem("customShopItems");
    if (customShopItems) {
      try {
        setCustomItems(JSON.parse(customShopItems));
      } catch (err) {
        console.error("❌ Lỗi parse customShopItems:", err);
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
    if ((!plan && !customItems) || isProcessing) return;

    setIsProcessing(true);

    try {
      let amount: number;
      let description: string;
      let paymentData: any;

      if (customItems) {
        // Thanh toán cho custom shop items
        amount = customItems.totalPrice;
        const itemsList = [
          customItems.mascot?.name,
          customItems.frame?.name,
        ].filter(Boolean).join(", ");
        description = `Thanh toán custom items: ${itemsList} - FStreak`;
        
        paymentData = {
          customItems: customItems,
          amount: amount,
          description: description,
          returnUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        };
      } else if (plan) {
        // Thanh toán cho plan
        amount = parsePrice(plan.price);
        description = `Thanh toán gói ${plan.title} - FStreak`;
        
        paymentData = {
          planId: plan.id,
          amount: amount,
          description: description,
          returnUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        };
      } else {
        return;
      }

      console.log("📤 Đang tạo thanh toán:", paymentData);

      const response = await paymentService.createPayment(paymentData);

      console.log("✅ Nhận được payment URL:", response);

      // Lưu orderCode để check status sau
      localStorage.setItem("orderCode", response.orderCode);
      if (customItems) {
        localStorage.setItem("selectedPayment", JSON.stringify({ method, customItems }));
      } else if (plan) {
        localStorage.setItem("selectedPayment", JSON.stringify({ method, plan }));
      }

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

  if (!plan && !customItems) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
        <Navbar />
        <p className="mt-10 text-lg">
          ⚠️ Không tìm thấy thông tin thanh toán. Vui lòng quay lại.
        </p>
        <button
          onClick={() => {
            window.location.href = "/shop";
          }}
          className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all"
        >
          Quay lại Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
        {customItems ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Custom Shop Items
            </h2>
            <div className="space-y-3">
              {customItems.mascot && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    {customItems.mascot.name}
                  </span>
                  <span className="font-semibold text-orange-500">
                    {customItems.mascot.price || 0} coins
                  </span>
                </div>
              )}
              {customItems.frame && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    {customItems.frame.name}
                  </span>
                  <span className="font-semibold text-orange-500">
                    {customItems.frame.price || 0} coins
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-xl font-bold text-orange-500">
                  {customItems.totalPrice} coins
                </span>
              </div>
            </div>
          </div>
        ) : (
          <PlanSummary plan={plan!} />
        )}
        <PaymentMethods onSelect={handlePaymentMethod} isProcessing={isProcessing} />
        <PaymentInstructions />
      </div>
    </div>
  );
}
