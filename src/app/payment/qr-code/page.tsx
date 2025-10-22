"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar/Navbar";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";

interface SelectedPayment {
  method: string;
  plan: {
    id: string;
    title: string;
    price: string;
  };
}

function QRCodePaymentContent() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [payment, setPayment] = useState<SelectedPayment | null>(null);

  // 🧠 Lấy dữ liệu từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedPayment");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPayment(parsed);
      } catch (err) {
        console.error("❌ Lỗi đọc dữ liệu thanh toán:", err);
      }
    }
  }, []);

  // ⛔ Nếu chưa có dữ liệu -> quay lại /payment
  if (!payment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <Navbar />
        <p className="mt-6">Không tìm thấy thông tin gói thanh toán.</p>
        <Button
          onClick={() => router.push("/payment")}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const { method, plan } = payment;
  const accountNumber = "2510200436548";
  const bankName = "Ngân hàng thương mại cổ phần Á Châu (ACB)";
  const accountName = "Web học tập - F-Streak";

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button onClick={handleBack} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* ✅ QR Section */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl mb-8">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {method === "vnpay"
                ? "Thanh toán qua VNPAY"
                : "Thanh toán qua MOMO"}
            </h2>

            {/* QR Placeholder */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 mb-6 inline-block">
              <div className="w-64 h-64 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-200 dark:bg-gray-500 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      QR Code
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {method === "vnpay" ? "VNPAY QR Code" : "MOMO QR Code"}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ngân hàng ACB - Gói {plan.title} {plan.price}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Lưu ý: Vui lòng chụp màn hình giao dịch để admin xử lý nếu có lỗi.
            </p>
          </div>
        </Card>

        {/* ✅ Thông tin ngân hàng */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl mb-8">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Thông tin tài khoản
            </h3>

            <div className="space-y-4">
              {/* Account Number */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Số tài khoản:
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {accountNumber}
                  </p>
                </div>
                <Button
                  onClick={handleCopyAccountNumber}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Bank Name */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ngân hàng:
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {bankName}
                </p>
              </div>

              {/* Account Name */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tên tài khoản:
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {accountName}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ✅ Hướng dẫn */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Hướng dẫn thanh toán
            </h3>

            <ol className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold">
                    Mở ứng dụng {method === "vnpay" ? "VNPAY" : "MOMO"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Trên điện thoại của bạn
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold">Quét mã QR hoặc chuyển khoản</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sử dụng thông tin tài khoản bên trên
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold">
                    Nhập số tiền: {plan.price} VND
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đảm bảo số tiền chính xác
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                  4
                </span>
                <div>
                  <p className="font-semibold">Hoàn tất giao dịch</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chờ thông báo xác nhận
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function QRCodePayment() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        </div>
      }
    >
      <QRCodePaymentContent />
    </Suspense>
  );
}
