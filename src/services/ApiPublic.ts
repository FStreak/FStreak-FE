import { apiService } from "./apiService";
import { wrapResponse } from "./ApiServiceConfig";
import type { RegisterType, RegisterResponse, LoginType, LoginResponse } from "../model/authModel/authDataType";

interface RefreshTokenResponse {
  succeeded: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export const publicApiService = {
  login: async (loginInfo: LoginType): Promise<LoginResponse> => {
    const response = await apiService.publicApiClient.post<LoginResponse>("/auth/login", loginInfo);
    return wrapResponse(response);
  },

  register: async (registerInfo: RegisterType): Promise<RegisterResponse> => {
    const response = await apiService.publicApiClient.post<RegisterResponse>("/auth/register", registerInfo);
    return wrapResponse(response);
  },

  refreshToken: async (accessToken: string, refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiService.publicApiClient.post<RefreshTokenResponse>("/auth/refresh", {
      accessToken,
      refreshToken,
    });
    return wrapResponse(response);
  },
};

export default publicApiService;
