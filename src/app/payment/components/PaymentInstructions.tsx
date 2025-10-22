"use client";

import { Card } from "@/components/ui/card";

export default function PaymentInstructions() {
  const steps = [
    "Kiểm tra gói bạn đã chọn",
    "Chọn phương thức thanh toán",
    "Quét mã QR hoặc nhập thông tin giao dịch trên ứng dụng của bạn",
    "Thực hiện thanh toán và chờ thông báo xác nhận",
    "Sau khi có thông báo xác nhận thành công, web sẽ tự động trở về trang chủ",
  ];

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Hướng dẫn thanh toán
        </h2>

        <ol className="space-y-3 text-gray-700 dark:text-gray-300">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start">
              <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
