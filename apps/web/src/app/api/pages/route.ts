import { NextResponse } from 'next/server';

let globalPages: any[] = [
  {
    id: 'home',
    title: 'Home Downloader',
    slug: 'home',
    seoTitle: 'TTDownloader - Download TikTok Videos Without Watermark',
    seoDescription: 'Download TikTok videos without watermark in HD quality for free.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'h-1', type: 'hero', title: 'Download TikTok Videos Without Watermark', subtitle: 'Fast, free, and completely ad-free. Just paste the link and get your video.', bgColor: '#8b5cf6' },
      { id: 'h-2', type: 'downloader_tool' }
    ])
  },
  {
    id: 'video',
    title: 'TikTok Video Downloader',
    slug: 'video',
    seoTitle: 'TikTok Video Downloader - TTDownloader',
    seoDescription: 'Download HD videos without watermark in MP4 format.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'v-1', type: 'hero', title: 'TikTok Video Downloader', subtitle: 'Download HD videos without watermark in MP4 format.', bgColor: '#3b82f6' },
      { id: 'v-2', type: 'downloader_tool' }
    ])
  },
  {
    id: 'audio',
    title: 'TikTok Audio Extractor',
    slug: 'audio',
    seoTitle: 'TikTok Audio Extractor - TTDownloader',
    seoDescription: 'Extract and download MP3 audio from any TikTok video.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'au-1', type: 'hero', title: 'TikTok Audio Extractor', subtitle: 'Extract and download MP3 audio from any TikTok video.', bgColor: '#ec4899' },
      { id: 'au-2', type: 'audio_tool' }
    ])
  },
  {
    id: 'bulk',
    title: 'TikTok Profile Bulk Downloader',
    slug: 'bulk',
    seoTitle: 'TikTok Profile Bulk Downloader - TTDownloader',
    seoDescription: 'Enter any TikTok username to fetch and download all their videos at once.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'b-1', type: 'hero', title: 'TikTok Profile Bulk Downloader', subtitle: 'Enter any TikTok username to fetch and download all their videos at once.', bgColor: '#10b981' },
      { id: 'b-2', type: 'bulk_tool' }
    ])
  },
  {
    id: 'apk',
    title: 'Download Our Android App',
    slug: 'apk',
    seoTitle: 'Android APK Release - TTDownloader',
    seoDescription: 'Download the TTDownloader Android app.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'ap-1', type: 'hero', title: 'Download Our Android App', subtitle: 'Get the TTDownloader Android app and download TikTok videos directly.', bgColor: '#f59e0b' },
      { id: 'ap-2', type: 'apk_tool' }
    ])
  },
  {
    id: 'about',
    title: 'About Us Page',
    slug: 'about',
    seoTitle: 'About Us - TTDownloader',
    seoDescription: 'Welcome to Tik-TokDownloader.xyz, a simple and user-friendly online platform designed to make downloading and saving publicly available TikTok content easier.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'ab-1', type: 'hero', title: 'About Us', subtitle: 'Welcome to Tik-TokDownloader.xyz, a simple and user-friendly online platform designed to make downloading and saving publicly available TikTok content easier.', bgColor: '#1e293b' },
      { id: 'ab-2', type: 'paragraph', text: 'Our goal is to provide useful tools that allow users to work with TikTok video links directly from their web browser. Whether you want to download a single video, process multiple videos, or extract audio from supported content, our tools are designed to keep the process simple and convenient.' },
      { id: 'ab-3', type: 'heading', level: 'h2', text: 'What Is Tik-TokDownloader.xyz?' },
      { id: 'ab-4', type: 'paragraph', text: 'Tik-TokDownloader.xyz is an online platform built for users who want a convenient way to work with TikTok video content without installing complicated software.\n\nTikTok contains millions of entertaining, educational, informative, and creative videos. Sometimes users want to save a video for offline viewing, keep a useful tutorial, save audio for personal use, or process multiple video links at once.\n\nOur platform provides several browser-based tools to make these tasks easier.' },
      { id: 'ab-5', type: 'heading', level: 'h2', text: 'Our Main Tools' },
      { id: 'ab-6', type: 'heading', level: 'h3', text: 'TikTok Video Downloader' },
      { id: 'ab-7', type: 'paragraph', text: 'Our main TikTok Video Downloader allows users to process a publicly available TikTok video link and access the available download options.\n\nThe process is simple:\n\n1. Find a TikTok video.\n2. Copy its link.\n3. Paste the link into our downloader.\n4. Start the download.\n5. Save the available video to your device.\n\nThe available quality depends on the source video and the options available at the time of processing.' },
      { id: 'ab-8', type: 'heading', level: 'h3', text: 'TikTok Audio Extractor' },
      { id: 'ab-9', type: 'paragraph', text: 'Sometimes you may be interested in the audio from a TikTok video rather than the complete video.\n\nOur Audio Extractor is designed to provide a convenient way to extract available audio from supported TikTok video content.\n\nThis can be useful for users who want to listen to audio separately or keep audio for personal offline use.\n\nThe available audio quality depends on the source content and the processing options provided by the service.' },
      { id: 'ab-10', type: 'heading', level: 'h3', text: 'TikTok MP3 Downloader' },
      { id: 'ab-11', type: 'paragraph', text: 'For users who specifically want audio files, our TikTok MP3 Downloader provides a simple browser-based option for converting supported TikTok video content into an audio format.\n\nInstead of downloading the complete video, users can use the available audio option when supported.\n\nThis can be useful when you are interested in the sound, music, spoken content, or other audio contained in a TikTok video.' },
      { id: 'ab-12', type: 'heading', level: 'h3', text: 'TikTok Bulk Downloader' },
      { id: 'ab-13', type: 'paragraph', text: 'Downloading videos one at a time can become inconvenient when you have several links to process.\n\nThat\'s why we also provide a TikTok Bulk Downloader feature for users who need to work with multiple TikTok video URLs.\n\nInstead of processing every link individually, the bulk downloading feature is designed to make handling multiple URLs more convenient.\n\nReflecting that users can provide multiple supported TikTok links and process them through the available bulk downloading options.\n\nThe actual availability and number of videos that can be processed may depend on the current service limitations and source content.' },
      { id: 'ab-14', type: 'heading', level: 'h2', text: 'Why We Built These Tools' },
      { id: 'ab-15', type: 'paragraph', text: 'Our goal is to reduce unnecessary complexity.\n\nMany online tools can be confusing, require unnecessary registrations, or ask users to install additional applications. We believe a useful online tool should be straightforward and accessible.\n\nThat\'s why Tik-TokDownloader.xyz focuses on:\n\n* Simple browser-based tools\n* Easy-to-understand interfaces\n* Mobile-friendly access\n* Support for different downloading needs\n* No unnecessary software installation\n* Convenient processing of supported TikTok links' },
      { id: 'ab-16', type: 'heading', level: 'h2', text: 'Designed for Mobile and Desktop Users' },
      { id: 'ab-17', type: 'paragraph', text: 'TikTok is primarily used on smartphones, so we understand the importance of a mobile-friendly experience.\n\nTik-TokDownloader.xyz can be accessed through modern browsers on:\n\n* Android phones\n* iPhones\n* Tablets\n* Windows computers\n* Mac computers\n* Other supported devices\n\nYou don\'t need to use a specific operating system to access our online tools. Simply open the website through a compatible browser and use the tool you need.' },
      { id: 'ab-18', type: 'heading', level: 'h2', text: 'How Our Platform Works' },
      { id: 'ab-19', type: 'paragraph', text: 'Our tools are designed around a simple URL-based workflow.\n\nYou provide a supported TikTok video link, and the relevant tool processes the available information associated with that URL. Depending on the tool you choose, you may then receive options for downloading the video, processing multiple videos, or extracting available audio.\n\nBecause the source content can vary, download formats, quality, and availability may not be identical for every video.' },
      { id: 'ab-20', type: 'heading', level: 'h2', text: 'Privacy and Security' },
      { id: 'ab-21', type: 'paragraph', text: 'We believe users should always be careful when using online downloading services.\n\nTik-TokDownloader.xyz does not require users to provide their TikTok password to use the downloader tools. We strongly recommend that users never share their TikTok login credentials with third-party downloading websites.\n\nYou should also avoid downloading unknown software, suspicious browser extensions, or files from websites that you do not trust.\n\nFor complete information about privacy and data handling, please visit our Privacy Policy page.' },
      { id: 'ab-22', type: 'heading', level: 'h2', text: 'Respecting Content Creators' },
      { id: 'ab-23', type: 'paragraph', text: 'TikTok videos, music, sounds, and other content may be protected by copyright or other intellectual property rights.\n\nDownloading a video or extracting its audio does not transfer ownership of that content to you.\n\nWe encourage all users to respect the original creators and rights holders. If you intend to repost, redistribute, modify, publish, or use downloaded content for commercial purposes, make sure you have the necessary permission and comply with applicable copyright laws and platform rules.\n\nOur tools are intended to provide technical functionality for supported content and should be used responsibly.' },
      { id: 'ab-24', type: 'heading', level: 'h2', text: 'Our Commitment to a Better Experience' },
      { id: 'ab-25', type: 'paragraph', text: 'We are continuously working to improve Tik-TokDownloader.xyz and make our tools easier and more convenient to use.\n\nAs the needs of TikTok users change, we may introduce improvements to our existing Video Downloader, Audio Extractor, MP3 Downloader, and Bulk Downloader tools.\n\nOur aim is to keep the platform simple while providing useful features for users around the world.' },
      { id: 'ab-26', type: 'heading', level: 'h2', text: 'Have a Question or Suggestion?' },
      { id: 'ab-27', type: 'paragraph', text: 'We value feedback from our visitors.\n\nIf you experience a problem, have a question about one of our tools, or have an idea that could improve the website, you can contact us through our Contact Us page.\n\nUser feedback helps us identify areas where the website can be improved and helps us build a better experience.' },
      { id: 'ab-28', type: 'heading', level: 'h2', text: 'Thank You for Visiting' },
      { id: 'ab-29', type: 'paragraph', text: 'Thank you for visiting Tik-TokDownloader.xyz.\n\nWhether you need to download a single TikTok video, process multiple links with our Bulk Downloader, extract audio, or use our MP3 Downloader, we aim to provide simple browser-based tools that are easy to access and use.\n\nTik-TokDownloader.xyz — Simple and convenient tools for working with supported TikTok content.' }
    ])
  },
  {
    id: 'contact',
    title: 'Contact Us Page',
    slug: 'contact',
    seoTitle: 'Contact Us - TTDownloader',
    seoDescription: 'Get in touch with the support team.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'c-1', type: 'hero', title: 'Get In Touch', subtitle: "Have a question, suggestion, or need support? We'd love to hear from you.", bgColor: '#0f172a' },
      { id: 'c-2', type: 'contact_tool' }
    ])
  },
  {
    id: 'privacy',
    title: 'Privacy Policy Page',
    slug: 'privacy',
    seoTitle: 'Privacy Policy - TTDownloader',
    seoDescription: 'Read the privacy policy of Tik-TokDownloader.xyz to understand how we protect user privacy.',
    isPublished: true,
    layout: JSON.stringify([
      { id: 'p-1', type: 'hero', title: 'Privacy Policy', subtitle: 'Your privacy is extremely important to us. Learn how we handle information on Tik-TokDownloader.xyz.', bgColor: '#0f172a' },
      { id: 'p-2', type: 'heading', level: 'h2', text: '1. Information We Collect' },
      { id: 'p-3', type: 'paragraph', text: 'We believe in keeping things simple and secure. We do not require any personal registrations, accounts, or login details to use our services.\n\nHowever, standard web servers collect basic logs automatically. This includes your IP address, browser type, device details, and referencing pages. This info is used purely for diagnostics, analytics, and service optimizations.' },
      { id: 'p-4', type: 'heading', level: 'h2', text: '2. TikTok URL Processing' },
      { id: 'p-5', type: 'paragraph', text: 'Our downloader works entirely on URL processing. When you input a TikTok video URL, our platform processes that link to retrieve direct download media addresses.\n\nWe do not store downloaded videos or audio files on our servers. The actual download is processed in real-time and served to your browser client directly.' },
      { id: 'p-6', type: 'heading', level: 'h2', text: '3. Cookies & Local Storage' },
      { id: 'p-7', type: 'paragraph', text: 'TikTokDownloader.xyz may use cookies to store your preferences, search selections, or system theme status.\n\nWe also use browser localStorage to allow safe saving and layout settings cache. You can reset these settings anytime by clicking the Clear Cache option in user settings or deleting browser cookies.' },
      { id: 'p-8', type: 'heading', level: 'h2', text: '4. Third-Party Advertisements' },
      { id: 'p-9', type: 'paragraph', text: 'We may display banner advertisements from third-party networks (such as Google AdSense) to support website operation costs. These ad providers may set tracking cookies to serve targeted ads based on your search history and web visits.' },
      { id: 'p-10', type: 'heading', level: 'h2', text: '5. Children\'s Privacy' },
      { id: 'p-11', type: 'paragraph', text: 'Our tools are built for public web access and do not target or harvest data from children under the age of 13. If you believe a child has provided any tracking details, please contact us.' },
      { id: 'p-12', type: 'heading', level: 'h2', text: '6. Policy Updates' },
      { id: 'p-13', type: 'paragraph', text: 'This Privacy Policy is subject to change at any time to comply with legal guidelines or technical system additions. Any changes will be updated on this page immediately.' }
    ])
  }
];

export function getPagesStore() {
  return globalPages;
}

export function savePagesStore(pages: any[]) {
  globalPages = pages;
  return globalPages;
}

export async function GET() {
  return NextResponse.json(globalPages);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const generatedSlug = body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `page-${Date.now()}`;
    const newPage = {
      id: body.id || `page-${Date.now()}`,
      title: body.title || 'Untitled Page',
      slug: generatedSlug,
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || '',
      seoKeywords: body.seoKeywords || '',
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
      layout: body.layout || JSON.stringify([]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    globalPages = [...globalPages.filter(p => p.slug !== generatedSlug && p.id !== newPage.id), newPage];
    return NextResponse.json(newPage);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
