import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HRMS Lite — Human Resource Management",
  description:
    "A lightweight Human Resource Management System for managing employees and tracking attendance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          {/* pt-20 on mobile for the top bar, lg:pt-0 on desktop; ml-0 on mobile, lg:ml-64 for sidebar */}
          <main className="flex-1 pt-20 lg:pt-0 lg:ml-72 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
