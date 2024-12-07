import React from 'react'
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/TopBar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Content AI",
  description: "Repurpose your content across social media platforms",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-background text-text`}
        suppressHydrationWarning
      >
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
