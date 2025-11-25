"use client";

import type { ShopItemDto } from "@/model/admin/adminTypes";
import { ShoppingBag, Edit, Trash2 } from "lucide-react";

interface ShopItemListProps {
  items: ShopItemDto[];
  loading: boolean;
  onEdit: (item: ShopItemDto) => void;
  onDelete: (id: string) => void;
}

export default function ShopItemList({
  items,
  loading,
  onEdit,
  onDelete,
}: ShopItemListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Chưa có shop item nào
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Tạo shop item đầu tiên để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div
          key={item.id || `shop-item-${index}`}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="mb-4">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-48 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                <ShoppingBag className="w-16 h-16 text-white" />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {item.name}
                </h3>
                {item.category && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.category}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500 text-lg">
                  {item.price.toLocaleString("vi-VN")} đ
                </p>
                {item.stock !== undefined && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Còn: {item.stock}
                  </p>
                )}
              </div>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Sửa
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="px-3 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}





