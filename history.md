# 📜 TTDownloader CMS Monorepo - Project History & Architecture Reference

File: `d:\website_tiktok\history.md`  
Last Updated: August 11, 2026

Yeh file aapke project **TTDownloader** (ek modern, enterprise-level TikTok Downloader aur CMS Monorepo) ka poora A to Z jaiza leti hai. Isme project ka architecture, file structure, saare main features aur ab tak ke saare Git Commits ki history Roman English me likhi gayi hai taake aapke paas poora record save rahe.

---

## 🏗️ 1. Architecture Overview (Architecture Ka Jaiza)

Yeh project ek **pnpm workspace monorepo** hai jiske 2 main parts hain:

1. **`apps/web` (Next.js Application)**:
   - **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion.
   - **Roal**: Website ka front-end aur saare interactive downloader tools chalana.
   - **Resilience**: Agar NestJS backend server offline ho, to yeh automatically direct `tikwm.com` API aur Next.js ke internal serverless API route fallbacks ko call kar leta hai taake download service chalti rahe.
   
2. **`apps/api` (NestJS Api Server)**:
   - **Tech Stack**: NestJS (TypeScript), Prisma ORM, SQLite (local development ke liye dev.db) aur PostgreSQL/Redis (production database/caching ke liye).
   - **Roal**: Downloader processing backend, database persistence, website settings aur blog dynamic plugins system ko maintain karna.

---

## 🗂️ 2. A to Z Directory Map & Files (Folders Ka Setup)

### 📂 Workspace Root
* `package.json` — Monorepo scripts aur sub-projects ko manage karne ke liye (jaise `npm run dev`, `build`).
* `pnpm-workspace.yaml` — batata hai ke `apps/*` aur `packages/*` folders monorepo workspaces hain.
* `docker-compose.yml` — Production database (Postgres), Redis cache, API aur web server ki configurations.
* `vercel.json` — Vercel deployments ke monorepo build rules.

### 📂 apps/api (NestJS Server)
* `src/main.ts` — Backend api server ka entry point.
* `prisma/schema.prisma` — Table structures aur models (User, Role, BlogPost, Category, Media, Page, Plugin).
* `src/downloader/` — TikTok videos, MP3 audio extractor aur profile bulk videos download karne ki service files.
* `src/plugins/` — Google Analytics, AdBlock Alert aur Floating Share elements web app me inject karne ka backend script manager.
* `src/app.module.ts` — Saare server modules ko link karne wali core module file.

### 📂 apps/web (Next.js Frontend)
* `src/app/globals.css` — Modern Glassmorphism details, CSS visual variables aur Tailwind theme customization indicators.
* `src/app/p/[slug]/page.tsx` — Dynamic Custom Page builder jo admin block layouts (hero section, custom headings, text, media widgets) ko handle karta hai.
* `src/lib/api.ts` — Client-side API server connector jisme direct failover system configured hai.
* `src/components/tools/`
  * `VideoDownloader.tsx` — Direct TikTok video link inputs aur output downloader UI card.
  * `AudioDownloader.tsx` — Simple MP3 audio extractor utility component.
  * `BulkDownloader.tsx` — TikTok user profile se up to 50 videos ek sath download karne ka tool.
  * `ApkDownloader.tsx` — Android APK app releases details aur download triggers button.
  * `ContactFormTool.tsx` — Contact support message submission form interface.
* `src/app/admin/` — Admin manager dashboard login layout, post creator, plugin togglers screen aur media selector components.
* `src/app/api/` — Next.js key serverless route functions (blog/media handlers) jo Vercel deploy hone par backend offline hone par bhi local caching se chalte hain.

---

## ⚡ 3. Key Technical Implementations (Sare Main Features)

*   **Yoast SEO Scorecard (`SeoChecker.tsx`)**: Blog posts likhte waqt title size, meta options aur keywords limits ko live check karke scorecard status batata hai.
*   **Dynamic Plugin System (`PluginInjector.tsx` & `plugins.service.ts`)**: Code likhe baghair admin dashboard se direct Google Analytics ya custom dynamic trackers head aur body bottom hooks me inject kiye ja sakte hain.
*   **LocalStorage Quota Shield (`safeSaveLocalStorage`)**: Browser ki local storage limit exceed block hone se bachane ke liye dynamic image compressor engine aur auto cache-cleaner system setup kiya hai.
*   **TikWM Failover system**: Main API block hone par search fallback endpoint par automatic switchover ho jata hai.

