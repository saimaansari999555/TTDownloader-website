PHASE 1 – PART C
MASTER PROMPT (Complete CMS + Blog System + Media Library + Admin Content Management)
Continue the project from Phase 1 – Part A and Phase 1 – Part B.
Do not recreate the project.
Build a complete production-ready CMS (Content Management System) similar to the flexibility of WordPress, but using the existing project architecture.
The CMS must be modular, secure, scalable, responsive, SEO-friendly, and future-ready.
Every feature must be manageable through the Admin Panel without editing code.
CMS OBJECTIVE
The administrator should be able to manage almost the entire website from the Admin Panel.
No technical knowledge should be required.
The CMS must allow future expansion without breaking existing functionality.
CMS DASHBOARD
Create a professional dashboard showing:
Total Blog Posts
Published Posts
Draft Posts
Scheduled Posts
Total Pages
Categories
Tags
Total Media Files
Recent Uploads
Latest Comments (future-ready)
Recent Activities
System Notifications
Storage Usage
Database Status
Website Health
Quick Action Buttons
BLOG MANAGEMENT
Create a complete blog system.
Administrator should be able to:
Create Blog
Edit Blog
Delete Blog
Restore Deleted Blog
Duplicate Blog
Preview Blog
Schedule Blog
Publish Blog
Unpublish Blog
Save Draft
Archive Blog
Pin Blog
Feature Blog
BLOG EDITOR
Create a modern Rich Text Editor.
Support:
Headings H1-H6
Paragraphs
Bold
Italic
Underline
Lists
Tables
Quotes
Code Blocks
Links
Internal Links
External Links
Buttons
Images
Image Alignment
Videos
Embeds
Callout Boxes
Horizontal Divider
Undo
Redo
Word Counter
Character Counter
Reading Time
Auto Save
Revision History
Full Screen Mode
BLOG SEO
Every post should support:
SEO Title
Meta Description
Focus Keyword
Slug
Canonical URL
Schema Type
Open Graph Image
Open Graph Title
Open Graph Description
Twitter Card
Index / No Index
Follow / No Follow
Robots Settings
FEATURED IMAGE
Each blog must support:
Featured Image
Alt Text
Image Caption
Image Description
Image Compression
Automatic Optimization
Image Cropping
Responsive Images
BLOG CATEGORIES
Create dynamic categories.
Support:
Unlimited Categories
Nested Categories
Category Description
Category Image
Category SEO
Slug
Status
Sorting
TAG SYSTEM
Dynamic Tags
Unlimited Tags
SEO Support
Tag Description
Slug
Usage Count
BLOG FILTERS
Search
Category Filter
Status Filter
Author Filter
Date Filter
Keyword Filter
BLOG TABLE
Show:
Thumbnail
Title
Author
Category
Status
Views
SEO Score Placeholder
Created Date
Updated Date
Actions
BULK ACTIONS
Select Multiple
Delete
Publish
Draft
Archive
Move Category
Export
Restore
PAGE MANAGEMENT
Create a complete page builder.
Support:
Home
About
Privacy Policy
Terms
DMCA
Disclaimer
Contact
Custom Pages
Landing Pages
Each page should support the same editor as blog posts.
MENU MANAGEMENT
Administrator should create menus without coding.
Support:
Header Menu
Footer Menu
Sidebar Menu
Dropdown Menu
Nested Menu
Custom Links
External Links
Icons
Sorting
Drag and Drop
MEDIA LIBRARY
Create a professional media manager.
Support:
Images
Videos
Documents
Icons
SVG
WebP
PNG
JPG
JPEG
GIF
MEDIA FEATURES
Upload
Delete
Rename
Preview
Search
Filter
Copy URL
Download
Replace
Folder Support
Multiple Upload
Drag & Drop Upload
IMAGE OPTIMIZATION
Automatically:
Compress Images
Generate WebP
Lazy Loading
Responsive Sizes
Alt Text Reminder
FILE MANAGER
Allow administrator to manage uploaded files.
Display:
Name
Type
Size
Upload Date
Used In
Unused Files
Search
SEARCH SYSTEM
Global Admin Search
Search:
Posts
Pages
Categories
Tags
Media
Users
Settings
CONTENT STATUS
Support:
Draft
Published
Scheduled
Archived
Deleted
Pending Review
AUTO SAVE
Automatically save content every few seconds.
Recover unsaved content after accidental refresh.
REVISION HISTORY
Store multiple revisions.
Administrator should:
View Old Version
Compare Versions
Restore Version
Delete Version
URL MANAGEMENT
Generate clean URLs.
Allow custom slug editing.
Automatically prevent duplicate URLs.
Redirect old URL when slug changes.
INTERNAL LINKING
Administrator can easily link:
Blog → Blog
Blog → Page
Page → Blog
Page → Page
No manual coding required.
EXTERNAL LINKS
Support:
Open New Tab
NoFollow
Sponsored
UGC
Custom Attributes
COMMENTS
Design architecture for future comments module.
Do not implement fully.
Prepare database and APIs.
CONTACT FORM STORAGE
Store all contact form submissions inside Admin Panel.
Support:
Search
Filter
Delete
Export
Reply Status
USER CONTENT PERMISSIONS
Administrator controls:
Who can publish
Who can edit
Who can delete
Who can upload
Who can schedule
Who can manage media
ACTIVITY LOG
Record:
Login
Logout
Post Created
Post Edited
Post Deleted
Media Uploaded
Settings Changed
SEO Changed
User Created
Permission Changed
IP Address
Timestamp
NOTIFICATION SYSTEM
Dashboard notifications.
Examples:
Backup Reminder
Storage Almost Full
New Contact Message
New User
Security Warning
System Update
RESPONSIVE ADMIN PANEL
Perfect layout for:
Desktop
Tablet
Mobile
ACCESSIBILITY
Keyboard Navigation
ARIA Labels
Focus Indicators
Semantic HTML
PERFORMANCE
Pagination
Lazy Loading
Virtual Lists
Image Optimization
Efficient Queries
Caching Support
API DESIGN
Create REST APIs for:
Posts
Pages
Categories
Tags
Media
Menus
Search
Settings
Dashboard
Activity Logs
Notifications
Use proper validation and error responses.
SECURITY
Validate every request.
Sanitize HTML.
Prevent malicious uploads.
Restrict executable files.
Limit upload size.
Secure file names.
Role-based permissions on every endpoint.
TESTING
Prepare architecture for:
Unit Tests
Integration Tests
API Tests
End-to-End Tests
FUTURE READY
Design the CMS so Phase 2 can add:
Plugin Marketplace
Theme Marketplace
Multi-language Content
AI Content Writer
AI SEO Assistant
Newsletter System
Advertisement Manager
Download Statistics
Membership System
Custom Widgets
Shortcodes
Page Builder Blocks
without changing the existing architecture.
FINAL DEVELOPMENT ORDER
Before writing code:
Design database relationships.
Design CMS architecture.
Build reusable editor components.
Implement media library.
Implement blog management.
Implement page management.
Implement menus.
Implement search.
Optimize performance.
Test every CMS module before proceeding.
ADDITIONAL PROFESSIONAL REQUIREMENTS (Very Important)
Build the CMS like a modern headless CMS, not a simple CRUD application.
The code should follow SOLID principles, Clean Architecture, and Domain-Driven Design (DDD) where appropriate.
Every module must expose clean APIs so that in the future a mobile app, desktop app, or third-party integrations can consume the same backend without requiring major changes.
The CMS should be designed with long-term maintainability and scalability in mind, ensuring new features can be added through modules rather than by modifying core code.