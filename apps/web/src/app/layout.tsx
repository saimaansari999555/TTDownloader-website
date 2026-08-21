import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import PluginInjector from "@/components/PluginInjector";
import AdSenseScriptLoader from "@/components/AdSenseScriptLoader";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "TikSavePro - Download TikTok Videos Without Watermark",
  description: "TikSavePro – TikTok video downloader, MP3 audio extraction, and bulk download tools. Download TikTok videos without watermark in HD quality directly from your browser.",
  keywords: "tiktok downloader, no watermark, save tiktok, download tiktok mp4, tiktok audio, tiktok bulk downloader",
  openGraph: {
    title: "TikSavePro - TikTok Downloader",
    description: "Download TikTok videos without watermark in HD quality directly from your browser with TikSavePro.",
    type: "website",
    siteName: "TikSavePro"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <PluginInjector />
        <AdSenseScriptLoader />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