---

## 📅 4. Complete Git Commit Timeline (Purani Commits Ki History)

Niche aapki website development ki A to Z commits history list di gayi hai:

| Commit Hash | Commit Message | Main Change Detail (Roman English) |
| :--- | :--- | :--- |
| `5fad0d4` | Initial commit - TTDownloader CMS Monorepo Website | Pure project setup ka skeleton banaya, next web, nest api aur prisma settings load kiye. |
| `2be3dcc` | Fix Vercel build by adding prisma generate | Vercel deployment par dynamic client build error solve karne ke liye postinstall set kiya. |
| `40f7fd7` | Configure Vercel outputDirectory to apps/web/.next | Vercel ko bataya ke output files kis build folder me exist karti hain. |
| `ab6c55e` | Fix Vercel build script alias mapping | Cross-monorepo build scripts mapping ko align aur resolve kiya. |
| `cb7e4ca` | Specify framework: nextjs in vercel.json | Vercel platform par Next.js framework configuration set ki. |
| `96935fe` | Add next to root package.json for monorepo detection | Main root folder me Vercel dependency setup add kiya framework detection ke liye. |
| `24e7240` | Update pnpm-lock.yaml with root next dependency | Workspace dependencies setup file update ki. |
| `2c9db84` | Add static system page layout fallbacks | Next.js server side render routes par error 404 se bachne ke liye templates setup kiye. |
| `ce46534` | Add fallback admin authentication | Database disconnect condition me be-khauf dashboard login authentication banaya. |
| `c67d43a` | Fix admin session persistence to prevent immediate redirect | Login ke turant baad dubara refresh ho kar login screen par phenkne ka bug fix kiya. |
| `825bc82` | Use localStorage session store for stable admin login | Admin logins ko browser session storage se connect karke permanent stable kiya. |
| `2e9c050` | Fix blog post creation with fallback local storage | Backend disconnected hone ki condition me blog data local save karne ke rules banaye. |
| `88730c1` | Fix blog post creation payload formatting | Blog items save karte waqt format formatting issues aur data save fail error fix kiya. |
| `8b8444d` | Fix /admin root route 404 redirect & add direct fallback | Admin URL path redirection set kiya aur website par frontend local direct api connect ki. |
| `7e8d80f` | Fix blog rendering fallback & add Featured Image URL | Single article pages structure correct kiya aur custom thumbnail link add karne ka input diya. |
| `e5cb458` | Upgrade Media Library with real image uploader & picker | Media library upgrade ki aur blog editor ke andar direct target image select uploader button lagaya. |
| `9967cfa` | Fix high-contrast input text color & make blog update instant | Inputs me high contrast and layout coloring problems normal kiye aur update ko fast kiya. |
| `ddbe1c3` | Fix blog post persistence and add image upload feature | Post database settings adjust kiye aur files handle karne ka logic banaya. |
| `fb2d58a` | Auto-save post images to Media Library and add copy URL | Upload hone wale media assets automatically media gallery me insert aur save ho jate hain. |
| `30433e3` | Fix media library sync with backend API | UI media items aur actual database API folder path syncing setup kiya. |
| `4405608` | Fix saving hang issue by setting 50mb body limit | Badi image files upload karte waqt system hangups and timeouts limits ko fix kiya. |
| `33d7a83` | Fix QuotaExceededError via canvas image compression | Image uploading se browser storage bharne ki issue resolve karne ke liye automatic compression laga di. |
| `4dc03c0` | Add 300ms failsafe timer unlock for publish button | Action process stop hone par button freezing protect karne ke liye reset logic add kiya. |
| `471d4ed` | Add Next.js serverless API routes for Vercel | Vercel serverless deployment ke liye serverless API routes ka dhaanchan khara kiya. |
| `e1e7c9b` | Fix blog persistence by adding Next.js serverless API routes | Serverless files system me dynamic post insert, read, aur storage fallbacks set kiye. |
| `459a6b7` | Replace submit button with explicit instant action button | Save methods ko safe banaya taake user loading status screen par freez ya crash na ho. |
| `c19fed9` | Implement safeSaveLocalStorage auto-cleaner | Web storage usage trigger limits active hone par limits cleaner routine program kiya. |
| `25038a4` | Add auto-purge on mount and Reset Cache button | Admin UI controls dashboard screen me memory cache force empty button register kiya. |
| `283781a` | Force override API_BASE on non-localhost domain | Live site par local port 3001 call terminate karke current domain paths replace kiye. |
| `2c796bf` | Fix Vercel 403 RSC errors by updating vercel.json | Vercel production route request permissions blocking (403 Error) problem clear kiya. |
| `8c6c7dd` | Configure Vercel monorepo build output directory | Build logs path verify karke dynamic web build target correctly define kiya. |
| `0444788` | Fix TypeScript build error in api.ts | Next.js API client types validations related errors solve kar diye compile failure door karne ke liye. |
| `9fd19ec` | Fix image URL replacement issue for user uploaded images | Article data update par user upload thumbnail dynamic path patterns clean kiye. |
| `5c8e794` | Fix blog post editing to correctly update post picture | Existed elements overwrite issues logic aur backend parameters binding problem fix kar di. |
| `fddcd23` | Update About Us page layout content | Website ke default 'About Us' page ke layouts ko visual page layout blocks me convert kiya aur update kiya. |
| `46d44f5` | Add Privacy Policy static page template | Naya Privacy Policy dynamic page system default configs me insert aur render kiya. |
| `af21244` | Enable pages CRUD in Page Builder and link to NextJS custom API routes | Admin panel Ke Page Builder me homepage samet website ke saare modules aur tools editable kar diye aur Next.js API routes se connect kiya. |
| `be482c3` | Live Google AdSense & Ads Manager Upgrade with dynamic ads.txt | Ads Manager page ko upgradation de ke full AdSense configurations (Publisher ID, Slot IDs, formatting styles, site verification head tags, dynamic ads.txt, details verification warning display, aur serverless backup-restore mapping) add kiya. |
| `8d10ef4` | Fix /contact-us 404 indexing issue, add dynamic sitemap & robots | Contact Us public page create ki (`/contact-us`), full SEO metadata & canonical tags add kiye, `/contact` ko `/contact-us` par 301 redirect kiya, CMS slug aliasing handle ki, dynamic `sitemap.xml` aur `robots.txt` generate kiye, aur navbar/footer links update kiye. |
| `a4921de` | Upgrade About Us page with rich tools grid, 3-step guide & FAQs | About Us page ko significantly upgrade kiya with custom cards grid, 3-step visual guide, 8-item FAQ accordion, CTA buttons, responsible-use & copyright notices, full SEO metadata, aur CMS Page Builder compatibility. |
| `52f6c91` | Apply cohesive glowing brand banner to Video, Audio, Bulk & APK pages | Sabhi downloader pages (Home, Video, Audio, Bulk, APK) se plain yellow/blue/green/pink colors hata kar modern glowing brand banner background aur matching badges apply kiye. |
| `c2518e9` | Safe rebrand from TTDownloader to TikSavePro | Poori website aur admin panel ko TTDownloader se TikSavePro par safely rebrand kiya (Navbar, Footer, Layout, Pages, Settings, Admin, CMS, DB records) jabke domain, URL routes, slugs, canonical tags aur SEO search keywords 100% intact rakhe. |
| `8e09f2b` | Fix blog images cropping with full uncropped display and ambient blur | Blog index grid aur individual blog post headers par image cropping khatam kar ke full uncropped `object-contain` display aur sleek ambient blurred background apply kiya taake har image aur screenshot poori show ho. |
| `f3918a0` | Upgrade Blog Post Editor with Rich Text, H1-H3, Links, & ChatGPT Paste Support | Blog Post Editor me WYSIWYG Rich Text Toolbar (H1/H2/H3, Bold, Italic, Underline, Link modal, Lists, Quotes, Code block, Source mode) add kiya, ChatGPT rich copy-paste formatting ko preserve kiya, aur frontend blog renderer me semantic sanitized HTML display aur separate SEO metadata controls integrate kiye. |
| `a7f9201` | Migrate About page slug to /about-us with permanent 301 redirect | About Us page ka public slug `about` se badal kar `about-us` kiya (HTTP 200), `/about` par server-side permanent 301 redirect setup kiya, canonical URL `https://tik-tokdownloader.xyz/about-us` set ki, sitemap aur header/footer links update kiye aur SQLite DB me slug & redirect safely update kiya. |
| `b92d710` | Build Admin-Controlled Dynamic Redirect Manager (301/302/307/308) with loop protection & middleware | Complete Redirect Manager system build kiya: Admin Panel UI (`/admin/redirects` aur Settings Tab), Next.js dynamic routing middleware, NestJS REST controller & service, Prisma schema update, backup/export/import integration, aur real-time redirect loop/chain detection. |
| `d81e72a` | Build Admin-Controlled Navbar/Header and Footer Customizer with Live Preview | Admin Settings me "Navbar & Header" aur "Footer Customizer" tabs add kiye jahan se Logo, navigation menu links, quick CMS page selector, CTA button, announcement banner, multi-column footer links, social profiles, aur dynamic auto-year copyright text directly customize kiye ja sakte hain. |
| `a94e82b` | Fix Blog Formatting Rendering — H1-H4 Headings, Anchor Text, Lists, Blockquotes, and Complete Typography Pipeline | Global CSS me standalone semantic typography system (.blog-content-body aur .rich-editor-content) add kiya jisse H2/H3 headings, visible anchor text links, ordered/unordered lists, blockquotes aur code blocks beautifully render hote hain; BlogContentRenderer aur RichTextEditor me multi-pass Markdown/HTML normalizer integrate kiya jo ChatGPT se pasted content, embedded tokens aur single H1 page hierarchy ko preserve karta hai. |
| `3f9821c` | Create Professional, SEO-Friendly, and CMS-Editable Privacy Policy Page | Professional Privacy Policy page create kiya (`https://tik-tokdownloader.xyz/privacy-policy` with HTTP 200), Prisma SQLite database me Page record seed kiya (Page Builder editable), full Google AdSense & Publisher disclosure, cookies, downloader media handling, contact form data disclosures add kiye, legacy `/privacy` se 301 redirect setup kiya, sitemap & footer links update kiye. |
| `81c0e3a` | Create Professional, SEO-Friendly, and CMS-Editable Terms of Service Page | Professional Terms of Service page create kiya (`https://tik-tokdownloader.xyz/terms-of-service` with HTTP 200), Prisma SQLite database me Page record seed kiya (Page Builder editable), independent third-party status without TikTok affiliation, copyright, watermark removal notice, prohibited uses, disclaimers, legacy `/terms` se 301 redirect setup kiya, sitemap & footer links update kiye. |
| `9c148e2` | Create Professional, SEO-Friendly, and CMS-Editable DMCA & Disclaimer Page | Professional DMCA & Disclaimer page create kiya (`https://tik-tokdownloader.xyz/dmca-disclaimer` with HTTP 200), Prisma SQLite database me Page record seed kiya (Page Builder editable), DMCA takedown checklist, contact form integration ("Copyright / DMCA Notice" subject), independent third-party clarification without TikTok affiliation, legacy `/dmca` se 301 redirect setup kiya, sitemap & footer links update kiye. |
| `54d917a` | Upgrade Android APK Page with Educational Content, Feature Cards, Web Alternative, and Coming Soon Status | Android APK page (`/apk`) ko upgrade kiya: Hero title "Coming Soon: TikSavePro Android App" set kiya, Introduction section, 6 Planned Feature cards, Mobile Experience section, Web Alternative CTAs (`/video`), Tool cards, Security & safe download guidelines, enhanced "App Coming Soon" visual status card, aur 6 comprehensive FAQs add kiye (poora layout Page Builder editable aur DB-synced). |

---

## 🚀 5. Future Development Guidelines (Aage Ke Recommendations)

1.  **Production Database Setup**: local SQLite space badal kar dynamic PostgreSQL use kar sakte hain (`docker-compose.yml` check karein).
2.  **Plugin System Scaleup**: `headCode` and `footerCode` hook triggers me safety controls implement kar ke dynamic tracking verify kar sakte hain.
3.  **Ad Placement Controls**: `AdSlot.tsx` website components header footer layout blocks configurations ko change karke live key setup badla ja sakta hai.

