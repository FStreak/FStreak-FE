"use client";

import { useEffect, useState } from "react";
import paymentService from "@/services/paymentService";
import type { PaymentHistoryDto } from "@/model/payment/PaymentHistoryModel";

interface UserPlan {
  planId: string;
  planName: string;
  isPremium: boolean;
  purchasedAt: string;
}

export const useUserPlan = () => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPlan = async () => {
      try {
        setLoading(true);
        
        // 1. Kiểm tra localStorage trước
        const savedPlan = localStorage.getItem("userPlan");
        if (savedPlan) {
          try {
            const plan = JSON.parse(savedPlan);
            setUserPlan(plan);
            setLoading(false);
            // Vẫn check API để đảm bảo sync
          } catch (err) {
            console.error("❌ Lỗi parse userPlan từ localStorage:", err);
          }
        }

        // 2. Lấy payment history từ API
        const paymentHistory = await paymentService.getMyPaymentHistory();
        
        // 3. Tìm payment thành công cho Premium plan
        const premiumPlans = ["2", "5"]; // Premium và Full Combo
        const successfulPayment = paymentHistory.find(
          (payment: PaymentHistoryDto) =>
            premiumPlans.includes(payment.planId) &&
            payment.status?.toLowerCase() === "paid"
        );

        if (successfulPayment) {
          // Xác định plan name dựa trên planId
          const planNames: Record<string, string> = {
            "2": "Premium",
            "5": "Full Combo",
          };
          
          const planData: UserPlan = {
            planId: successfulPayment.planId,
            planName: planNames[successfulPayment.planId] || "Premium",
            isPremium: true,
            purchasedAt: successfulPayment.completeAt || successfulPayment.createdAt,
          };

          // Lưu vào localStorage
          localStorage.setItem("userPlan", JSON.stringify(planData));
          setUserPlan(planData);
          console.log("✅ Đã cập nhật plan từ payment history:", planData);
        } else if (!savedPlan) {
          // Nếu không có payment thành công và không có plan trong localStorage
          // Set default là Free
          const defaultPlan: UserPlan = {
            planId: "1",
            planName: "Free",
            isPremium: false,
            purchasedAt: new Date().toISOString(),
          };
          localStorage.setItem("userPlan", JSON.stringify(defaultPlan));
          setUserPlan(defaultPlan);
        }
      } catch (error) {
        console.error("❌ Lỗi load user plan:", error);
        // Fallback về localStorage nếu API fail
        const savedPlan = localStorage.getItem("userPlan");
        if (savedPlan) {
          try {
            setUserPlan(JSON.parse(savedPlan));
          } catch (err) {
            console.error("❌ Lỗi parse userPlan:", err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserPlan();
  }, []);

  return { userPlan, loading };
};

