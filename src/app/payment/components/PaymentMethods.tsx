"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CreditCard, Smartphone } from "lucide-react";

interface PaymentMethodsProps {
  onSelect: (method: string) => void;
}

export default function PaymentMethods({ onSelect }: PaymentMethodsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (method: string) => {
    setSelected(method);
    onSelect(method);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/95 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md"
    >
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 text-center bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
        Chọn phương thức thanh toán
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* VNPAY */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect("vnpay")}
          className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 p-6 flex items-center justify-between 
            ${
              selected === "vnpay"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/40 dark:from-gray-800 dark:to-gray-900"
            }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Thanh toán qua VNPAY
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hỗ trợ thẻ nội địa & ngân hàng
              </p>
            </div>
          </div>
          {selected === "vnpay" && (
            <span className="text-blue-600 font-bold text-lg">✓</span>
          )}
        </motion.div>

        {/* MOMO */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect("momo")}
          className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 p-6 flex items-center justify-between 
            ${
              selected === "momo"
                ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
                : "border-pink-200 hover:border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100/40 dark:from-gray-800 dark:to-gray-900"
            }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Thanh toán qua MOMO
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ví điện tử phổ biến tại Việt Nam
              </p>
            </div>
          </div>
          {selected === "momo" && (
            <span className="text-pink-600 font-bold text-lg">✓</span>
          )}
        </motion.div>
      </div>

      {/* Gợi ý */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        💡 Chọn một phương thức để tiếp tục đến bước thanh toán
      </p>
    </motion.div>
  );
}
