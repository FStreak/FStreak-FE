import axios, { type AxiosInstance } from "axios";

// 🟠 Dùng biến môi trường đúng chuẩn Next.js
const API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  "https://fstreak-render.onrender.com/api"; // fallback nếu .env chưa có

export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000, // 10 giây
  });

  return client;
};
