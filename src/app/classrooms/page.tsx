"use client";

import Navbar from "@/components/navbar/Navbar";
import { RoomList } from "@/components/RoomList";

export default function ClassroomsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <RoomList />
      </div>
    </div>
  );
}
