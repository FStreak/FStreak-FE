"use client";

import { useState, useEffect } from "react";
import { adminApiService } from "@/services/AdminApiService";
import type { ShopItemDto } from "@/model/admin/adminTypes";
import { showSuccess, showError } from "@/lib/toast";
import { ShoppingBag, Plus, Edit, Trash2 } from "lucide-react";
import ShopItemList from "./components/ShopItemList";
import CreateShopItemDialog from "./components/CreateShopItemDialog";
import EditShopItemDialog from "./components/EditShopItemDialog";

export default function AdminShopPage() {
  const [shopItems, setShopItems] = useState<ShopItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItemDto | null>(null);

  const loadShopItems = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getShopItems(1, 100);
      setShopItems(response.items || []);
    } catch (error: any) {
      console.error("Error loading shop items:", error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.title ||
                          error?.message || 
                          "Không thể tải danh sách shop items";
      showError(errorMessage);
      setShopItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShopItems();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      const newItem = await adminApiService.createShopItem(data);
      showSuccess("Đã tạo shop item thành công");
      setShowCreateDialog(false);
      loadShopItems();
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể tạo shop item");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      setLoading(true);
      const updatedItem = await adminApiService.updateShopItem(id, data);
      showSuccess("Đã cập nhật shop item thành công");
      setEditingItem(null);
      // Update in local state
      if (updatedItem) {
        setShopItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      } else {
        // If update doesn't return data, try to fetch by ID
        try {
          const fetchedItem = await adminApiService.getShopItemById(id);
          setShopItems(prev => prev.map(item => item.id === id ? fetchedItem : item));
        } catch (fetchError) {
          console.warn("⚠️ Could not fetch updated shop item by ID, using local update");
        }
      }
      // Try to reload
      try {
        await loadShopItems();
      } catch (reloadError) {
        console.warn("⚠️ Could not reload shop items list, but item was updated");
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể cập nhật shop item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa shop item này?")) return;

    try {
      setLoading(true);
      await adminApiService.deleteShopItem(id);
      showSuccess("Đã xóa shop item thành công");
      loadShopItems();
    } catch (error: any) {
      showError(error?.response?.data?.message || "Không thể xóa shop item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Quản lý Shop Items
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tạo và quản lý các sản phẩm trong cửa hàng
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity shadow"
        >
          <Plus className="w-5 h-5" />
          Tạo Shop Item
        </button>
      </div>

      <ShopItemList
        items={shopItems}
        loading={loading}
        onEdit={(item) => setEditingItem(item)}
        onDelete={handleDelete}
      />

      {showCreateDialog && (
        <CreateShopItemDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingItem && (
        <EditShopItemDialog
          item={editingItem}
          open={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) => handleUpdate(editingItem.id, data)}
        />
      )}
    </div>
  );
}





