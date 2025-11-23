"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 shadow-sm hover:shadow-md text-gray-800 dark:text-gray-200 font-medium transition"
    >
      <ArrowLeft className="w-5 h-5 text-orange-500" />
      Back
    </motion.button>
  );
}
