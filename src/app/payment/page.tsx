"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

interface Plan {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');

  // Mock plan data - in real app, fetch based on planId
  const plans: Record<string, Plan> = {
    "1": {
      id: "1",
      title: "Team - CLUB",
      price: "80.000",
      period: "VND/tháng",
      features: ["Ad-free experience", "Unlimited members", "Frame Club"]
    },
    "2": {
      id: "2", 
      title: "Premium",
      price: "29.000",
      period: "VND/tháng",
      features: ["Ad-free experience", "Unlimited studyrooms", "Avatar frame", "Expression of the mascot series", "AI analysis"]
    },
    "3": {
      id: "3",
      title: "Unique Mascot", 
      price: "29.000",
      period: "VND/tháng",
      features: ["Special-shaped mascot", "Sold separately"]
    },
    "4": {
      id: "4",
      title: "Style Combo",
      price: "59.000", 
      period: "VND/tháng",
      features: ["Mascot Outfit", "Mascot Expression"]
    },
    "5": {
      id: "5",
      title: "Style Combo",
      price: "89.000",
      period: "VND/tháng", 
      features: ["Full new mascot combo", "10 bonus coins"]
    }
  };

  const selectedPlan = planId ? plans[planId] : plans["2"]; // Default to Premium if no planId

  const handlePaymentMethod = (method: string) => {
    // Navigate to QR code page with payment method
    router.push(`/payment/qr-code?method=${method}&planId=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Selected Plan Summary */}
        <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">GÓI BẠN CHỌN:</h2>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-orange-500 mb-4">
                {selectedPlan.title} ({selectedPlan.price} {selectedPlan.period})
              </h3>
              
              <ul className="space-y-2 mb-6">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">
                    - {feature}
                  </li>
                ))}
              </ul>
              
              <div className="text-xl font-bold">
                Tổng thanh toán: <span className="text-orange-500">{selectedPlan.price} VND</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choose your payment methods</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VNPAY Option */}
              <Button
                onClick={() => handlePaymentMethod('vnpay')}
                className="h-20 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">V</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Thanh toán qua VNPAY</span>
                </div>
                <div className="text-blue-600 font-bold text-lg">VNPAY</div>
              </Button>

              {/* MOMO Option */}
              <Button
                onClick={() => handlePaymentMethod('momo')}
                className="h-20 bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 hover:border-pink-300 rounded-xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Thanh toán qua MOMO</span>
                </div>
                <div className="text-pink-600 font-bold text-lg">MOMO</div>
              </Button>
            </div>
          </div>
        </Card>

        {/* Payment Instructions */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hướng dẫn thanh toán:</h2>
            
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                Kiểm tra gói bạn đã chọn
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                Chọn phương thức thanh toán
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                Quét mã QR hoặc nhập thông tin giao dịch trên ứng dụng của bạn
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                Thực hiện thanh toán và chờ thông báo xác nhận
              </li>
              <li className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                Sau khi có thông báo xác nhận thành công, web sẽ tự động trở về trang chủ
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
