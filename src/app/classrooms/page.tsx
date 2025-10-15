"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import ClassRoomCard from "@/components/ClassRoomCard";
import ClassroomHeader from "@/components/ClassroomHeader";
import Link from "next/link";
import { privateApiService } from "@/services/ApiPrivate";
import type { StudyRoomDto } from "@/model/studyRoom/studyRoomTypes";
import { toast } from "react-hot-toast";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<StudyRoomDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const classrooms = await privateApiService.getActiveRooms();
        setClassrooms(classrooms);
        console.log("✅ Loaded classrooms:", classrooms.length);
      } catch (err) {
        console.error("❌ Failed to fetch classrooms:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load classrooms";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Filter classrooms based on search query
  const filteredClassrooms = useMemo(() => {
    if (!searchQuery.trim()) return classrooms;
    
    const query = searchQuery.toLowerCase();
    return classrooms.filter((classroom) => 
      classroom.name.toLowerCase().includes(query) ||
      classroom.description?.toLowerCase().includes(query) ||
      classroom.createdBy.firstName.toLowerCase().includes(query) ||
      classroom.createdBy.lastName.toLowerCase().includes(query)
    );
  }, [classrooms, searchQuery]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
                Study{" "}
                <span className="bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                  Classrooms
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join themed study rooms and collaborate with fellow FPT students.
                Learn together, grow together.
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-20">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredClassrooms.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                    {searchQuery ? `No results found for "${searchQuery}"` : "No Active Classrooms"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {searchQuery 
                      ? "Try adjusting your search query."
                      : "There are no active classrooms at the moment."
                    }
                  </p>
                  {!searchQuery && (
                    <Link href="/classrooms/create">
                      <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium rounded-lg hover:opacity-90 transition">
                        Create a Classroom
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Classrooms Grid */}
            {!isLoading && !error && filteredClassrooms.length > 0 && (
              <>
                <ClassroomHeader 
                  totalRooms={filteredClassrooms.length}
                  onSearch={setSearchQuery}
                />
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredClassrooms.map((classroom) => (
                    <ClassRoomCard key={classroom.studyRoomId} classroom={classroom} />
                  ))}
                </div>
              </>
            )}

            {/* CTA Section */}
            {!isLoading && !error && filteredClassrooms.length > 0 && (
              <div className="mt-16 text-center p-12 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-orange-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                  Can't find what you're looking for?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Upgrade to Pro or Elite to create your own private study rooms!
                </p>
                <Link href="/membership">
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium rounded-lg hover:opacity-90 transition shadow-lg">
                    View Membership Plans
                  </button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
