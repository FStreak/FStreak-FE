"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import PaymentContent from "./PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          <Navbar />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
