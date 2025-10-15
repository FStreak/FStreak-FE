import type { AxiosInstance, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { useTokenInfoStorage } from "../store/authStore";
import { PublicRoute } from "../const/pathList";

interface RefreshTokenResponse {
  succeeded: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export const setupInterceptors = (privateClient: AxiosInstance, publicClient: AxiosInstance) => {
  // 🟢 Thêm token vào header
  privateClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { token } = useTokenInfoStorage.getState();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 🔴 Xử lý lỗi + refresh token
  privateClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      const isTokenExpiredError = error.response?.status === 401;

      // ✅ Khi token hết hạn + chưa retry
      if (isTokenExpiredError && !originalRequest._retry) {
        originalRequest._retry = true;

        const { token, refreshToken, setToken, setRefreshToken, clear } = useTokenInfoStorage.getState();

        try {
          // Gửi request refresh token
          const response = await publicClient.post<RefreshTokenResponse>("/auth/refresh", {
            accessToken: token,
            refreshToken,
          });

          const data = response.data;
          if (data?.accessToken) {
            // Lưu token mới
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            // Gán token mới và retry request cũ
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }

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
      return Promise.reject(error);
    }
  );

  // 🟣 Public client không cần interceptor phức tạp
  publicClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
};
