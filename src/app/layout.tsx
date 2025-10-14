import "./globals.css";
import { ToastConfig } from "@/components/ui/ToastConfig";
import { ThemeProvider } from "@/components/theme-provider";

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
          {children}
          <ToastConfig /> {/* 👈 Gắn Toaster toàn cục */}
        </ThemeProvider>
      </body>
    </html>
  );
}
