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