import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./provider"; // Pastikan path ini benar sesuai lokasi file providers.tsx Anda

export const metadata: Metadata = {
  title: "Dharma Avalanche dApp",
  description: "Pamulang University Short Course",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Ini adalah bagian kunci: Providers harus membungkus children */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}