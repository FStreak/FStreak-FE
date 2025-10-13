// src/lib/toast.ts
import toast from "react-hot-toast";

/** ✅ Thành công */
export const showSuccess = (message: string) =>
  toast.success(message, { id: "success-toast" });

/** ❌ Lỗi */
export const showError = (message: string) =>
  toast.error(message, { id: "error-toast" });

/** 💬 Thông tin */
export const showInfo = (message: string) =>
  toast(message, { icon: "💡", id: "info-toast" });

/** ⏳ Loading (ví dụ: trong khi đang fetch) */
export const showLoading = (message: string) =>
  toast.loading(message, { id: "loading-toast" });

/** 🚀 Promise wrapper (gọi API có 3 trạng thái) */
export const showPromise = async <T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) => {
  await toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};
