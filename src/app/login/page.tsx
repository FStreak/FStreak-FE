"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Home } from "lucide-react";
import { publicApiService } from "@/services/ApiPublic";
import { useTokenInfoStorage } from "@/store/authStore";
import type { AxiosError } from "axios";
import { showSuccess, showError, showLoading } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      showLoading("Đang đăng nhập...");

      const res = await publicApiService.login({ email, password });
      const data = res as {
        accessToken?: string;
        refreshToken?: string;
        message?: string;
      };

      if (data.accessToken) {
        const { setToken, setRefreshToken } = useTokenInfoStorage.getState();
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken ?? "");

        showSuccess("Đăng nhập thành công 🔥");
        router.push("/");
      } else {
        showError(data.message || "Đăng nhập thất bại 😢");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      const message =
        err.response?.data?.message ||
        "Không thể đăng nhập. Vui lòng kiểm tra lại thông tin.";

      showError(message);
      console.error("Login failed:", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen flex flex-col items-center justify-center
        bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-200
        p-6
      "
    >
      {/* 🔥 Logo */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-orange-600 to-yellow-500 rounded-2xl shadow-lg">
          <Flame className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
          F-Streak
        </h1>
      </div>

      {/* 🧊 Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl border border-orange-200 shadow-xl px-10 py-12">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to continue your streak
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Email
            </label>
            <input
              required
              type="email"
              placeholder="student@fpt.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full h-12 px-4 rounded-lg bg-orange-50 text-gray-700 
                border border-orange-200 focus:outline-none 
                focus:border-orange-400 focus:ring-2 focus:ring-orange-200 
                transition
              "
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Password
            </label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full h-12 px-4 rounded-lg bg-yellow-50 text-gray-700 
                border border-yellow-200 focus:outline-none 
                focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 
                transition
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 mt-2 text-white text-lg font-semibold rounded-lg 
              bg-gradient-to-r from-orange-500 to-yellow-400 
              hover:opacity-90 transition-all shadow-md 
              flex justify-center items-center
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
          <p>
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-orange-600 font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>

          <p
            onClick={() => router.push("/forgot-password")}
            className="text-orange-500 hover:underline cursor-pointer"
          >
            Forgot password?
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-3 flex items-center justify-center gap-2 text-orange-400 font-semibold hover:text-orange-700 transition-colors w-full"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-600">
        © {new Date().getFullYear()} F-Streak — Keep your flame alive.
      </footer>
    </div>
  );
}
