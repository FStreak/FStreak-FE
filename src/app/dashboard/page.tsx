"use client";

import { Flame, Star, Trophy, Users, Bell, Target, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            DASHBOARD
          </h1>
          
          {/* Streak Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2">28 DAYS STREAK</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <p className="text-lg">Keep the chain unbroken! You're doing great!</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4">
                  <Flame className="w-16 h-16 text-orange-500" />
                </div>
                <p className="text-sm font-medium">YOUR MASCOT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Your Badges */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">YOUR BADGES</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">FIRSTSTEP</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">7DAYSSTREAK</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">LESSON MASTER</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">GROUP LEADER</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">FIRSTSTEP</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">FIRSTSTEP</p>
              </div>
            </div>
          </div>

          {/* Daily Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Daily Progress</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Lesson Completion</span>
                  <span className="text-sm text-gray-500">75%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">XP Earned</span>
                  <span className="text-sm text-gray-500">150/200</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Weekly Goal</span>
                  <span className="text-sm text-gray-500">60%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Friends Ranking */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Friends Ranking</h3>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                Invite Friends
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-gray-900 dark:text-white">Person 1</span>
                </div>
                <span className="text-orange-500 font-bold">30</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-gray-900 dark:text-white">Person 2</span>
                </div>
                <span className="text-orange-500 font-bold">25</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-gray-900 dark:text-white">Person 3</span>
                </div>
                <span className="text-orange-500 font-bold">18</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white">New lesson available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white">Group Challenge Update</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white">Badge Unlocked!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rankings */}
        <div className="space-y-8">
          {/* FPTU-ERS RANKING */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-orange-500 mb-6">FPTU-ERS RANKING</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-gray-900 dark:text-white">Person 1</span>
                </div>
                <span className="text-orange-500 font-bold">1250 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-gray-900 dark:text-white">Person 2</span>
                </div>
                <span className="text-orange-500 font-bold">1180 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-gray-900 dark:text-white">Person 3</span>
                </div>
                <span className="text-orange-500 font-bold">1020 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <span className="text-gray-900 dark:text-white">Person 4</span>
                </div>
                <span className="text-orange-500 font-bold">960 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                  <span className="text-gray-900 dark:text-white">Person 5</span>
                </div>
                <span className="text-orange-500 font-bold">900 pts</span>
              </div>
            </div>
          </div>

          {/* CAMPUS RANKING */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-orange-500 mb-6">CAMPUS RANKING</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-gray-900 dark:text-white">Campus 1</span>
                </div>
                <span className="text-orange-500 font-bold">1250 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-gray-900 dark:text-white">Campus 2</span>
                </div>
                <span className="text-orange-500 font-bold">1180 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-gray-900 dark:text-white">Campus 3</span>
                </div>
                <span className="text-orange-500 font-bold">1020 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                  <span className="text-gray-900 dark:text-white">Campus 4</span>
                </div>
                <span className="text-orange-500 font-bold">960 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                  <span className="text-gray-900 dark:text-white">Campus 5</span>
                </div>
                <span className="text-orange-500 font-bold">900 pts</span>
              </div>
            </div>
          </div>

          {/* MAJOR/DEGREE RANKING */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-orange-500 mb-6">MAJOR/DEGREE RANKING</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-gray-900 dark:text-white">Major 1</span>
                </div>
                <span className="text-orange-500 font-bold">1250 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-gray-900 dark:text-white">Major 2</span>
                </div>
                <span className="text-orange-500 font-bold">1180 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-gray-900 dark:text-white">Major 3</span>
                </div>
                <span className="text-orange-500 font-bold">1020 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
