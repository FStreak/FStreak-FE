"use client";

import Link from "next/link";
import { Flame, Star, Heart, Users, Trophy, Target, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                WELCOME TO <span className="text-orange-500">F-STREAK</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                A learning journey - never walked alone.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-400 mb-8 leading-relaxed">
                F-Streak helps you build consistent study habits alongside your peers. 
                Track your daily progress, stay motivated with the community, and make 
                studying a meaningful part of your student life.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 transition-all shadow-lg"
              >
                <Flame className="w-5 h-5" />
                MAKE STREAK NOW
              </Link>
            </div>
            <div className="hidden lg:block">
              {/* Mascot placeholder */}
              <div className="w-64 h-64 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-full flex items-center justify-center relative">
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center">
                  <Flame className="w-24 h-24 text-orange-500" />
                </div>
                <Star className="w-8 h-8 text-yellow-400 absolute -top-4 -right-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            HOW IT WORKS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-yellow-50 dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-8 text-center relative">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Skill
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select from a wide range of subjects and topics you&apos;re passionate about learning.
              </p>
              <Heart className="w-6 h-6 text-orange-500 absolute top-4 right-4" />
            </div>

            <div className="bg-yellow-50 dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-8 text-center relative">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Learn Daily
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Engage with bite-sized lessons and interactive exercises designed for daily progress.
              </p>
              <Heart className="w-6 h-6 text-orange-500 absolute top-4 right-4" />
            </div>

            <div className="bg-yellow-50 dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-8 text-center relative">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Build Your Streak
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Maintain consistency, track your streak, and watch your knowledge and confidence grow.
              </p>
              <Heart className="w-6 h-6 text-orange-500 absolute top-4 right-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose F-Streak */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-400">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-bold text-white">
              WHY CHOOSE F-STREAK?
            </h2>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                <Flame className="w-16 h-16 text-orange-500" />
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">GAMING PROGRESS</h3>
              <p className="text-gray-600 text-sm">
                Earn badges, level up, and track your points as you conquer new learning milestones.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">DAILY STREAK TRACKING</h3>
              <p className="text-gray-600 text-sm">
                Visualize your consistency with our intuitive streak chain and never miss a day.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">PERSONALIZED PATHS</h3>
              <p className="text-gray-600 text-sm">
                Access tailored learning content and challenges that align with your individual goals.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-3">COMMUNITY AND CHALLENGES</h3>
              <p className="text-gray-600 text-sm">
                Join groups, compete with friends, and collaborate on learning journey together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-orange-500 mb-4">
            WHAT OUR USERS SAY
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16">
            Here from learners who have transformed their habits and achieved their goals with F-Streak.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                AP
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Alex P</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &quot;F-Streak has completely changed how I approach learning. The gamification keeps me motivated, and I love seeing my streak grow!&quot;
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                SL
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Sarah L</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &quot;I use to struggle with consistency, but F-Streak&apos;s daily reminders and engaging content make it so easy to stay on track. Highly recommend!&quot;
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                RL
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Rine L</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &quot;This website is well-designed and provides useful materials that support effective learning.&quot;
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                MR
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Mike R</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &quot;The community features are fantastic! Learning with friends and challenging each other has made the process to much more fun and effective.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-400">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
              <Flame className="w-12 h-12 text-orange-500" />
            </div>
            <Star className="w-12 h-12 text-yellow-200" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Start Your Learning Streak?
          </h2>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-lg text-orange-500 font-bold text-lg bg-white hover:bg-gray-50 transition-all shadow-lg"
          >
            GET STARTED FOR FREE
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-400 shadow">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-500">F-STREAK</h3>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-orange-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-orange-400 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            © 2025 F-Streak. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

