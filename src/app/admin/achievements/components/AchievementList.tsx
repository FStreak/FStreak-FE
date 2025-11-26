"use client";

import type { AchievementDto } from "@/model/admin/adminTypes";
import { Trophy, Edit, Trash2, Power, PowerOff, Users } from "lucide-react";

interface AchievementListProps {
  achievements: AchievementDto[];
  loading: boolean;
  onEdit: (achievement: AchievementDto) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onAwardToAll?: (achievement: AchievementDto) => void;
}

export default function AchievementList({
  achievements,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onAwardToAll,
}: AchievementListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Chưa có achievement nào
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Tạo achievement đầu tiên để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id || `achievement-${index}`}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {achievement.iconUrl ? (
                <img
                  src={achievement.iconUrl}
                  alt={achievement.name}
                  className="w-12 h-12 rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {achievement.name}
                </h3>
                <div className="flex items-center gap-2">
                  {achievement.code && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded font-mono">
                      {achievement.code}
                    </span>
                  )}
                  {achievement.points && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.points} điểm
                    </p>
                  )}
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                achievement.isActive
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              }`}
            >
              {achievement.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {achievement.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {achievement.description}
            </p>
          )}

          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
            {onAwardToAll && (
              <button
                onClick={() => onAwardToAll(achievement)}
                className="w-full px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Award cho tất cả users
              </button>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(achievement)}
                className="flex-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Sửa
              </button>
              <button
                onClick={() => onToggleStatus(achievement.id, achievement.isActive || false)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  achievement.isActive
                    ? "text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900"
                    : "text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                }`}
              >
                {achievement.isActive ? (
                  <PowerOff className="w-4 h-4" />
                ) : (
                  <Power className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => onDelete(achievement.id)}
                className="px-3 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}





