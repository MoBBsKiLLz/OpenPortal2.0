// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from '@/src/context/ThemeContext';

export const metadata: Metadata = {
  title: "OpenPortal 2.0",
  description: "Secure portal login and registration app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThemeProvider>
  );
}
