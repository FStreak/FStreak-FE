"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApplyButtonProps {
  selectedMascot?: { id: string | number; name: string; img: string; price?: number } | null;
  selectedFrame?: { id: string | number; name: string; img: string; price?: number } | null;
}

export default function ApplyButton({ selectedMascot, selectedFrame }: ApplyButtonProps) {
  const router = useRouter();

  const handleApply = () => {
    // Xóa selectedPlan nếu có để tránh conflict
    localStorage.removeItem("selectedPlan");
    // Lưu selected items vào localStorage để trang payment có thể sử dụng
    const customItems = {
      mascot: selectedMascot,
      frame: selectedFrame,
      totalPrice: (selectedMascot?.price || 0) + (selectedFrame?.price || 0),
    };
    localStorage.setItem("customShopItems", JSON.stringify(customItems));
    router.push("/payment");
  };

  return (
    <div className="flex justify-center mt-16">
      <motion.button
        onClick={handleApply}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all"
      >
        <Sparkles className="w-5 h-5" />
        Apply Changes
      </motion.button>
    </div>
  );
}
