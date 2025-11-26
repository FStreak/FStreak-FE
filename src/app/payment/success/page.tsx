"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import paymentService from "@/services/paymentService";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"checking" | "success" | "failed">("checking");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Lấy orderCode từ localStorage hoặc URL params
        const orderCode = localStorage.getItem("orderCode") || searchParams.get("orderCode");
        
        if (!orderCode) {
          setStatus("failed");
          return;
        }

        console.log("🔍 Đang kiểm tra trạng thái thanh toán:", orderCode);

        // Gọi API check status
        const result = await paymentService.getPaymentStatus(orderCode);
        
        console.log("✅ Kết quả thanh toán:", result);
        
        setPaymentInfo(result);
        
        if (result.status === "Completed" || result.status === "PAID") {
          setStatus("success");
          // Xóa localStorage
          localStorage.removeItem("orderCode");
          localStorage.removeItem("selectedPlan");
          localStorage.removeItem("selectedPayment");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("❌ Lỗi kiểm tra thanh toán:", error);
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Đang xác nhận thanh toán...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
          <XCircle className="w-24 h-24 text-red-500" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Thanh toán thất bại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push("/plans")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all"
            >
              Chọn gói khác
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold transition-all"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 px-6">
        <div className="animate-bounce">
          <CheckCircle className="w-24 h-24 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">
          🎉 Thanh toán thành công!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Cảm ơn bạn đã nâng cấp tài khoản FStreak. Bạn đã có thể sử dụng đầy đủ
          các tính năng premium!
        </p>

        {paymentInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {paymentInfo.orderCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Số tiền:</span>
              <span className="font-semibold text-orange-500">
                {paymentInfo.amount?.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Mô tả:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-right">
                {paymentInfo.description}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-lg text-white rounded-lg font-semibold transition-all"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
