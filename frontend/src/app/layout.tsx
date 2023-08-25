import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/store/auth";

import { Providers } from "./GlobalRedux/provider";

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
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
