"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ApplyButton() {
  return (
    <div className="flex justify-center mt-16">
      <motion.button
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
