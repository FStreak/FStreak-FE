"use client";

import GuestNavbar from "@/components/GuestNavbar";
import { Flame, Users, Target, Star, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <GuestNavbar />
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="text-orange-500">F-Streak</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're on a mission to make learning consistent, engaging, and social. 
              Join thousands of students who have transformed their study habits with F-Streak.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  F-Streak was born from the belief that learning should be consistent, 
                  engaging, and social. We understand that maintaining study habits can 
                  be challenging, especially when you're doing it alone.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  That's why we created a platform that combines gamification, community 
                  support, and personalized learning paths to help students build lasting 
                  study habits and achieve their academic goals.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-yellow-300 rounded-2xl p-8 text-center">
                <Flame className="w-24 h-24 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Keep the Fire Burning</h3>
                <p className="text-white">
                  Every day you study is a day you're building your future. 
                  Keep the streak alive!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Community First</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We believe learning is better together. Our community features help 
                  students support and motivate each other.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Consistency Matters</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Small, daily actions lead to big results. We help students build 
                  consistent study habits that last.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gamified Learning</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learning should be fun! Our gamification features make studying 
                  engaging and rewarding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Development Team</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Passionate developers building the future of education technology.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Community Team</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Dedicated to creating an inclusive and supportive learning environment.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Product Team</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Focused on creating the best possible learning experience for students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-400">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-8">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-white mb-8">
              Join thousands of students who are already building their study streaks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 rounded-lg text-orange-500 font-bold text-lg bg-white hover:bg-gray-50 transition-all shadow-lg"
              >
                Get Started Free
              </a>
              <a
                href="/plans"
                className="px-8 py-4 rounded-lg text-white font-bold text-lg border-2 border-white hover:bg-white hover:text-orange-500 transition-all"
              >
                View Plans
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
