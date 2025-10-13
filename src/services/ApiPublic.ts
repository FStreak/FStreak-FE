import { apiService } from "./apiService";
import type { ApiResponse } from "../model/apiType/apiType";
import type { RegisterType, RegisterResponse, LoginType, LoginResponse } from "../model/authModel/authDataType";

export const publicApiService = {
  login: (loginInfo: LoginType): Promise<ApiResponse<LoginResponse>> =>
    apiService.publicApiClient.post("/api/auth/login", loginInfo),

  register: (registerInfo: RegisterType): Promise<ApiResponse<RegisterResponse>> =>
    apiService.publicApiClient.post("/api/auth/register", registerInfo),

  getNewToken: (): Promise<ApiResponse<{ accessToken: string }>> =>
    apiService.publicApiClient.post("/api/auth/refresh"),
};
