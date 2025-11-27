"use client";

import Navbar from "@/components/navbar/Navbar";
import BackButton from "./components/BackButton";
import CoinDisplay from "./components/CoinDisplay";
import MascotHeader from "./components/MascotHeader";
import ShopSectionCarousel from "./components/ShopSectionCarousel";
import ApplyButton from "./components/ApplyButton";
import { Flame, Circle, UserCircle2, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { shopApiService } from "@/services/ShopApiService";
import type { ShopItemDto } from "@/model/admin/adminTypes";
import { showError } from "@/lib/toast";

// Category mapping with icons
const categoryConfig: Record<string, { title: string; icon: React.ReactNode }> = {
  Skin: {
    title: "Skin",
    icon: <Flame className="w-5 h-5 text-orange-500" />,
  },
  Frame: {
    title: "Intellectual Profile Frame",
    icon: <Circle className="w-5 h-5 text-orange-500" />,
  },
  Mascot: {
    title: "Mascot Body",
    icon: <UserCircle2 className="w-5 h-5 text-orange-500" />,
  },
  Club: {
    title: "Club Frame",
    icon: <Palette className="w-5 h-5 text-orange-500" />,
  },
};

export default function ShopPage() {
  const [coins, setCoins] = useState(120);
  const [shopItems, setShopItems] = useState<ShopItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShopItems();
  }, []);

  const loadShopItems = async () => {
    try {
      setLoading(true);
      const items = await shopApiService.getShopItems(true); // activeOnly = true
      setShopItems(items);
    } catch (error: any) {
      console.error("Error loading shop items:", error);
      showError(error?.response?.data?.message || "Không thể tải danh sách sản phẩm");
      setShopItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Group items by category
  const groupedItems = shopItems.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShopItemDto[]>);

  // Create sections from grouped items
  const shopSections = Object.entries(groupedItems).map(([category, items]) => {
    const config = categoryConfig[category] || {
      title: category,
      icon: <Circle className="w-5 h-5 text-orange-500" />,
    };
    return {
      title: config.title,
      icon: config.icon,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        img: item.imageUrl || "/shop/default.png",
        price: item.price,
        locked: !item.isAvailable,
      })),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      {/* Back + Coin */}
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center mt-8 mb-4">
        <BackButton />
        <CoinDisplay amount={coins} />
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pb-16">
        <MascotHeader />
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 dark:text-gray-400">Đang tải...</div>
          </div>
        ) : shopSections.length > 0 ? (
          <div className="space-y-10 mt-6">
            {shopSections.map((section) => (
              <ShopSectionCarousel
                key={section.title}
                title={section.title}
                icon={section.icon}
                items={section.items}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 dark:text-gray-400">Không có sản phẩm nào</div>
          </div>
        )}
        <ApplyButton />
      </main>
    </div>
  );
}
