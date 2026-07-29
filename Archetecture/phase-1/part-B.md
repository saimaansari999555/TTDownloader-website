PHASE 1 – PART B

MASTER PROMPT (Landing Page + Downloader Module + User Experience)
Continue the project from Phase 1 – Part A.
Do not recreate the project from scratch.
Build the complete Landing Page and Downloader Module using the architecture already defined.
Every component must be production-ready, responsive, optimized, accessible, SEO-friendly, secure, and fully reusable.
Never use placeholder UI where a real implementation can be created.
PRIMARY GOAL
Build a premium-quality TikTok Downloader landing page with an exceptional user experience.
The landing page should immediately communicate what the website does and make downloading as simple as possible.
The primary call-to-action must be downloading a TikTok video.
UI STYLE
Create a clean and modern interface.
Requirements:
Premium appearance
Soft glassmorphism where appropriate
Rounded corners
Soft shadows
Smooth gradients
Professional spacing
Minimal design
Excellent typography
Fully responsive
Fast loading
Smooth animations
Accessible colors
WCAG-compliant contrast
ANIMATIONS
Use Framer Motion.
Animations should include:
Fade In
Slide Up
Scale
Hover Effects
Button Ripple
Smooth Loading
Card Hover
Scroll Reveal
Section Transition
Animations should improve UX but never reduce performance.
NAVIGATION BAR
Navbar should remain sticky.
Include:
Website Logo
Website Name
Home
Blog
FAQ
About
Contact
Language Switcher (placeholder for future)
Dark Mode Toggle (placeholder)
Mobile Menu
Navbar changes style while scrolling.
HERO SECTION
Hero section must immediately capture attention.
Include:
Large Heading
Professional Description
Download Input Area
Paste Button
Clear Button
Download Button
Animated Background
Trust Badge
Fast Download Badge
Secure Badge
No Signup Required Badge
Responsive Layout
DOWNLOAD CARD
Create a premium downloader card.
Components:
TikTok URL Input
Paste Button
Clear Button
Download Button
Loading Spinner
Progress Bar
Validation Message
Error Message
Success Message
Retry Button
Copy URL Button
URL VALIDATION
Validate the URL before sending the request.
Accept only valid TikTok URLs.
Reject:
Empty Input
Invalid URL
Unsupported Domain
Broken URL Format
Display user-friendly error messages.
DOWNLOAD FLOW
The workflow should be:
User Pastes URL
↓
Validation
↓
API Request
↓
Loading State
↓
Video Information
↓
Thumbnail
↓
Title
↓
Duration
↓
Available Formats
↓
Download Button
↓
Download Starts
VIDEO PREVIEW CARD
After successful processing display:
Thumbnail
Video Title
Creator Name (if available)
Duration
Resolution
Video Size (if available)
Download Options
Beautiful Preview Card
Responsive Layout
DOWNLOAD OPTIONS
Design the UI for future expansion.
Show quality options such as:
Low
Medium
High
HD
If a particular quality is unavailable, disable it gracefully.
The architecture should support adding additional formats later.
DOWNLOAD BUTTONS
Every download button should display:
Quality
Estimated Size (if available)
Format
Download Icon
Hover Animation
Loading State
Disabled State
COPY LINK FEATURE
Add a button to copy the entered URL.
Display toast notification after copying.
PASTE FEATURE
Allow one-click paste from clipboard.
If clipboard permission is denied, show an appropriate message.
LOADING EXPERIENCE
During processing:
Disable Download Button
Show Skeleton UI
Show Spinner
Show Progress Animation
Prevent duplicate requests
ERROR HANDLING
Display clear messages for:
Invalid Link
Private Video
Deleted Video
Network Error
Server Error
Timeout
Unsupported Link
Temporary Failure
Rate Limited
Never expose technical errors.
SUCCESS EXPERIENCE
After successful processing:
Show success animation
Display preview
Display download options
Allow downloading again
Allow clearing input
DOWNLOAD HISTORY (CLIENT SIDE)
Temporarily maintain recent downloads in the browser.
Display:
Thumbnail
Title
Date
Download Again
Clear History
This feature should be modular so server-side history can be added later.
FEATURES SECTION
Create attractive feature cards.
Examples:
Fast Download
Secure Download
No Login Required
Responsive
High Speed
Modern Technology
Easy Interface
SEO Friendly
Each card should have:
Icon
Title
Description
Hover Animation
HOW IT WORKS
Create a 3-step section.
Step 1
Copy TikTok Link
↓
Step 2
Paste Link
↓
Step 3
Download Video
Illustrate each step with icons.
BENEFITS SECTION
Explain advantages.
Examples:
No Watermark (subject to supported implementation and applicable policies)
Fast Processing
Easy UI
Mobile Friendly
Unlimited Downloads (if applicable)
No Registration
FAQ SECTION
Create collapsible FAQ.
Questions like:
How do I download?
Is registration required?
Which devices are supported?
Can I download HD videos?
Is the service free?
Can I download audio?
Can I use mobile?
Can I download private videos?
BLOG PREVIEW
Show latest blog posts.
Display:
Featured Image
Title
Short Description
Read More
Date
Category
CTA SECTION
Encourage users to download.
Large Button
Professional Heading
Small Description
FOOTER
Include:
Logo
Short Description
Quick Links
Legal Pages
Privacy Policy
Terms
DMCA
Contact
Social Icons
Copyright
MOBILE EXPERIENCE
The website should look perfect on:
320px
375px
425px
768px
1024px
1440px
1920px
No horizontal scrolling.
ACCESSIBILITY
Keyboard Navigation
Focus States
ARIA Labels
Proper Semantic HTML
Screen Reader Friendly
PERFORMANCE
Use:
Image Optimization
Lazy Loading
Memoization
Server Components where possible
Dynamic Imports
Code Splitting
Minimal Bundle Size
SEO
Landing page must include:
Meta Title
Meta Description
Canonical URL
Open Graph
Twitter Card
Structured Data
FAQ Schema
Breadcrumb Schema (future ready)
SECURITY
Never trust user input.
Sanitize all requests.
Prevent XSS.
Validate URLs.
Prevent spam requests.
Add request throttling support.
CODE QUALITY
Every component must be:
Reusable
Typed
Modular
Easy to maintain
Easy to test
Properly documented
TESTING
Create architecture for:
Component Testing
API Testing
Integration Testing
End-to-End Testing
FINAL DEVELOPMENT ORDER
Before coding:
Design UI components.
Design downloader workflow.
Build reusable components.
Connect frontend to backend APIs.
Test responsiveness.
Test validation.
Optimize performance.
Optimize accessibility.
Optimize SEO.
Deliver production-ready code.
IMPORTANT REQUIREMENTS
Never use fake APIs or mock downloader logic if a real implementation is possible.
Keep the downloader service modular so that future support for additional platforms (such as Instagram, Facebook, YouTube Shorts, or others where legally and technically appropriate) can be added without rewriting the project architecture.
Ensure the codebase follows clean architecture and SOLID principles throughout.
Produce code that is maintainable, scalable, and ready for future Phase 2 development.