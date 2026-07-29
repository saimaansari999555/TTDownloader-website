
---

PHASE 1 – PART A

MASTER PROMPT (Foundation & Project Setup)

> ROLE

Act as a Senior Full Stack Software Engineer, System Architect, UI/UX Designer, Cyber Security Expert, Database Architect, SEO Expert, DevOps Engineer, and Performance Engineer.

Build a complete, production-ready, scalable, secure, modular, and maintainable CMS-based TikTok Downloader website from scratch.

Do not create a demo, prototype, or simplified version. Build the project exactly as if it will be launched publicly and expected to handle thousands of users.

Every feature must be built using industry best practices with clean, reusable, modular code.

Write production-quality code only.




---

PROJECT GOAL

Create a modern CMS-based TikTok Downloader website where users can paste a TikTok video URL and download the content through a clean, fast, and attractive interface.

The project must include:

Modern Landing Page

CMS

Admin Panel

Blog System

SEO System

Media Library

Theme Customization

Authentication

Settings Management


The architecture must be designed so future modules can be added without changing the existing system.


---

TECHNOLOGY STACK

Use the following technologies:

Frontend

Next.js (Latest Stable Version)

TypeScript

Tailwind CSS

Framer Motion

React Hook Form

Zod Validation


Backend

NestJS

TypeScript


Database

PostgreSQL


Caching

Redis


ORM

Prisma


Authentication

JWT

Refresh Tokens

HttpOnly Cookies


Image Optimization

Next Image


Package Manager

pnpm


API

REST API


Version Control

Git


Deployment Ready

Docker Support



---

PROJECT STRUCTURE

Design the project using a clean architecture.

Separate everything into modules.

Example:

Frontend

Landing

Downloader

Blog

Authentication

Dashboard

SEO Pages

Settings


Backend

Authentication Module

User Module

Admin Module

Downloader Module

Blog Module

Media Module

SEO Module

Settings Module

Analytics Module

Logs Module


Every module should be independent.


---

DATABASE DESIGN

Design a scalable PostgreSQL database.

Create separate tables for:

Users

Roles

Permissions

Blog Posts

Categories

Tags

Media Library

SEO Settings

Website Settings

Languages

Menus

Pages

Downloads History

Activity Logs

System Logs

Sessions

Notifications

Contact Messages

Site Analytics

Each table should include:

Primary Key

UUID

Created Date

Updated Date

Soft Delete Support

Status


Design proper relationships.

Never duplicate data.


---

USER ROLES

Create Role Based Access Control.

Roles:

Super Admin

Admin

Editor

Author

Moderator

Future Customer Role

Permissions should be completely dynamic.

Never hardcode permissions.


---

ADMIN PANEL

Create a modern dashboard.

Dashboard should include

Website Overview

Downloads Today

Total Downloads

Today's Visitors

Weekly Visitors

Monthly Visitors

Recent Blog Posts

Recent Activities

Quick Actions

Storage Usage

Database Status

System Health

Latest Notifications


---

ADMIN SIDEBAR

Dashboard

Downloader

Blog

Categories

Tags

Media Library

Pages

SEO

Menus

Appearance

Users

Roles

Permissions

Analytics

Logs

Settings

Profile

Logout

Everything should be modular.


---

LOGIN SYSTEM

Admin login page.

Features:

Email Login

Username Login

Password

Remember Me

Forgot Password

Password Reset

Refresh Token

Secure Sessions

Session Expiration

Login History

Device Detection

Multiple Device Management

Logout From All Devices


---

SECURITY

Never store passwords in plain text.

Use password hashing.

Protect against:

SQL Injection

XSS

CSRF

Brute Force

Session Hijacking

Clickjacking

Rate Limiting

Validate every request.

Sanitize every input.


---

UI DESIGN

The website should have a premium feel.

Requirements:

Modern

Minimal

Fast

Professional

Responsive

Animated

Mobile Friendly

Tablet Friendly

Desktop Friendly

No clutter.

Proper spacing.

Rounded Cards

Soft Shadows

Smooth Hover Effects

Smooth Page Transitions

Professional Typography


---

COLOR SYSTEM

Default Theme

White

Blue

Dark Gray

Admin should later be able to customize colors.

Design using CSS variables.

Never hardcode colors.


---

LANDING PAGE

Landing page should contain

Navigation Bar

Hero Section

TikTok Downloader

Features

How It Works

Benefits

Statistics

FAQ

Latest Blogs

Testimonials Placeholder

Call To Action

Footer

Everything should be responsive.


---

HERO SECTION

Create an attractive hero section.

Include

Headline

Description

Large Download Box

Paste URL Field

Download Button

Loading Animation

Trust Indicators

Responsive Layout


---

DOWNLOAD SECTION

Input Box

Paste Button

Clear Button

Download Button

Loading Animation

Error Messages

Success Messages

Validation

URL Validation

Progress Indicator

Future-ready Quality Selector


---

PERFORMANCE

Target:

Lighthouse Score above 95

Fast Loading

Lazy Loading

Image Optimization

Code Splitting

Dynamic Imports

Server Components where appropriate

Caching Strategy

Minimal JavaScript Bundle


---

CODING STANDARDS

Use:

Clean Code

Reusable Components

Reusable Hooks

Reusable Services

Proper Folder Structure

Proper Naming Convention

ESLint

Prettier

TypeScript Strict Mode

Never duplicate logic.


---

COMMENTS

Comment only where necessary.

Avoid unnecessary comments.

Write self-explanatory code.


---

ERROR HANDLING

Every API should return:

Success Response

Validation Errors

Authentication Errors

Authorization Errors

404

500

Meaningful Error Messages


---

FUTURE SCALABILITY

The architecture must be prepared for future implementation of:

Plugin System

Multi-language

Theme Builder

Advertisement Manager

MP3 Downloader

Bulk Downloader

AI Features

Payment System

Membership System

REST API Expansion

Mobile Application


Do not implement these features now. Only design the architecture so they can be added later without major changes.


---

FINAL INSTRUCTIONS

Before writing any code:

1. Analyze the complete project.


2. Design the architecture.


3. Design the database.


4. Design the API structure.


5. Design the folder structure.


6. Explain the implementation plan.


7. Then begin development module by module.


8. Never skip planning.


9. Never generate placeholder logic where real implementation is possible.


10. Keep the code production-ready, secure, optimized, and easy to maintain.





