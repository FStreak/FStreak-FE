"use client";

import { Toaster } from "react-hot-toast";

export const ToastConfig = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          borderRadius: "12px",
          background: "linear-gradient(to right, #fff7ed, #fef3c7)",
          color: "#92400e",
          fontWeight: 600,
          padding: "10px 16px",
        },
        duration: 3500,
        success: {
          iconTheme: {
            primary: "#f97316",
            secondary: "#fff",
          },
          style: {
            background: "linear-gradient(to right, #fff7ed, #ffedd5)",
            color: "#78350f",
            boxShadow: "0 2px 10px rgba(249,115,22,0.3)",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fff",
          },
          style: {
            background: "linear-gradient(to right, #fee2e2, #fecaca)",
            color: "#7f1d1d",
            boxShadow: "0 2px 10px rgba(220,38,38,0.25)",
          },
        },
        loading: {
          style: {
            background: "linear-gradient(to right, #fef9c3, #fef08a)",
            color: "#854d0e",
            boxShadow: "0 2px 10px rgba(250,204,21,0.25)",
          },
        },
      }}
    />
  );
};
