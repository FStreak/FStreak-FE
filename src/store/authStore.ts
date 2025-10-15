import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clear: () => void;
}

export const useTokenInfoStorage = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      setToken: (token) => {
        console.log("🔐 Setting token:", token?.substring(0, 30) + "...");
        set({ token });
      },
      setRefreshToken: (refreshToken) => {
        console.log("🔄 Setting refresh token:", refreshToken?.substring(0, 30) + "...");
        set({ refreshToken });
      },
      clear: () => {
        console.log("🧹 Clearing all tokens");
        set({ token: null, refreshToken: null });
      },
    }),
    {
      name: "fstreak-auth-storage", // LocalStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
