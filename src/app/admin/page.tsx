"use client";

import { Users, Trophy, ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý người dùng, thanh toán, thành tích và cửa hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <Link
          href="/admin/users"
          className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quản lý Users
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Xem và quản lý người dùng
              </p>
            </div>
          </div>
        </Link>

        {/* Payments Card */}
        <Link
          href="/admin/payments"
          className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quản lý Payments
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Theo dõi giao dịch thanh toán
              </p>
            </div>
          </div>
        </Link>

        {/* Achievements Card */}
        <Link
          href="/admin/achievements"
          className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quản lý Achievements
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tạo và quản lý thành tích
              </p>
            </div>
          </div>
        </Link>

        {/* Shop Items Card */}
        <Link
          href="/admin/shop"
          className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Quản lý Shop Items
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tạo và quản lý sản phẩm
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}








