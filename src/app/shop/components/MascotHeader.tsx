"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface MascotHeaderProps {
  selectedMascot?: { img: string; name: string } | null;
  selectedFrame?: { img: string; name: string } | null;
}

export default function MascotHeader({ selectedMascot, selectedFrame }: MascotHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-16 relative">
      {/* Hiệu ứng sáng */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100/40 via-transparent to-transparent blur-3xl -z-10" />

      {/* Mascot Avatar with Frame */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-32 h-32 rounded-full flex items-center justify-center shadow-xl relative"
      >
        {/* Frame layer - hiển thị ở ngoài cùng, bao quanh toàn bộ */}
        {selectedFrame ? (
          <div className="absolute inset-0 rounded-full overflow-hidden z-0">
            <Image
              src={selectedFrame.img}
              alt={selectedFrame.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="absolute inset-0 rounded-full border-[5px] border-orange-400 bg-gradient-to-br from-yellow-100 to-orange-50 z-0" />
        )}
        
        {/* Mascot layer - hiển thị ở giữa, không có nền, chỉ có ảnh mascot */}
        <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden" style={{ backgroundColor: 'transparent' }}>
          <Image
            src={selectedMascot?.img || "/mascot-default.png"}
            alt={selectedMascot?.name || "Mascot"}
            width={80}
            height={80}
            className="object-contain w-full h-full"
            style={{ 
              backgroundColor: 'transparent',
            }}
            unoptimized
          />
        </div>
        <div className="absolute -bottom-3 w-24 h-2 rounded-full bg-orange-300/30 blur-md z-20" />
      </motion.div>

      {/* Title */}
      <h1 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
        Mascot Customization
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mt-2">
        Personalize your mascot’s look with exclusive skins, frames, and
        outfits.
      </p>
    </div>
  );
}
