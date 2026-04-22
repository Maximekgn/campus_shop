import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToasterClient from "../components/ToasterClient";
import BodyCleanup from "../components/BodyCleanup";

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
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground">
        <BodyCleanup />
        <ToasterClient />
        <main className="min-h-screen w-full">{children}</main>
      </body>
    </html>
  );
}