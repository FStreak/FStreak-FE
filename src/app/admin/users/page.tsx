"use client";

import { useState, useEffect } from "react";
import { adminApiService } from "@/services/AdminApiService";
import type { AdminUser, AdminUserListResponse } from "@/model/admin/adminTypes";
import { showSuccess, showError } from "@/lib/toast";
import { Users, Search, Lock, Unlock, UserPlus, Shield, X } from "lucide-react";
import { useTokenInfoStorage } from "@/store/authStore";
import UserManagementTable from "./components/UserManagementTable";
import UserDetailDialog from "./components/UserDetailDialog";
import AddRoleDialog from "./components/AddRoleDialog";
import LockUserDialog from "./components/LockUserDialog";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showLockUser, setShowLockUser] = useState(false);
  const { token } = useTokenInfoStorage();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getUsers(page, pageSize);
      
      // Response đã được normalize trong AdminApiService
      setUsers(response.items || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error("Error loading users:", error);
      
      // Handle 403 Forbidden specifically
      if (error?.response?.status === 403) {
        const backendMessage = error?.response?.data?.message || 
                              error?.response?.data?.title ||
                              error?.response?.data?.error ||
                              error?.response?.data?.detail;
        
        // Get token info for debugging
        const { token } = useTokenInfoStorage.getState();
        let tokenRole = 'Unknown';
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const decoded = JSON.parse(jsonPayload);
              tokenRole = decoded['role'] || decoded['Role'] || 'NOT FOUND IN TOKEN';
            }
          } catch (e) {
            console.error('Could not decode token:', e);
          }
        }
        
        // Log detailed info for debugging
        console.error("🔴 403 Forbidden Details:", {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          requestUrl: error?.config?.url,
          requestMethod: error?.config?.method,
          hasAuthHeader: !!error?.config?.headers?.Authorization,
          authHeaderPrefix: error?.config?.headers?.Authorization?.substring(0, 30) + "...",
          tokenRole: tokenRole,
        });
        
        const errorMessage = backendMessage || 
          `Backend trả về 403 Forbidden khi truy cập API quản lý users.\n\n` +
          `🔍 Thông tin debug:\n` +
          `- Role trong token: ${tokenRole}\n` +
          `- Request URL: ${error?.config?.url}\n` +
          `- Có Authorization header: ${!!error?.config?.headers?.Authorization}\n\n` +
          `⚠️ Vui lòng kiểm tra:\n` +
          `1. Backend có đang kiểm tra role đúng không? (Backend có thể yêu cầu "Admin" với chữ A hoa)\n` +
          `2. Backend authorization policy có cho phép role "${tokenRole}" truy cập /api/admin/users không?\n` +
          `3. Token có được gửi đúng format "Bearer {token}" trong Authorization header không?\n` +
          `4. Kiểm tra Network tab → Headers → Request Headers để xem Authorization header\n` +
          `5. Kiểm tra Backend logs để xem lý do cụ thể tại sao bị từ chối\n\n` +
          `💡 Lưu ý: Frontend đã nhận diện role "admin" từ token và cho phép truy cập. ` +
          `Vấn đề nằm ở phía Backend authorization policy.`;
        showError(errorMessage);
      } else {
        const errorMessage = error?.response?.data?.message || 
                            error?.response?.data?.title ||
                            error?.message || 
                            "Không thể tải danh sách users";
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleViewUser = async (userId: string) => {
    try {
      const user = await adminApiService.getUserById(userId);
      setSelectedUser(user);
      setShowUserDetail(true);
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể tải thông tin user");
    }
  };

  const handleAddRole = (user: AdminUser) => {
    setSelectedUser(user);
    setShowAddRole(true);
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    try {
      await adminApiService.removeRoleFromUser(userId, role);
      showSuccess(`Đã xóa role "${role}" khỏi user`);
      loadUsers();
      if (selectedUser?.id === userId) {
        const updatedUser = await adminApiService.getUserById(userId);
        setSelectedUser(updatedUser);
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể xóa role");
    }
  };

  const handleLockUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowLockUser(true);
  };


  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.userName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Quản lý Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Xem và quản lý tất cả người dùng trong hệ thống - Thêm/xóa role, khóa/mở khóa user
        </p>
      </div>


      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <UserManagementTable
        users={filteredUsers}
        loading={loading}
        onViewUser={handleViewUser}
        onAddRole={handleAddRole}
        onRemoveRole={handleRemoveRole}
        onLockUser={handleLockUser}
      />

      {/* Pagination */}
      {!loading && total > pageSize && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} trong tổng số {total} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Trước
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * pageSize >= total}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      {selectedUser && (
        <>
          <UserDetailDialog
            user={selectedUser}
            open={showUserDetail}
            onClose={() => {
              setShowUserDetail(false);
              setSelectedUser(null);
            }}
            onRefresh={loadUsers}
          />
          <AddRoleDialog
            user={selectedUser}
            open={showAddRole}
            onClose={() => {
              setShowAddRole(false);
              setSelectedUser(null);
            }}
            onSuccess={loadUsers}
          />
          <LockUserDialog
            user={selectedUser}
            open={showLockUser}
            onClose={() => {
              setShowLockUser(false);
              setSelectedUser(null);
            }}
            onSuccess={loadUsers}
          />
        </>
      )}
    </div>
  );
}

