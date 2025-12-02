"use client";

import { useState, useEffect } from "react";
import { adminApiService } from "@/services/AdminApiService";
import type { AdminUser, AdminUserListResponse } from "@/model/admin/adminTypes";
import { showSuccess, showError } from "@/lib/toast";
import { Users, Search, Lock, Unlock, UserPlus, Shield, X } from "lucide-react";
import { useTokenInfoStorage } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserManagementTable from "./components/UserManagementTable";
import UserDetailDialog from "./components/UserDetailDialog";
import AddRoleDialog from "./components/AddRoleDialog";
import LockUserDialog from "./components/LockUserDialog";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showLockUser, setShowLockUser] = useState(false);
  const { token } = useTokenInfoStorage();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getUsers(1, 1000); // Get all users for client-side pagination
      
      // Response đã được normalize trong AdminApiService
      setUsers(response.items || []);
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
  }, []);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

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
        users={currentUsers}
        loading={loading}
        onViewUser={handleViewUser}
        onAddRole={handleAddRole}
        onRemoveRole={handleRemoveRole}
        onLockUser={handleLockUser}
      />

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Page info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} users
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  Đầu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="min-w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Cuối
                </Button>
              </div>

              {/* Go to page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Trang:</span>
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  className="w-20 h-8 text-center"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">/ {totalPages}</span>
              </div>
            </div>
          </CardContent>
        </Card>
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

