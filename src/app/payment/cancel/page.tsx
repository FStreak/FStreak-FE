"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Xóa dữ liệu tạm trong localStorage
    localStorage.removeItem("orderCode");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F3] via-white to-[#FFF4EA] dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 px-6">
        <XCircle className="w-24 h-24 text-yellow-500" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">
          Thanh toán đã bị hủy
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          Bạn đã hủy quá trình thanh toán. Bạn có thể quay lại chọn gói khác hoặc
          thử lại sau.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md w-full">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 <strong>Gợi ý:</strong> Nếu bạn gặp vấn đề trong quá trình thanh toán,
            hãy liên hệ với chúng tôi để được hỗ trợ!
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push("/plans")}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:shadow-lg text-white rounded-lg font-semibold transition-all"
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
