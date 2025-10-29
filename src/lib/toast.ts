// src/lib/toast.ts
import toastLib from "react-hot-toast";

/** ✅ Thành công */
export const showSuccess = (message: string) =>
  toastLib.success(message, { id: "success-toast" });

/** ❌ Lỗi */
export const showError = (message: string) =>
  toastLib.error(message, { id: "error-toast" });

/** 💬 Thông tin */
export const showInfo = (message: string) =>
  toastLib(message, { icon: "💡", id: "info-toast" });

/** ⏳ Loading (ví dụ: trong khi đang fetch) */
export const showLoading = (message: string) =>
  toastLib.loading(message, { id: "loading-toast" });

/** 🚀 Promise wrapper (gọi API có 3 trạng thái) */
export const showPromise = async <T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) => {
  await toastLib.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};

// Export a toast object with common methods for easier usage
export const toast = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  loading: showLoading,
  promise: showPromise,
};
