"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, Coins } from "lucide-react";

interface ShopItemProps {
  name: string;
  img: string;
  price?: number;
  locked?: boolean;
}

export default function ShopItem({
  name,
  img,
  price = 50,
  locked = false,
}: ShopItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center justify-center p-5 rounded-2xl 
        bg-gradient-to-br from-white to-orange-50/20 dark:from-gray-800 dark:to-gray-900 
        border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl 
        transition-all group cursor-pointer overflow-hidden
        ${locked ? "opacity-80 grayscale" : "opacity-100"}
      `}
    >
      {/* 🖼️ Ảnh sản phẩm */}
      <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-inner relative">
        <Image
          src={img}
          alt={name}
          width={90}
          height={90}
          className="object-contain transition-all group-hover:scale-105"
        />
        {locked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
            <Lock className="w-6 h-6 text-white/90" />
          </div>
        )}
      </div>

      {/* 🏷️ Tên */}
      <span
        className={`mt-3 text-sm font-medium transition-colors ${
          locked
            ? "text-gray-500 dark:text-gray-500"
            : "text-gray-700 dark:text-gray-300 group-hover:text-orange-500"
        }`}
      >
        {name}
      </span>

      {/* 💰 Giá tiền */}
      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600 dark:text-gray-400">
        <Coins className="w-3.5 h-3.5 text-yellow-500" />
        <span
          className={`${
            locked ? "opacity-70" : "font-semibold text-orange-500"
          }`}
        >
          {price}
        </span>
      </div>

      {/* ✨ Hiệu ứng sáng khi hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-orange-100/40 to-transparent blur-xl rounded-2xl transition-all" />
    </motion.div>
  );
}
