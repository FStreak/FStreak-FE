import axios, { type AxiosInstance, type AxiosResponse } from "axios";

// 🟠 Dùng biến môi trường đúng chuẩn Next.js
const API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  //"https://fstreak-render.onrender.com/api"; 
  "https://localhost:7281/api";

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

// ✅ Helper function to extract data from axios response
export const wrapResponse = <T>(axiosResponse: AxiosResponse<T>): T => {
  return axiosResponse.data; // Trả về data trực tiếp
};
