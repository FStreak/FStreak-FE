"use client";

import Navbar from "@/components/navbar/Navbar";
import BackButton from "./components/BackButton";
import CoinDisplay from "./components/CoinDisplay";
import MascotHeader from "./components/MascotHeader";
import ShopSectionCarousel from "./components/ShopSectionCarousel";
import ApplyButton from "./components/ApplyButton";
import { Sparkles } from "lucide-react";
import { useState } from "react";

// Import premium frame images
import groundFrame from "@/premium frame/ground frame.png";
import leafFrame from "@/premium frame/leaf frame.png";
import stormFrame from "@/premium frame/storm frame.png";
import waterFrame from "@/premium frame/water frame.png";
import flowerFrame from "@/premium frame/flower frame.png";

// Import premium mascot images
import groundMascot from "@/premium mascot/ground mascot.png";
import leafMascot from "@/premium mascot/leaf mascot.png";
import stormMascot from "@/premium mascot/storm mascot.png";
import waterMascot from "@/premium mascot/water mascot.png";
import flowerMascot from "@/premium mascot/flower mascot.png";

// Premium Frame items
const premiumFrameItems = [
  {
    id: "premium-frame-ground",
    name: "Ground Frame",
    img: groundFrame.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-frame-leaf",
    name: "Leaf Frame",
    img: leafFrame.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-frame-storm",
    name: "Storm Frame",
    img: stormFrame.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-frame-water",
    name: "Water Frame",
    img: waterFrame.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-frame-flower",
    name: "Flower Frame",
    img: flowerFrame.src,
    price: 100,
    locked: false,
  },
];

// Premium Mascot items
const premiumMascotItems = [
  {
    id: "premium-mascot-ground",
    name: "Ground Mascot",
    img: groundMascot.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-mascot-leaf",
    name: "Leaf Mascot",
    img: leafMascot.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-mascot-storm",
    name: "Storm Mascot",
    img: stormMascot.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-mascot-water",
    name: "Water Mascot",
    img: waterMascot.src,
    price: 100,
    locked: false,
  },
  {
    id: "premium-mascot-flower",
    name: "Flower Mascot",
    img: flowerMascot.src,
    price: 100,
    locked: false,
  },
];

export default function ShopPage() {
  const [coins, setCoins] = useState(0);
  const [selectedMascot, setSelectedMascot] = useState<{ id: string | number; name: string; img: string; price?: number } | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<{ id: string | number; name: string; img: string; price?: number } | null>(null);

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
        <MascotHeader 
          selectedMascot={selectedMascot ? { img: selectedMascot.img, name: selectedMascot.name } : null}
          selectedFrame={selectedFrame ? { img: selectedFrame.img, name: selectedFrame.name } : null}
        />
        <div className="space-y-10 mt-6">
          {/* Premium Frame Section */}
          <ShopSectionCarousel
            title="Premium Frame"
            icon={<Sparkles className="w-5 h-5 text-orange-500" />}
            items={premiumFrameItems}
            category="Frame"
            selectedItemId={selectedFrame?.id}
            onItemSelect={(item) => setSelectedFrame(item)}
          />
          
          {/* Premium Mascot Section */}
          <ShopSectionCarousel
            title="Premium Mascot"
            icon={<Sparkles className="w-5 h-5 text-orange-500" />}
            items={premiumMascotItems}
            category="Mascot"
            selectedItemId={selectedMascot?.id}
            onItemSelect={(item) => setSelectedMascot(item)}
          />
        </div>
        <ApplyButton 
          selectedMascot={selectedMascot}
          selectedFrame={selectedFrame}
        />
      </main>
    </div>
  );
}
