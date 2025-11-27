"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { adminApiService } from "@/services/AdminApiService";
import type { AdminUser } from "@/model/admin/adminTypes";
import { showSuccess, showError } from "@/lib/toast";

interface AddRoleDialogProps {
  user: AdminUser;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRoleDialog({
  user,
  open,
  onClose,
  onSuccess,
}: AddRoleDialogProps) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      showError("Vui lòng nhập role");
      return;
    }

    try {
      setLoading(true);
      await adminApiService.addRoleToUser(user.id, { role: role.trim() });
      showSuccess(`Đã thêm role "${role}" cho user`);
      setRole("");
      onSuccess();
      onClose();
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể thêm role");
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
            Thêm Role
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Nhập tên role (ví dụ: Admin, Teacher)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang thêm..." : "Thêm Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}








