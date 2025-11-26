"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { adminApiService } from "@/services/AdminApiService";
import type { AdminUser } from "@/model/admin/adminTypes";
import { showError } from "@/lib/toast";

interface UserDetailDialogProps {
  user: AdminUser;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserDetailDialog({
  user,
  open,
  onClose,
  onRefresh,
}: UserDetailDialogProps) {
  const [userDetail, setUserDetail] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user.id) {
      loadUserDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user.id]);

  const loadUserDetail = async () => {
    try {
      setLoading(true);
      const detail = await adminApiService.getUserById(user.id);
      setUserDetail(detail);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể tải thông tin user");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const displayUser = userDetail || user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Chi tiết User
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {displayUser.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Username
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {displayUser.userName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {displayUser.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Họ và tên
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {displayUser.firstName && displayUser.lastName
                      ? `${displayUser.firstName} ${displayUser.lastName}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Trạng thái
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {displayUser.isLocked ? "Đã khóa" : "Hoạt động"}
                  </p>
                </div>
                {displayUser.lockedUntil && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Khóa đến
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(displayUser.lockedUntil).toLocaleString("vi-VN")}
                    </p>
                  </div>
                )}
                {displayUser.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ngày tạo
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(displayUser.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Roles
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {displayUser.roles && displayUser.roles.length > 0 ? (
                    displayUser.roles.map((role, index) => (
                      <span
                        key={`${displayUser.id}-${role}-${index}`}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Không có roles
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

