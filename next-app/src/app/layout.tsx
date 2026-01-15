import type { Metadata, Viewport } from "next";
import { Inter, Tajawal } from "next/font/google";
import "@/styles/style.css";
import BottomNav from "@/components/BottomNav";
import DataLoadWrapper from "@/components/DataLoadWrapper";
import "@/styles/mobile-enhancements.css";
import "@/styles/search-cards.css";
import "@/styles/settings.css";
import "@/styles/premium-v2.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const tajawal = Tajawal({
  weight: ["300", "400", "500", "700"],
  subsets: ["arabic"],
  variable: "--font-tajawal"
});

export const metadata: Metadata = {
  title: "SnabbaLexin - Svensk-Arabiskt Lexikon",
  description: "القاموس السويدي العربي",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/images/icon.svg",
    apple: "/assets/images/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f2937",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${tajawal.variable}`} suppressHydrationWarning>
        <DataLoadWrapper>
          <div className="ambient-background">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
          {children}
          <BottomNav />
        </DataLoadWrapper>
      </body>
    </html>
  );
}
