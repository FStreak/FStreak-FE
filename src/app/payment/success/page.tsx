"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import paymentService from "@/services/paymentService";
import Navbar from "@/components/navbar/Navbar"; // ✅ Thay đổi từ named import sang default import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ Tách component sử dụng useSearchParams ra riêng
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [planName, setPlanName] = useState<string>("Premium");

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    
    if (!orderCode) {
      setStatus("failed");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        console.log("🔍 Đang kiểm tra trạng thái thanh toán:", orderCode);
        const result = await paymentService.getPaymentStatus(orderCode);
        console.log("✅ Kết quả thanh toán:", result);
        
        setPaymentData(result);
        const isPaid = result.status?.toLowerCase() === "paid";
        setStatus(isPaid ? "success" : "failed");

        // ✅ Nếu thanh toán thành công, cập nhật plan status
        if (isPaid) {
          const selectedPayment = localStorage.getItem("selectedPayment");
          if (selectedPayment) {
            try {
              const payment = JSON.parse(selectedPayment);
              // Nếu có plan, lưu plan status vào localStorage
              if (payment.plan) {
                const isPremium = payment.plan.id === "2" || payment.plan.id === "5"; // Premium hoặc Full Combo
                setPlanName(payment.plan.title);
                localStorage.setItem("userPlan", JSON.stringify({
                  planId: payment.plan.id,
                  planName: payment.plan.title,
                  isPremium: isPremium,
                  purchasedAt: new Date().toISOString(),
                }));
                console.log(`✅ Đã cập nhật plan thành ${payment.plan.title}`);
              }
            } catch (err) {
              console.error("❌ Lỗi parse selectedPayment:", err);
            }
          }
        }
      } catch (error) {
        console.error("❌ Lỗi kiểm tra thanh toán:", error);
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-lg font-medium">Đang xác nhận thanh toán...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">
              Thanh toán thành công! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Mã đơn hàng:</p>
              <p className="font-mono font-semibold">{paymentData?.orderCode}</p>
              
              {paymentData?.amount && (
                <>
                  <p className="text-sm text-muted-foreground mt-3">Số tiền:</p>
                  <p className="text-xl font-bold text-green-600">
                    {paymentData.amount.toLocaleString()} VNĐ
                  </p>
                </>
              )}
            </div>

            <p className="text-center text-muted-foreground">
              Tài khoản của bạn đã được nâng cấp lên {planName}!
            </p>

            <div className="flex gap-3">
              <Button 
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Về Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/profile")}
                className="flex-1"
              >
                Xem Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-20 w-20 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            Thanh toán thất bại
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>

          <div className="flex gap-3">
            <Button 
              onClick={() => router.push("/plans")}
              className="flex-1"
            >
              Thử lại
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex-1"
            >
              Về Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ Wrap component chính trong Suspense
export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-lg font-medium">Đang tải...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </>
  );
}
