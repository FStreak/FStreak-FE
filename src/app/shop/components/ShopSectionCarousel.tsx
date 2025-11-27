"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ShopItem from "./ShopItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShopSectionProps {
  title: string;
  icon: React.ReactNode;
  items: {
    id: string | number;
    name: string;
    img: string;
    price?: number;
    locked?: boolean;
  }[];
  selectedItemId?: string | number | null;
  onItemSelect?: (item: { id: string | number; name: string; img: string; price?: number }) => void;
  category?: string;
}

export default function ShopSectionCarousel({
  title,
  icon,
  items,
  selectedItemId,
  onItemSelect,
  category,
}: ShopSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerView = 5;

  // 👈 Cuộn bằng nút trái / phải
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const width = container.offsetWidth;
    const distance = dir === "left" ? -width : width;
    container.scrollBy({ left: distance, behavior: "smooth" });
  };

  // 👀 Cập nhật chấm pagination khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container) return;
      const index = Math.round(container.scrollLeft / container.offsetWidth);
      setActiveIndex(index);
    };
    const container = scrollRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const totalPages = Math.ceil(items.length / itemsPerView);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-orange-100 dark:border-gray-800 rounded-3xl shadow-lg px-6 py-6 overflow-hidden group"
    >
      {/* Dải sáng trên */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        {icon}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>

      {/* Nút trái */}
      <button
        onClick={() => scroll("left")}
        className="absolute top-1/2 -translate-y-1/2 left-3 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:scale-110 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-4 h-4 text-orange-500" />
      </button>

      {/* 🧩 Carousel chính */}
      <div
        ref={scrollRef}
        className="
          flex 
          overflow-x-auto 
          overflow-y-hidden 
          scroll-smooth 
          snap-x snap-mandatory 
          gap-4 
          pb-2 
          no-scrollbar   /* ✅ ẩn scrollbar hoàn toàn */
          cursor-grab
          active:cursor-grabbing
        "
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 basis-[calc(20%-0.8rem)] snap-center"
          >
            <ShopItem
              key={item.id}
              name={item.name}
              img={item.img}
              price={item.price}
              locked={item.locked}
              selected={selectedItemId === item.id}
              onClick={() => {
                if (!item.locked && onItemSelect) {
                  onItemSelect(item);
                }
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Nút phải */}
      <button
        onClick={() => scroll("right")}
        className="absolute top-1/2 -translate-y-1/2 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:scale-110 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-4 h-4 text-orange-500" />
      </button>

      {/* Gradient mask 2 bên */}
      <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white dark:from-gray-900 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white dark:from-gray-900 via-transparent to-transparent pointer-events-none" />

      {/* 🟠 Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === activeIndex ? 1.1 : 1,
              opacity: i === activeIndex ? 1 : 0.5,
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === activeIndex
                ? "bg-gradient-to-r from-orange-500 to-yellow-400 shadow-md"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    </motion.section>
  );
}
