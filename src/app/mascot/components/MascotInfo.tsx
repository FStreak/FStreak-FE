"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function MascotInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-orange-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-8 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 overflow-hidden"
    >
      {/* ✨ ánh sáng chạy nhẹ trên card */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "linear",
        }}
      />

      <motion.div
        whileHover={{ rotate: 3, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative w-36 h-36 rounded-full border-4 border-orange-400 shadow-lg overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-50 flex items-center justify-center"
      >
        <Image
          src="/mascot-default.png"
          alt="Mascot"
          width={144}
          height={144}
          className="object-cover"
        />
        {/* 🔹 Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-200/20 to-transparent" />
      </motion.div>

      {/* 🧠 Info */}
      <div className="flex-1 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Foxy the Motivator
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow">
            LV. 5
          </span>
        </div>

        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
          Your loyal study companion that evolves as you maintain your streaks.
          Keep learning to unlock{" "}
          <span className="text-orange-500">new forms</span> and
          <span className="text-yellow-500"> special rewards</span>! 🌟
        </p>

        {/* 🟠 Progress Bar */}
        <div className="mt-5 w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400 rounded-full"
            style={{ width: "70%" }}
            animate={{
              backgroundPosition: ["0%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
          />
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Progress</span>
          <span className="text-orange-500 font-semibold">70%</span>
        </div>
      </div>
    </motion.div>
  );
}
