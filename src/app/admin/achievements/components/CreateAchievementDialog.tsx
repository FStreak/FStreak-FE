"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import type { CreateAchievementDto } from "@/model/admin/adminTypes";

interface CreateAchievementDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAchievementDto) => void;
}

export default function CreateAchievementDialog({
  open,
  onClose,
  onSubmit,
}: CreateAchievementDialogProps) {
  const [formData, setFormData] = useState<CreateAchievementDto>({
    name: "",
    code: "",
    description: "",
    iconUrl: "",
    points: 0,
  });
  
  // Generate code from name automatically
  const generateCodeFromName = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .substring(0, 50); // Limit length
  };
  
  // Update code when name changes (if code is empty or matches old name pattern)
  const handleNameChange = (name: string) => {
    const newCode = generateCodeFromName(name);
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-update code if it's empty or was auto-generated
      code: prev.code === "" || prev.code === generateCodeFromName(prev.name) ? newCode : prev.code
    }));
  };
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({ name: "", code: "", description: "", iconUrl: "", points: 0 });
      setIconPreview(null);
      setIconFile(null);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
        return;
      }

      setIconFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIconPreview(result);
        setFormData({ ...formData, iconUrl: result }); // Store as base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    setFormData({ ...formData, iconUrl: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên achievement");
      return;
    }
    
    if (!formData.code.trim()) {
      alert("Vui lòng nhập mã code cho achievement");
      return;
    }
    
    // Prepare data: don't send base64 data URLs (too large), only send URL strings
    const submitData: CreateAchievementDto = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      ...(formData.description && formData.description.trim() ? { description: formData.description.trim() } : {}),
      ...(formData.points !== undefined && formData.points !== null && formData.points > 0 ? { points: formData.points } : {}),
      // Only send iconUrl if it's a URL string, not base64
      // For now, we'll skip base64 images as they're too large for API
      // TODO: Implement image upload to server first, then send URL
      ...(formData.iconUrl && !formData.iconUrl.startsWith('data:image/') ? { iconUrl: formData.iconUrl } : {}),
    };
    
    console.log("🔍 Submitting achievement form data:", submitData);
    onSubmit(submitData);
    
    // Reset form after successful submission (will be called from parent)
    // Don't reset here in case of error
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Tạo Achievement
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
              Tên Achievement *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })
              }
              placeholder="first-step, top-100, etc."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Mã code duy nhất cho achievement (tự động tạo từ tên, có thể chỉnh sửa)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            
            {iconPreview ? (
              <div className="space-y-2">
                <div className="relative w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                    {iconFile?.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 dark:hover:border-orange-500 transition-colors bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click để chọn</span> hoặc kéo thả file vào đây
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF (tối đa 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Điểm
            </label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) =>
                setFormData({ ...formData, points: parseInt(e.target.value) || 0 })
              }
              min="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Tạo Achievement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

