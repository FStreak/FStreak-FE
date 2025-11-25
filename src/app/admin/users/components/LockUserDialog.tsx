"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { adminApiService } from "@/services/AdminApiService";
import type { AdminUser } from "@/model/admin/adminTypes";
import { showSuccess, showError } from "@/lib/toast";

interface LockUserDialogProps {
  user: AdminUser;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LockUserDialog({
  user,
  open,
  onClose,
  onSuccess,
}: LockUserDialogProps) {
  const [isLocked, setIsLocked] = useState(user.isLocked || false);
  const [lockedUntil, setLockedUntil] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await adminApiService.lockUser(user.id, {
        isLocked: isLocked,
        lockedUntil: lockedUntil ? new Date(lockedUntil).toISOString() : null,
      });
      showSuccess(
        isLocked ? "Đã khóa user thành công" : "Đã mở khóa user thành công"
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể cập nhật trạng thái user");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isLocked ? "Khóa User" : "Mở khóa User"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.userName || user.email}
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isLocked}
                onChange={(e) => setIsLocked(e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Khóa user
              </span>
            </label>
          </div>

          {isLocked && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Khóa đến (tùy chọn)
              </label>
              <input
                type="datetime-local"
                value={lockedUntil}
                onChange={(e) => setLockedUntil(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Để trống nếu muốn khóa vĩnh viễn
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-lg text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
                isLocked
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading
                ? "Đang xử lý..."
                : isLocked
                ? "Khóa User"
                : "Mở khóa User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






