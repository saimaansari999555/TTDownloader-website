

PHASE 2 – PART A

MASTER PROMPT (Plugin System + Module Architecture + Theme Engine)

> Continue the project from Phase 1 (Parts A, B, C, and D).

Do not recreate or rewrite the existing project.

Build a complete, production-ready Plugin & Module System inspired by the flexibility of WordPress, but using modern software engineering principles.

The plugin system must be secure, modular, scalable, versioned, and future-proof.

Every plugin must integrate with the existing CMS without modifying the core application.




---

PRIMARY OBJECTIVE

Transform the existing CMS into a plugin-driven platform.

The core system should remain lightweight.

All future features should be installable as plugins whenever possible.

The CMS must be capable of running with or without optional plugins.


---

PLUGIN ARCHITECTURE

Design a complete plugin framework.

Requirements:

Plugin Discovery

Plugin Installation

Plugin Activation

Plugin Deactivation

Plugin Update

Plugin Uninstall

Plugin Dependencies

Plugin Versioning

Plugin Validation

Plugin Health Check


The system should automatically detect newly installed plugins.


---

PLUGIN MANAGER

Create a Plugin Manager inside the Admin Panel.

Administrator should be able to:

Browse Installed Plugins

Search Plugins

Activate

Deactivate

Delete

Update

View Version

View Author

View Documentation

Enable

Disable

Restart Plugin


---

PLUGIN INFORMATION

Each plugin should contain:

Plugin Name

Unique ID

Version

Author

Description

Website

License

Minimum CMS Version

Maximum CMS Version

Dependencies

Status

Installation Date

Last Updated


---

MODULE LOADER

Create a dynamic module loader.

Modules should load automatically.

Disabled plugins must never consume resources.

Load only active modules.

Support lazy loading where appropriate.


---

PLUGIN LIFECYCLE

Every plugin should support:

Install

Activate

Boot

Run

Update

Deactivate

Uninstall

Cleanup


---

PLUGIN SANDBOX

Plugins should run independently.

A broken plugin must never crash the CMS.

Handle plugin exceptions gracefully.

Log plugin errors.

Allow disabling faulty plugins.


---

DATABASE SUPPORT

Allow plugins to:

Create Tables

Update Tables

Rollback Migrations

Store Settings

Store Logs

Store Cache


---

PLUGIN PERMISSIONS

Plugins must request permissions.

Examples:

Access Media

Access Blog

Access Downloader

Access SEO

Access Settings

Access Users

Access Analytics

Administrator must approve sensitive permissions.


---

PLUGIN SETTINGS

Each plugin should have its own settings page.

Support:

General Settings

Advanced Settings

Reset Settings

Export Settings

Import Settings


---

PLUGIN STORAGE

Each plugin should have isolated storage.

Never mix plugin data with core data unnecessarily.


---

EVENT SYSTEM

Create an event-driven architecture.

Examples:

On User Login

On User Logout

On Blog Publish

On Blog Update

On Media Upload

On Download Start

On Download Complete

On Backup Complete

On Theme Change

Plugins should subscribe to these events.


---

HOOK SYSTEM

Create a hook/filter system similar to WordPress.

Support:

Before Render

After Render

Before Save

After Save

Before Delete

After Delete

Before Download

After Download

Plugins should extend functionality without modifying core code.


---

SERVICE CONTAINER

Use dependency injection.

Plugins should register their services cleanly.

Avoid global state.


---

ROUTE REGISTRATION

Plugins should register:

API Routes

Admin Routes

Frontend Routes

CLI Commands (future ready)


---

MENU REGISTRATION

Plugins should add:

Admin Menu

Submenus

Settings Pages

Dashboard Widgets

Context Menus

without editing the CMS core.


---

WIDGET SYSTEM

Create reusable widget architecture.

Examples:

Recent Posts

Downloads

Statistics

Weather (future)

Ads

Custom HTML

Each widget should be draggable in future.


---

SHORTCODE SYSTEM

Support custom shortcodes.

Example architecture only.

Prepare parser and registration mechanism.


---

CUSTOM BLOCKS

Prepare architecture for reusable content blocks.

Future plugins should register custom editor blocks.


---

THEME ENGINE

Create a professional Theme Engine.

Themes must be independent from the CMS core.


---

THEME MANAGER

Administrator can:

Install Theme

Activate Theme

Deactivate Theme

Delete Theme

Preview Theme

Update Theme


---

THEME CUSTOMIZATION

Each theme should support:

Colors

Typography

Spacing

Buttons

Cards

Animations

Header Styles

Footer Styles

Sidebar Layout

Container Width

Dark Mode


---

CHILD THEMES

Prepare architecture for child themes.

Never overwrite parent themes during updates.


---

TEMPLATE ENGINE

Themes should override:

Header

Footer

Homepage

Blog

Category

Tag

404

Search

Downloader Page

Contact


---

MENU POSITIONS

Allow themes to define:

Primary Menu

Footer Menu

Sidebar Menu

Top Menu

Social Menu


---

SIDEBAR SYSTEM

Create dynamic sidebars.

Allow plugins and themes to register new sidebars.


---

COMPONENT LIBRARY

Build reusable UI components.

Buttons

Cards

Inputs

Dialogs

Modals

Tables

Dropdowns

Tabs

Accordions

Toasts

Skeleton Loaders

Everything reusable.


---

FILE STRUCTURE

Separate:

Core

Modules

Plugins

Themes

Shared Components

Utilities

Assets

Configurations


---

VERSION MANAGEMENT

Support:

Plugin Version

Theme Version

CMS Version

Compatibility Checking

Migration Support


---

UPDATE SYSTEM

Prepare architecture for future updates.

Support:

Check Updates

Download Update

Backup Before Update

Rollback

Migration


---

PERFORMANCE

Load only required plugins.

Cache plugin metadata.

Optimize module loading.

Avoid unnecessary queries.


---

SECURITY

Plugins must never bypass:

Authentication

Authorization

Validation

Logging

Rate Limiting

CSRF Protection


---

TESTING

Prepare architecture for:

Plugin Tests

Theme Tests

Compatibility Tests

Regression Tests


---

DOCUMENTATION

Every plugin should expose:

Installation Guide

Configuration Guide

Version History

Permission Requirements


---

FUTURE READY

The architecture should support future plugins such as:

Advertisement Manager

Multi-language System

MP3 Downloader

Bulk Downloader

AI Content Writer

AI SEO Assistant

Newsletter

Contact Builder

Backup Providers

Analytics

Payment Gateways

Membership System

REST API Extensions


without changing the CMS core.


---

FINAL DEVELOPMENT ORDER

1. Build Plugin Framework.


2. Build Event & Hook System.


3. Build Module Loader.


4. Build Plugin Manager.


5. Build Theme Engine.


6. Build Theme Manager.


7. Build Widget Architecture.


8. Build Shortcode & Block Architecture.


9. Optimize Performance.


10. Test plugin isolation and compatibility thoroughly.




---

⭐ Additional Professional Requirements

Follow SOLID Principles, Clean Architecture, and Dependency Injection throughout.

Every plugin should be installable or removable without affecting the rest of the application.

The system should support future commercial plugins and third-party developer extensions.

All plugin APIs must be documented and versioned.

Maintain high performance even with dozens of installed plugins.