"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Home } from "lucide-react";
import { publicApiService } from "@/services/ApiPublic";
import { useTokenInfoStorage } from "@/store/authStore";
import type { AxiosError } from "axios";
import type { RegisterType } from "@/model/authModel/authDataType";
import { showSuccess, showError, showLoading } from "@/lib/toast";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegisterType>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterType, string>>
  >({});

  /** 🧩 Handle input changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** 🧩 Handle submit */
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      showLoading("Đang tạo tài khoản...");

      // ✅ Gọi API và nhận response đúng
      const data = await publicApiService.register(form);

      if (data.succeeded && data.accessToken) {
        const { setToken, setRefreshToken, setUserId } =
          useTokenInfoStorage.getState();
        setToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUserId(data.user.id);
        localStorage.setItem("user", JSON.stringify(data.user));

        showSuccess(`Chào mừng ${data.user.firstName}! 🎉`);
        router.push("/");
      } else if (data.succeeded) {
        showSuccess(
          data.message ||
            "Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản 📧"
        );
        router.push("/login");
      } else {
        showError(data.message || "Đăng ký thất bại 😢");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{
        message?: string;
        errors?: Record<string, string>;
      }>;

      const message =
        err.response?.data?.message ||
        "Không thể đăng ký. Vui lòng kiểm tra lại thông tin.";

      console.error("❌ Registration failed:", message);

      if (message.toLowerCase().includes("email")) {
        showError("Email đã tồn tại. Vui lòng dùng email khác!");
      } else if (message.toLowerCase().includes("network")) {
        showError("Lỗi mạng. Kiểm tra kết nối internet!");
      } else {
        showError(message);
      }

      // Nếu backend trả lỗi cụ thể từng field (validation error)
      if (err.response?.data?.errors) {
        setErrors(
          err.response.data.errors as Partial<
            Record<keyof RegisterType, string>
          >
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /** 🧊 UI */
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

      {/* 🧱 Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl border border-orange-200 shadow-xl px-10 py-12">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Join the community and start your streak today
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          {[
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "student@fpt.edu.vn",
            },
            {
              label: "Username",
              name: "username",
              type: "text",
              placeholder: "quangtran01",
            },
            {
              label: "First Name",
              name: "firstName",
              type: "text",
              placeholder: "Quang",
            },
            {
              label: "Last Name",
              name: "lastName",
              type: "text",
              placeholder: "Tran",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                {field.label}
              </label>
              <input
                required
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name as keyof RegisterType]}
                onChange={handleChange}
                className={`w-full h-12 px-4 rounded-lg bg-orange-50 text-base text-gray-700 border transition 
                  ${
                    errors[field.name as keyof RegisterType]
                      ? "border-red-400 focus:ring-red-200"
                      : "border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  }`}
              />
              {errors[field.name as keyof RegisterType] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name as keyof RegisterType]}
                </p>
              )}
            </div>
          ))}

          {/* Password fields */}
          {["password", "confirmPassword"].map((name) => (
            <div key={name}>
              <label className="block text-gray-700 font-semibold mb-2 text-sm capitalize">
                {name === "confirmPassword" ? "Confirm Password" : "Password"}
              </label>
              <input
                required
                type="password"
                name={name}
                placeholder={
                  name === "confirmPassword"
                    ? "Re-enter your password"
                    : "Enter your password"
                }
                value={form[name as keyof RegisterType]}
                onChange={handleChange}
                className={`w-full h-12 px-4 rounded-lg bg-yellow-50 text-base text-gray-700 border transition 
                  ${
                    errors[name as keyof RegisterType]
                      ? "border-red-400 focus:ring-red-200"
                      : "border-yellow-200 focus:border-yellow-400 focus:ring-yellow-200"
                  }`}
              />
              {errors[name as keyof RegisterType] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[name as keyof RegisterType]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-white text-lg font-semibold rounded-lg 
                       bg-gradient-to-r from-orange-500 to-yellow-400 hover:opacity-90 transition-all
                       shadow-[0_2px_10px_rgba(255,165,0,0.3)] flex justify-center items-center"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* 🦶 Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
          <p>
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-orange-600 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
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
