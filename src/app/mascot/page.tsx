"use client";

import Navbar from "@/components/navbar/Navbar";
import MascotInfo from "./components/MascotInfo";
import MascotShop from "./components/MascotShop";

export default function MascotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          Your Mascot Journey 🦊
        </h1>
        <MascotInfo />
        <div className="flex justify-center mt-10">
          <MascotShop />
        </div>
      </main>
    </div>
  );
}
