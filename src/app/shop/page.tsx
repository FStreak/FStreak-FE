"use client";

import Navbar from "@/components/navbar/Navbar";
import BackButton from "./components/BackButton";
import CoinDisplay from "./components/CoinDisplay";
import MascotHeader from "./components/MascotHeader";
import ShopSectionCarousel from "./components/ShopSectionCarousel";
import ApplyButton from "./components/ApplyButton";
import { Flame, Circle, UserCircle2, Palette } from "lucide-react";
import { useState } from "react";

const shopSections = [
  {
    title: "Skin",
    icon: <Flame className="w-5 h-5 text-orange-500" />,
    items: [
      {
        id: 1,
        name: "Fire Skin",
        img: "/shop/skin-fire.png",
        price: 80,
        locked: false,
      },
      {
        id: 2,
        name: "Sunlight Skin",
        img: "/shop/skin-yellow.png",
        price: 100,
        locked: true,
      },
      {
        id: 3,
        name: "Cool Flame",
        img: "/shop/skin-blue.png",
        price: 75,
        locked: false,
      },
      {
        id: 4,
        name: "Twilight Glow",
        img: "/shop/skin-purple.png",
        price: 120,
        locked: true,
      },
      {
        id: 5,
        name: "Aqua Shine",
        img: "/shop/skin-aqua.png",
        price: 60,
        locked: false,
      },
      {
        id: 6,
        name: "Lava Burst",
        img: "/shop/skin-lava.png",
        price: 90,
        locked: true,
      },
      {
        id: 7,
        name: "Neon Pulse",
        img: "/shop/skin-neon.png",
        price: 110,
        locked: false,
      },
      {
        id: 8,
        name: "Galaxy Flame",
        img: "/shop/skin-galaxy.png",
        price: 130,
        locked: true,
      },
      {
        id: 9,
        name: "Sunset Wave",
        img: "/shop/skin-sunset.png",
        price: 95,
        locked: false,
      },
      {
        id: 10,
        name: "Frost Burn",
        img: "/shop/skin-frost.png",
        price: 85,
        locked: false,
      },
    ],
  },
  {
    title: "Intellectual Profile Frame",
    icon: <Circle className="w-5 h-5 text-orange-500" />,
    items: [
      {
        id: 11,
        name: "Gold Frame",
        img: "/shop/frame-gold.png",
        price: 150,
        locked: false,
      },
      {
        id: 12,
        name: "Diamond Frame",
        img: "/shop/frame-diamond.png",
        price: 250,
        locked: true,
      },
      {
        id: 13,
        name: "Green Frame",
        img: "/shop/frame-green.png",
        price: 90,
        locked: false,
      },
      {
        id: 14,
        name: "Crystal Frame",
        img: "/shop/frame-crystal.png",
        price: 130,
        locked: false,
      },
      {
        id: 15,
        name: "Ruby Frame",
        img: "/shop/frame-ruby.png",
        price: 180,
        locked: true,
      },
      {
        id: 16,
        name: "Amethyst Frame",
        img: "/shop/frame-amethyst.png",
        price: 200,
        locked: true,
      },
      {
        id: 17,
        name: "Sapphire Frame",
        img: "/shop/frame-sapphire.png",
        price: 140,
        locked: false,
      },
      {
        id: 18,
        name: "Emerald Frame",
        img: "/shop/frame-emerald.png",
        price: 160,
        locked: true,
      },
    ],
  },
  {
    title: "Mascot Body",
    icon: <UserCircle2 className="w-5 h-5 text-orange-500" />,
    items: [
      {
        id: 19,
        name: "Classic Foxy",
        img: "/shop/mascot-orange.png",
        price: 0,
        locked: false,
      },
      {
        id: 20,
        name: "Sleepy Foxy",
        img: "/shop/mascot-sleep.png",
        price: 90,
        locked: true,
      },
      {
        id: 21,
        name: "Ninja Foxy",
        img: "/shop/mascot-ninja.png",
        price: 150,
        locked: true,
      },
      {
        id: 22,
        name: "Astronaut Foxy",
        img: "/shop/mascot-space.png",
        price: 250,
        locked: true,
      },
      {
        id: 23,
        name: "Pirate Foxy",
        img: "/shop/mascot-pirate.png",
        price: 180,
        locked: true,
      },
      {
        id: 24,
        name: "Robot Foxy",
        img: "/shop/mascot-robot.png",
        price: 220,
        locked: false,
      },
      {
        id: 25,
        name: "Student Foxy",
        img: "/shop/mascot-student.png",
        price: 100,
        locked: false,
      },
      {
        id: 26,
        name: "Chill Foxy",
        img: "/shop/mascot-chill.png",
        price: 80,
        locked: false,
      },
    ],
  },
  {
    title: "Club Frame",
    icon: <Palette className="w-5 h-5 text-orange-500" />,
    items: [
      {
        id: 27,
        name: "FPT Club",
        img: "/shop/club-fpt.png",
        price: 120,
        locked: false,
      },
      {
        id: 28,
        name: "Study Club",
        img: "/shop/club-study.png",
        price: 100,
        locked: false,
      },
      {
        id: 29,
        name: "Chill Club",
        img: "/shop/club-chill.png",
        price: 130,
        locked: true,
      },
      {
        id: 30,
        name: "Gamers Club",
        img: "/shop/club-gamer.png",
        price: 160,
        locked: true,
      },
      {
        id: 31,
        name: "Code Masters",
        img: "/shop/club-code.png",
        price: 180,
        locked: true,
      },
      {
        id: 32,
        name: "Art & Design",
        img: "/shop/club-art.png",
        price: 150,
        locked: false,
      },
      {
        id: 33,
        name: "Music Lounge",
        img: "/shop/club-music.png",
        price: 120,
        locked: false,
      },
      {
        id: 34,
        name: "Writers Hub",
        img: "/shop/club-write.png",
        price: 140,
        locked: false,
      },
      {
        id: 35,
        name: "F-Streak Legends",
        img: "/shop/club-legend.png",
        price: 300,
        locked: true,
      },
    ],
  },
];

export default function ShopPage() {
  const [coins, setCoins] = useState(120);

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
        <ApplyButton />
      </main>
    </div>
  );
}
