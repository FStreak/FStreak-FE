import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { useTokenInfoStorage } from "../store/authStore";
import { PublicRoute } from "../const/pathList";
import type { ApiError } from "../model/apiType/apiType";

interface RefreshResponse {
  succeeded: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export const setupInterceptors = (privateClient: AxiosInstance, publicClient: AxiosInstance) => {
  // 🟢 Thêm token vào header
  privateClient.interceptors.request.use(
    (config) => {
      const { token } = useTokenInfoStorage.getState();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 🔴 Xử lý lỗi + refresh token
  privateClient.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      const errorData = error.response?.data as { status?: number; message?: string };
      const isTokenExpiredError =
        errorData?.message?.includes("TOKEN_EXPIRED") ||
        error.response?.status === 401;

      // ✅ Khi token hết hạn + chưa retry
      if (isTokenExpiredError && !originalRequest._retry) {
        originalRequest._retry = true;

        const { token, refreshToken, setToken, setRefreshToken, clear } = useTokenInfoStorage.getState();

        try {
          // Gửi request refresh token đúng chuẩn backend
          const res = await publicClient.post<RefreshResponse>("/auth/refresh", {
            accessToken: token,
            refreshToken,
          });

          const data = res as unknown as RefreshResponse;
          if (data?.accessToken) {
            // Lưu token mới
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            // Gán token mới và retry request cũ
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${data.accessToken}`,
            };

            return privateClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("❌ Refresh token failed:", refreshError);
          clear();
          window.location.href = PublicRoute.LOGIN_PATH;
          return Promise.reject(refreshError);
        }
      }

      // ❌ Nếu không phải lỗi token
      const errorResMessage = error.response?.data as ApiError;
      return Promise.reject(errorResMessage?.message || "Unexpected error");
    }
  );

  // 🟣 Public client error handler
  publicClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const errorResMessage = error.response?.data as ApiError;
      return Promise.reject(errorResMessage?.message || "Request failed");
    }
  );
};
