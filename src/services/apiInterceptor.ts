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
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
        // Log admin API requests for debugging
        if (config.url?.includes('/admin/')) {
          console.log('🔍 Admin API Request:', {
            url: config.url,
            method: config.method,
            hasAuthHeader: !!config.headers.Authorization,
            authHeaderPrefix: config.headers.Authorization?.toString().substring(0, 30) + '...',
            tokenLength: token.length,
          });
          
          // Decode token to show role
          try {
            const base64Url = token.split('.')[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const decoded = JSON.parse(jsonPayload);
              console.log('🔍 Token payload for admin request:', {
                role: decoded['role'] || decoded['Role'],
                email: decoded['email'],
                nameid: decoded['nameid'],
                allKeys: Object.keys(decoded),
              });
            }
          } catch (e) {
            console.warn('⚠️ Could not decode token for logging:', e);
          }
        }
      } else {
        console.warn('⚠️ No token found for private API request:', config.url);
      }
      
      // Note: For FormData, we let the explicit Content-Type header in the request config take precedence
      // If Content-Type is set in the request config, axios will use it and add boundary automatically
      // If not set, axios will automatically set multipart/form-data with boundary
      
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
      const isForbiddenError = error.response?.status === 403;

      // Log 403 errors for admin APIs with detailed info
      if (isForbiddenError && originalRequest.url?.includes('/admin/')) {
        const { token } = useTokenInfoStorage.getState();
        console.error('🔴 403 Forbidden for Admin API:', {
          url: originalRequest.url,
          method: originalRequest.method,
          hasAuthHeader: !!originalRequest.headers?.Authorization,
          authHeaderValue: originalRequest.headers?.Authorization?.toString().substring(0, 50) + '...',
          responseStatus: error.response?.status,
          responseStatusText: error.response?.statusText,
          responseData: error.response?.data,
          responseHeaders: error.response?.headers,
        });
        
        // Decode token to show what role is being sent
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const decoded = JSON.parse(jsonPayload);
              console.error('🔴 Token being sent to backend:', {
                role: decoded['role'] || decoded['Role'] || 'NOT FOUND',
                email: decoded['email'],
                nameid: decoded['nameid'],
                allClaims: Object.keys(decoded),
                fullPayload: decoded,
              });
            }
          } catch (e) {
            console.error('❌ Could not decode token:', e);
          }
        }
      }

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
