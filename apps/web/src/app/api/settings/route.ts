import { NextResponse } from 'next/server';

let globalSettings: Record<string, string> = {
  site_name: 'TikSavePro',
  site_tagline: 'TikSavePro – TikTok Video Downloader, MP3 & Bulk Download Tools',
  meta_description: 'TikSavePro – TikTok video downloader, MP3 audio extraction, and bulk download tools. Download TikTok videos without watermark in HD quality directly from your browser.',
  meta_keywords: 'tiktok downloader, no watermark, save tiktok, download tiktok mp4, tiktok audio, bulk download',
  google_analytics: 'G-XXXXXXXXXX',
  robots_txt: 'User-agent: *\nAllow: /',
  ad_top_code: '<div class="w-full h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic mb-6">Advertisement Slot (Top Banner)</div>',
  ad_bottom_code: '<div class="w-full h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic mt-8">Advertisement Slot (Bottom Banner)</div>',
  ad_sidebar_code: '<div class="w-full h-64 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic">Advertisement Slot (Sidebar Banner)</div>',
  ad_result_code: '<div class="w-full h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-text-secondary text-sm italic my-4">Advertisement Slot (Download Result Page Banner)</div>',
  page_home_title: 'Download TikTok Videos Without Watermark',
  page_home_desc: 'Fast, free, and ad-supported online tool. Paste any public TikTok link to download your video.',
  page_video_title: 'TikTok Video Downloader',
  page_video_desc: 'Download HD videos without watermark in MP4 format.',
  page_audio_title: 'TikTok Audio Extractor',
  page_audio_desc: 'Extract and download MP3 audio from any TikTok video.',
  page_bulk_title: 'TikTok Profile Bulk Downloader',
  page_bulk_desc: 'Enter any TikTok username to fetch all their videos at once.',
  page_apk_title: 'Download Our Android App',
  page_apk_desc: 'Get the TikSavePro Android app and download TikTok videos directly from your phone with ease.',
  page_about_content: 'TikSavePro is an independent, free online platform for downloading and working with publicly available TikTok content. Simple, browser-based tools without complicated software.',
  page_contact_email: 'contact@tik-tokdownloader.xyz',
  primary_color: '#8b5cf6',
  custom_css: '',
  maintenance_mode: 'false',
  allow_registration: 'false',
  
  // Google AdSense Configuration
  adsense_enabled: 'false',
  adsense_publisher_id: '',
  adsense_header_slot: '',
  adsense_download_slot: '',
  adsense_footer_slot: '',
  adsense_sidebar_slot: '',
  adsense_ad_format: 'auto',
  adsense_full_width_responsive: 'true',
  adsense_verification_code: '',
  ads_txt_content: '',
};

export function getSettingsStore() {
  return globalSettings;
}

export function saveSettingsStore(settings: Record<string, string>) {
  globalSettings = { ...globalSettings, ...settings };
  return globalSettings;
}

export async function GET() {
  const list = Object.entries(globalSettings).map(([key, value]) => ({ key, value }));
  return NextResponse.json(list);
}
