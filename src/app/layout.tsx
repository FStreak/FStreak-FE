import "./globals.css";
import { ToastConfig } from "@/components/ui/ToastConfig";
import { ThemeProvider } from "@/components/theme-provider";
import LoadingSplash from "@/components/LoadingSplash";
import CheckStreakTimer from "@/components/streak/CheckStreakTimer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingSplash />
          <CheckStreakTimer />
          {children}
          <ToastConfig /> {/* 👈 Gắn Toaster toàn cục */}
        </ThemeProvider>
      </body>
    </html>
  );
}
