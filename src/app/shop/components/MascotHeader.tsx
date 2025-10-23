"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MascotHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-16 relative">
      {/* Hiệu ứng sáng */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100/40 via-transparent to-transparent blur-3xl -z-10" />

      {/* Mascot Avatar */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-32 h-32 rounded-full border-[5px] border-orange-400 bg-gradient-to-br from-yellow-100 to-orange-50 flex items-center justify-center shadow-xl relative"
      >
        <Image
          src="/mascot-default.png"
          alt="Mascot"
          width={110}
          height={110}
          className="object-contain"
        />
        <div className="absolute -bottom-3 w-24 h-2 rounded-full bg-orange-300/30 blur-md" />
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
