"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";

interface CoinDisplayProps {
  amount: number;
}

export default function CoinDisplay({ amount }: CoinDisplayProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold shadow-md"
    >
      <Coins className="w-4 h-4" />
      {amount} Coins
    </motion.div>
  );
}
