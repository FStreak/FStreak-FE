"use client";

import { Search, Plus, Filter } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ClassroomHeaderProps {
  totalRooms: number;
  onSearch: (query: string) => void;
}

export default function ClassroomHeader({ totalRooms, onSearch }: ClassroomHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="mb-8">
      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalRooms} active {totalRooms === 1 ? "classroom" : "classrooms"} available
          </p>
        </div>
        <Link href="/classrooms/create">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md">
            <Plus className="w-4 h-4" />
            Create Room
          </button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search classrooms..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>
    </div>
  );
}
