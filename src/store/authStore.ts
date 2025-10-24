import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: string | null; // ✅ thêm userId
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUserId: (id: string) => void; // ✅ hàm set userId
  clear: () => void;
}

export const useTokenInfoStorage = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      userId: null,

      setToken: (token) => {
        console.log("🔐 Setting token:", token?.substring(0, 25) + "...");
        set({ token });
      },

      setRefreshToken: (refreshToken) => {
        console.log("🔄 Setting refresh token:", refreshToken?.substring(0, 25) + "...");
        set({ refreshToken });
      },

      setUserId: (id) => {
        console.log("👤 Setting user ID:", id);
        set({ userId: id });
      },

      clear: () => {
        console.log("🧹 Clearing all tokens & user info");
        set({ token: null, refreshToken: null, userId: null });
      },
    }),
    {
      name: "fstreak-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
