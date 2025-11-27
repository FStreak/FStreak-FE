"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import type { ShopItemDto, UpdateShopItemDto } from "@/model/admin/adminTypes";

interface EditShopItemDialogProps {
  item: ShopItemDto;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateShopItemDto) => void;
}

export default function EditShopItemDialog({
  item,
  open,
  onClose,
  onSubmit,
}: EditShopItemDialogProps) {
  const [formData, setFormData] = useState<UpdateShopItemDto>({
    name: item.name,
    description: item.description,
    price: item.price,
    imageUrl: item.imageUrl,
    category: item.category,
    isAvailable: item.isAvailable,
    stock: item.stock,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(item.imageUrl || null);

  useEffect(() => {
    if (open) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
        isAvailable: item.isAvailable,
        stock: item.stock,
      });
      setImagePreview(item.imageUrl || null);
    }
  }, [open, item]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 1MB)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        alert(`File ảnh quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB). Vui lòng chọn file nhỏ hơn 1MB.`);
        e.target.value = ""; // Reset input
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Vui lòng chọn file ảnh hợp lệ");
        e.target.value = ""; // Reset input
        return;
      }
      
      setFormData({ ...formData, imageFile: file, imageUrl: "" });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageFile: undefined, imageUrl: "" });
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Sửa Shop Item
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
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá *
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số lượng
              </label>
              <input
                type="number"
                value={formData.stock || 0}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                }
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hình ảnh
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click để upload</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF (MAX. 1MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Danh mục
            </label>
            <input
              type="text"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAvailable || false}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Có sẵn
              </span>
            </label>
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}







