import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import PluginInjector from "@/components/PluginInjector";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "TTDownloader - Download TikTok Videos Without Watermark",
  description: "The fastest TikTok downloader to save videos, audio, and bulk downloads without watermark. Free forever.",
  keywords: "tiktok downloader, no watermark, save tiktok, download tiktok mp4, tiktok audio",
  openGraph: {
    title: "TTDownloader - TikTok Downloader",
    description: "Download TikTok videos without watermark instantly.",
    type: "website",
    siteName: "TTDownloader"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <PluginInjector />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

