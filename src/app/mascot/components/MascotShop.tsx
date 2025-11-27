"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Coins, Sparkles } from "lucide-react";
import groundMascot from "@/premium mascot/ground mascot.png";
import { showInfo } from "@/lib/toast";

export default function MascotShop() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-orange-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
    >
      {/* ✨ ánh sáng quét qua card */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
      />

      {/* 🛍️ Header */}
      <div className="flex items-center gap-2 mb-5">
        <ShoppingBag className="w-6 h-6 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mascot Shop
        </h3>
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </div>

      {/* 🦊 Mascot Image */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-48 h-40 relative mb-4 flex items-center justify-center"
      >
        <Image
          src={groundMascot.src}
          alt="Mascot Shopping"
          width={200}
          height={160}
          className="object-contain drop-shadow-lg"
        />
        {/* vòng sáng nhỏ dưới chân */}
        <div className="absolute -bottom-3 w-28 h-2 rounded-full bg-orange-200/40 blur-md" />
      </motion.div>

      {/* 💬 Info */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 max-w-xs leading-relaxed">
        Exchange your{" "}
        <span className="text-orange-500 font-semibold">Streak Coins</span> for
        unique mascot outfits and accessories to level up your vibe! 🎁
      </p>

      {/* 💰 Coin balance */}
      <div 
        onClick={() => showInfo("Coming soon")}
        className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Coins className="w-4 h-4 text-yellow-500" />
        <span className="text-sm">Balance:</span>
        <span className="font-semibold text-orange-500">120 Coins</span>
      </div>

      {/* 🔗 Visit Shop Button */}
      <Link href="/shop" className="w-full flex justify-center">
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.03 }}
          className="w-40 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-300"
        >
          Visit Shop
        </motion.button>
      </Link>
    </motion.div>
  );
}
