import type { Metadata, Viewport } from "next";
import { Urbanist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import PluginInjector from "@/components/PluginInjector";
import AdSenseScriptLoader from "@/components/AdSenseScriptLoader";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090d16",
};

export const metadata: Metadata = {
  title: "TikSavePro - Download TikTok Videos Without Watermark",
  description: "TikSavePro – TikTok video downloader, MP3 audio extraction, and bulk download tools. Download TikTok videos without watermark in HD quality directly from your browser.",
  keywords: "tiktok downloader, no watermark, save tiktok, download tiktok mp4, tiktok audio, tiktok bulk downloader",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "TikSavePro - TikTok Downloader",
    description: "Download TikTok videos without watermark in HD quality directly from your browser with TikSavePro.",
    type: "website",
    siteName: "TikSavePro"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${urbanist.variable} ${spaceGrotesk.variable}`}>
      <body className={`${urbanist.className} antialiased selection:bg-indigo-500/30 selection:text-white`}>
        <PluginInjector />
        <AdSenseScriptLoader />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
