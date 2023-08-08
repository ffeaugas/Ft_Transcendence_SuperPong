import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { useEffect } from "react";
import { AuthProvider } from "@/store/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ft_Transcendence",
  description:
    "42 Project : Online Pong game by jlarrieu, pdubacqu and ffeaugas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
