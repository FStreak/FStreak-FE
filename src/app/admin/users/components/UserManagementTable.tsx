"use client";

import type { AdminUser } from "@/model/admin/adminTypes";
import { Eye, Shield, Lock, Unlock } from "lucide-react";

interface UserManagementTableProps {
  users: AdminUser[];
  loading: boolean;
  onViewUser: (userId: string) => void;
  onAddRole: (user: AdminUser) => void;
  onRemoveRole: (userId: string, role: string) => void;
  onLockUser: (user: AdminUser) => void;
}

export default function UserManagementTable({
  users,
  loading,
  onViewUser,
  onAddRole,
  onRemoveRole,
  onLockUser,
}: UserManagementTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-400">Không tìm thấy user nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => (
              <tr
                key={user.id || `user-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-white font-semibold">
                      {user.firstName?.[0] || user.userName?.[0] || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.userName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        @{user.userName || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {user.email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((role, roleIndex) => (
                        <span
                          key={`${user.id}-${role}-${roleIndex}`}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                        >
                          {role}
                          <button
                            onClick={() => onRemoveRole(user.id, role)}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">No roles</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isLocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                      <Unlock className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "N/A"}
                  </div>
                  {user.createdAt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewUser(user.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAddRole(user)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      title="Thêm role"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onLockUser(user)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title={user.isLocked ? "Mở khóa" : "Khóa user"}
                    >
                      {user.isLocked ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


