"use client";

import { useState, useEffect } from "react";
import { adminApiService } from "@/services/AdminApiService";
import type { AchievementDto } from "@/model/admin/adminTypes";
import { showSuccess, showError } from "@/lib/toast";
import { Trophy, Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";
import AchievementList from "./components/AchievementList";
import CreateAchievementDialog from "./components/CreateAchievementDialog";
import EditAchievementDialog from "./components/EditAchievementDialog";

const ACHIEVEMENTS_STORAGE_KEY = "fstreak-admin-achievements";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementDto | null>(null);

  // Load achievements from localStorage
  const loadAchievementsFromStorage = (): AchievementDto[] => {
    try {
      const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("📦 Loaded from localStorage:", parsed.length, "achievements");
        return parsed;
      }
    } catch (error) {
      console.error("❌ Error loading achievements from localStorage:", error);
    }
    console.log("📦 No data in localStorage");
    return [];
  };

  // Save achievements to localStorage
  const saveAchievementsToStorage = (achievements: AchievementDto[]) => {
    try {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
      console.log("✅ Saved achievements to localStorage:", achievements.length);
    } catch (error) {
      console.error("❌ Error saving achievements to localStorage:", error);
    }
  };

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getAchievements(1, 100);
      const items = response.items || [];
      if (items.length > 0) {
        setAchievements(items);
        // Save to localStorage if we got data from API
        saveAchievementsToStorage(items);
      } else {
        // If API returns empty, keep localStorage data if exists
        const storedAchievements = loadAchievementsFromStorage();
        if (storedAchievements.length > 0) {
          console.log("📦 API returned empty, keeping localStorage data:", storedAchievements.length);
          setAchievements(storedAchievements);
        }
      }
    } catch (error: any) {
      console.error("Error loading achievements:", error);
      // If API fails (404/405), keep using localStorage data (already loaded in useEffect)
      const storedAchievements = loadAchievementsFromStorage();
      if (storedAchievements.length > 0) {
        console.log("📦 API failed, using localStorage data:", storedAchievements.length);
        setAchievements(storedAchievements);
      } else {
        const errorMessage = error?.response?.data?.message || 
                            error?.response?.data?.title ||
                            error?.message || 
                            "Không thể tải danh sách achievements";
        // Don't show error if we're just using localStorage fallback
        if (error?.response?.status !== 404 && error?.response?.status !== 405) {
          showError(errorMessage);
        }
        setAchievements([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load from localStorage first (immediate display)
    const storedAchievements = loadAchievementsFromStorage();
    if (storedAchievements.length > 0) {
      console.log("📦 Loading achievements from localStorage on mount:", storedAchievements.length);
      setAchievements(storedAchievements);
    }
    
    // Then try to load from API (will update if successful)
    loadAchievements();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      console.log("🔍 Submitting achievement data:", data);
      const newAchievement = await adminApiService.createAchievement(data);
      console.log("✅ Achievement created:", newAchievement);
      showSuccess("Đã tạo achievement thành công");
      // Add the new achievement to the list immediately
      if (newAchievement) {
        const updatedList = [newAchievement, ...achievements];
        console.log("✅ Adding new achievement to list:", newAchievement);
        console.log("✅ Updated list length:", updatedList.length);
        setAchievements(updatedList);
        // Save to localStorage immediately
        saveAchievementsToStorage(updatedList);
        console.log("✅ Saved to localStorage, verifying:", loadAchievementsFromStorage().length, "items");
      }
      // Try to reload, but don't fail if it doesn't work
      try {
        await loadAchievements();
      } catch (reloadError) {
        console.warn("⚠️ Could not reload achievements list, but achievement was created");
      }
      setShowCreateDialog(false);
    } catch (error: any) {
      console.error("❌ Error in handleCreate:", error);
      console.error("❌ Full error object:", JSON.stringify(error, null, 2));
      
      // Extract error message from various possible formats
      let errorMessage = "Không thể tạo achievement. Vui lòng kiểm tra lại thông tin.";
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        
        // Try different error message formats
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData.errors) {
          // Handle validation errors (ASP.NET Core format)
          const errors = errorData.errors;
          const errorMessages: string[] = [];
          
          Object.keys(errors).forEach(key => {
            if (Array.isArray(errors[key])) {
              errorMessages.push(...errors[key]);
            } else {
              errorMessages.push(errors[key]);
            }
          });
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join(", ");
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.error("❌ Displaying error message:", errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      setLoading(true);
      const updatedAchievement = await adminApiService.updateAchievement(id, data);
      showSuccess("Đã cập nhật achievement thành công");
      setEditingAchievement(null);
      // Update in local state
      if (updatedAchievement) {
        const updatedList = achievements.map(a => a.id === id ? updatedAchievement : a);
        setAchievements(updatedList);
        saveAchievementsToStorage(updatedList);
      } else {
        // If update doesn't return data, try to fetch by ID
        try {
          const fetchedAchievement = await adminApiService.getAchievementById(id);
          const updatedList = achievements.map(a => a.id === id ? fetchedAchievement : a);
          setAchievements(updatedList);
          saveAchievementsToStorage(updatedList);
        } catch (fetchError) {
          console.warn("⚠️ Could not fetch updated achievement by ID, using local update");
        }
      }
      // Try to reload
      try {
        await loadAchievements();
      } catch (reloadError) {
        console.warn("⚠️ Could not reload achievements list, but achievement was updated");
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể cập nhật achievement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa achievement này?")) return;

    try {
      setLoading(true);
      await adminApiService.deleteAchievement(id);
      showSuccess("Đã xóa achievement thành công");
      // Update in local state
      const updatedList = achievements.filter(a => a.id !== id);
      setAchievements(updatedList);
      saveAchievementsToStorage(updatedList);
      // Try to reload
      try {
        await loadAchievements();
      } catch (reloadError) {
        console.warn("⚠️ Could not reload achievements list, but achievement was deleted");
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể xóa achievement");
    } finally {
      setLoading(false);
    }
  };

  const handleAwardToAll = async (achievement: AchievementDto) => {
    if (!achievement.id) {
      showError("Achievement không có ID");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn award achievement "${achievement.name}" cho TẤT CẢ users trong hệ thống?\n\nLưu ý: Admin và Teacher sẽ được bỏ qua.`)) {
      return;
    }

    try {
      setLoading(true);
      const result = await adminApiService.awardAchievementToAllUsers(achievement.id);
      
      if (result.success > 0) {
        showSuccess(
          `✅ Đã award achievement cho ${result.success} users thành công!` +
          (result.failed > 0 ? `\n⚠️ ${result.failed} users thất bại.` : "")
        );
        
        if (result.errors.length > 0 && result.errors.length <= 5) {
          console.warn("⚠️ Errors:", result.errors);
        }
      } else {
        // Check if all errors are 500 errors
        const all500Errors = result.errors.filter(e => e.includes('500') || e.includes('Backend server error'));
        if (all500Errors.length === result.failed && result.failed > 0) {
          showError(
            `❌ Không thể award achievement cho bất kỳ user nào.\n\n` +
            `Tất cả ${result.failed} requests đều bị lỗi 500 (Internal Server Error).\n\n` +
            `⚠️ Có thể backend không hỗ trợ tính năng award achievement cho user khác.\n` +
            `Vui lòng kiểm tra backend logs hoặc liên hệ backend team để thêm admin endpoint.\n\n` +
            `Gợi ý: Backend cần có endpoint như:\n` +
            `POST /api/admin/achievements/{achievementId}/award-to-user/{userId}`
          );
        } else {
          showError(
            `Không thể award achievement cho bất kỳ user nào. ${result.failed} users thất bại.\n\n` +
            `Lỗi phổ biến:\n${result.errors.slice(0, 3).join('\n')}`
          );
        }
      }
    } catch (error: any) {
      console.error("❌ Error awarding achievement to all users:", error);
      showError(error?.response?.data?.message || "Không thể award achievement cho tất cả users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      await adminApiService.toggleAchievementStatus(id, {
        isActive: !currentStatus,
      });
      showSuccess(
        !currentStatus
          ? "Đã kích hoạt achievement"
          : "Đã vô hiệu hóa achievement"
      );
      // Update in local state
      const updatedList = achievements.map(a => 
        a.id === id ? { ...a, isActive: !currentStatus } : a
      );
      setAchievements(updatedList);
      saveAchievementsToStorage(updatedList);
      // Try to reload
      try {
        await loadAchievements();
      } catch (reloadError) {
        console.warn("⚠️ Could not reload achievements list, but status was updated");
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể thay đổi trạng thái");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Quản lý Achievements
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tạo và quản lý các thành tích trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity shadow"
        >
          <Plus className="w-5 h-5" />
          Tạo Achievement
        </button>
      </div>

      <AchievementList
        achievements={achievements}
        loading={loading}
        onEdit={(achievement) => setEditingAchievement(achievement)}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onAwardToAll={handleAwardToAll}
      />

      {showCreateDialog && (
        <CreateAchievementDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingAchievement && (
        <EditAchievementDialog
          achievement={editingAchievement}
          open={!!editingAchievement}
          onClose={() => setEditingAchievement(null)}
          onSubmit={(data) => handleUpdate(editingAchievement.id, data)}
        />
      )}
    </div>
  );
}





