import { create } from "zustand";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clear: () => void;
}

export const useTokenInfoStorage = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  setToken: (token) => set({ token }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  clear: () => set({ token: null, refreshToken: null }),
}));
