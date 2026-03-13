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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${inter.className} bg-surface-light`}>
        <div className="flex min-h-screen relative overflow-x-hidden">
          <Sidebar />
          <main className="flex-1 w-full lg:ml-72 min-h-screen">
            <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 pt-20 lg:pt-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
