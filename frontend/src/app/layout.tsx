import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/contexts/ToastContext";
import ToastContainer from "@/components/ui/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusShop",
  description: "Petites annonces et troc entre étudiants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex  flex-col bg-background ">
        <ToastProvider>
          <main className="flex-1 max-w-7xl mx-auto">{children}</main>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
