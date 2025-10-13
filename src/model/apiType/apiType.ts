export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
