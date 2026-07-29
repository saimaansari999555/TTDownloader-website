

PHASE 2 – PART B

MASTER PROMPT (Multi-Language System + Translation Engine + Localization)

> Continue the project from Phase 1 (Parts A–D) and Phase 2 – Part A.

Do not recreate the project.

Build a complete enterprise-grade Multi-language & Localization System.

The entire website (frontend, admin panel, blogs, pages, menus, SEO metadata, forms, and future plugins) must be translatable.

The system must be scalable, plugin-ready, and optimized for SEO.




---

PRIMARY OBJECTIVE

Transform the CMS into a multilingual platform.

The administrator should be able to manage all languages without editing code.

Future plugins and themes should automatically support translations.


---

LANGUAGE MANAGEMENT

Create a Language Manager.

Administrator should be able to:

Add Language

Edit Language

Delete Language

Enable Language

Disable Language

Set Default Language

Change Display Order

Import Language

Export Language



---

LANGUAGE INFORMATION

Each language should include:

Language Name

Native Name

ISO Code

Country

Flag

Locale

Text Direction (LTR / RTL)

Status

Default Language



---

LANGUAGE SWITCHER

Create a professional language switcher.

Support:

Header

Footer

Mobile Menu


Display:

Language Name

Flag

Native Name


Remember the user's selected language.


---

URL STRUCTURE

Support multiple URL formats.

Examples:

example.com/en/
example.com/ur/
example.com/ar/

The architecture should also support subdomains or separate domains in the future without major changes.


---

TRANSLATION ENGINE

Translate:

Navigation

Buttons

Labels

Forms

Messages

Errors

Notifications

Footer

Header

Sidebar

Dashboard

Widgets


No hardcoded text.


---

CONTENT TRANSLATION

Administrator should translate:

Blog Posts

Pages

Categories

Tags

Menus

Widgets

SEO Metadata


Each language should have independent content.


---

BLOG TRANSLATIONS

Support:

Original Blog

↓

Translated Version

↓

Translated SEO

↓

Translated URL

↓

Translated Images (optional)

Each translation should be linked to the original article.


---

PAGE TRANSLATIONS

Translate:

Home

About

Contact

Privacy

Terms

DMCA

Disclaimer

Custom Pages



---

MENU TRANSLATIONS

Each language should have independent menus.

Example:

English Menu

Urdu Menu

Arabic Menu

French Menu


---

SEO TRANSLATION

Each language should support:

Meta Title

Meta Description

Keywords

Slug

Canonical

Open Graph

Twitter Card

Schema

Sitemap Entry


---

IMAGE LOCALIZATION

Support:

Translated Alt Text

Translated Caption

Translated Description

Different Image per Language (optional)


---

RTL SUPPORT

Support Right-to-Left languages.

Examples:

Arabic

Urdu

Persian

Requirements:

RTL Layout

RTL Navigation

RTL Forms

RTL Typography

RTL Tables

RTL Sidebar


---

FONT MANAGEMENT

Allow assigning different fonts for each language.

Example:

English → Inter

Urdu → Noto Nastaliq / Noto Sans

Arabic → Noto Kufi / Noto Sans Arabic

Never hardcode fonts.


---

DATE & TIME

Localize:

Date Format

Time Format

Numbers

Currency Format (future ready)

Timezone


---

SEARCH

Search should respect the active language.

Search results should not mix languages.


---

BREADCRUMBS

Generate breadcrumbs in the active language.


---

SITEMAP

Generate separate XML sitemaps for every language.


---

ROBOTS

Support multilingual robots configuration.


---

CANONICAL

Automatically generate proper canonical URLs for translated pages.


---

HREFLANG

Automatically generate hreflang tags.

Example:

English

Urdu

Arabic

French

Default Language


---

TRANSLATION EDITOR

Create a professional Translation Editor.

Support:

Search

Filter

Missing Translation Indicator

Auto Save

Revision History

Export

Import

Translation Status


---

TRANSLATION STATUS

Each translation should have:

Draft

In Progress

Translated

Needs Review

Published


---

IMPORT / EXPORT

Support:

JSON

CSV

Future XLIFF support


---

FALLBACK SYSTEM

If a translation is missing:

Display default language gracefully.

Never show broken content.


---

AUTO TRANSLATION ARCHITECTURE

Prepare the architecture for future AI translation providers.

Do not integrate any provider yet.

The system should later support:

AI Translation Service A

AI Translation Service B

Manual Translation


without changing the CMS core.


---

PERMISSIONS

Administrator controls:

Who can translate

Who can publish translations

Who can review translations

Who can edit language settings


---

LANGUAGE-SPECIFIC SETTINGS

Each language may have:

Logo (optional)

Favicon (optional)

SEO Defaults

Contact Information

Social Links

Footer Text

Menus

Widgets


---

API

Create multilingual APIs.

Every endpoint should support:

Language Detection

Language Switching

Fallback

Validation

Error Handling


---

DATABASE

Design translation tables with proper relationships.

Avoid duplicate content.

Support efficient querying.


---

PERFORMANCE

Cache translation files.

Optimize database queries.

Load only active language resources.

Minimize bundle size.


---

ACCESSIBILITY

Maintain accessibility across all languages.

Support screen readers.

Support RTL correctly.


---

TESTING

Prepare tests for:

Language Switching

RTL

SEO

Fallback

Search

Translated URLs

Forms

Menus


---

SECURITY

Validate translation inputs.

Prevent XSS.

Sanitize HTML.

Protect import/export functionality.


---

FUTURE READY

Prepare for:

AI Translation Plugins

Regional Content

Geo-based Language Detection

Browser Language Detection

Language Analytics

Automatic Translation Suggestions


without changing the architecture.


---

FINAL DEVELOPMENT ORDER

1. Build Language Manager.


2. Implement Translation Engine.


3. Build Translation Editor.


4. Add RTL Support.


5. Implement Multilingual SEO.


6. Generate Language-specific Sitemaps.


7. Add hreflang & Canonical support.


8. Optimize Performance.


9. Test all language workflows.


10. Deliver a production-ready multilingual architecture.




---

⭐ Enterprise Requirements

The multilingual system must work seamlessly with plugins, themes, widgets, menus, SEO, and future modules.

Every new plugin developed in the future should automatically be capable of exposing translatable strings through the same translation engine.

Keep the system headless-ready, API-first, and SEO-friendly.

Ensure the architecture can scale from 2 languages to 100+ languages without requiring a redesign.

