import "./globals.css";
import { ToastConfig } from "@/components/ui/ToastConfig";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastConfig /> {/* 👈 Gắn Toaster toàn cục */}
      </body>
    </html>
  );
}
