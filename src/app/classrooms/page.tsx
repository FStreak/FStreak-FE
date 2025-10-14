import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ClassRoomCard from "@/components/ClassRoomCard";
import { mockClassrooms } from "@/utils/mockData";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Classrooms | FStreak",
  description: "Join themed study rooms and collaborate with fellow FPT students",
};

export default function ClassroomsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Study{" "}
                <span className="bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                  Classrooms
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join themed study rooms and collaborate with fellow FPT students.
                Learn together, grow together.
              </p>
            </div>

            {/* Classrooms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockClassrooms.map((classroom) => (
                <ClassRoomCard key={classroom.id} classroom={classroom} />
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center p-12 rounded-2xl bg-white/50 backdrop-blur-sm border border-orange-200">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Can't find what you're looking for?
              </h2>
              <p className="text-gray-600 mb-6">
                Upgrade to Pro or Elite to create your own private study rooms!
              </p>
              <Link href="/membership">
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-medium rounded-lg hover:opacity-90 transition shadow-lg">
                  View Membership Plans
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}