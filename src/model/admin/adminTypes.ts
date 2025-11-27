// Admin API Types

export interface AdminUser {
  id: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles?: string[];
  isLocked?: boolean;
  lockedUntil?: string | null;
  createdAt?: string;
}

export interface AdminUserListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AddRoleRequest {
  role: string;
}

export interface LockUserRequest {
  isLocked: boolean;
  lockedUntil?: string | null;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface UpdateUserRequest {
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface AchievementDto {
  id: string;
  name: string;
  code?: string;
  description?: string;
  iconUrl?: string;
  points?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAchievementDto {
  name: string;
  code: string;
  description?: string;
  iconUrl?: string;
  points?: number;
}

export interface UpdateAchievementDto {
  name?: string;
  code?: string;
  description?: string;
  iconUrl?: string;
  points?: number;
}

export interface ToggleStatusRequest {
  isActive: boolean;
}

export interface ShopItemDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  isAvailable?: boolean;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateShopItemDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imageFile?: File;
  category?: string;
  isAvailable?: boolean;
  stock?: number;
}

export interface UpdateShopItemDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  imageFile?: File;
  category?: string;
  isAvailable?: boolean;
  stock?: number;
}


