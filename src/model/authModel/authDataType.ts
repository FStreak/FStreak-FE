/** Dữ liệu gửi khi login */
export interface LoginType {
  email: string;
  password: string;
}

/** Dữ liệu trả về từ server sau khi login */
export interface LoginResponse {
  succeeded: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    currentStreak: number;
    longestStreak: number;
    roles: string[];
  };
}

export interface RegisterType {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

/** User profile returned from /users/me */
export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
  currentStreak: number;
  longestStreak: number;
}

/** Dữ liệu trả về sau khi đăng ký */
export interface RegisterResponse {
  succeeded: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    currentStreak: number;
    longestStreak: number;
    roles: string[];
  };
}

// src/model/authModel/authLogoutType.ts
export interface LogoutRequest {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  succeeded: boolean;
  message: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType?: string;
  expires?: string | null;
  user?: unknown | null;
}
