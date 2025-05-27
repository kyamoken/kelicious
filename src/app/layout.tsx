import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";              // Tailwind via PostCSS
import "leaflet/dist/leaflet.css";    // ← Leaflet のスタイルを追加

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "茨城食べログ日記",
  description: "地元グルメをマップで記録するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* next-auth のセッションコンテキストを提供 */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}