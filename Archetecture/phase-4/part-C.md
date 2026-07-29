

PHASE 4 – PART C

MASTER PROMPT (Complete Database Architecture + API Specification + Technical Architecture + Engineering Documentation)

> Continue from Phase 1 (A–D), Phase 2 (A–D), and Phase 4 (Part A & Part B).

Do NOT generate application code.

Generate a complete enterprise-level Technical Architecture Document (TAD), Database Design Document (DDD), and API Specification for this CMS platform.

The documentation must be implementation-ready and suitable for software architects, backend engineers, frontend engineers, DevOps engineers, QA engineers, and AI coding assistants.




---

PRIMARY OBJECTIVE

Produce a complete technical blueprint.

The documentation must eliminate ambiguity.

Every backend system should be documented before implementation.


---

SYSTEM ARCHITECTURE

Document:

Overall Architecture

Application Layers

Frontend Layer

Backend Layer

Database Layer

Caching Layer

Storage Layer

Authentication Layer

Authorization Layer

Logging Layer

Monitoring Layer

Notification Layer

Localization Layer

Plugin Layer

Theme Layer

API Layer

Backup Layer

Deployment Layer


---

ARCHITECTURE PATTERN

Document why the project uses:

Clean Architecture

SOLID Principles

Dependency Injection

Modular Monolith (initially)

Domain Driven Design (where appropriate)

Repository Pattern

Service Layer

CQRS readiness (future)

Event-driven architecture (future)



---

DATABASE DESIGN

Generate complete database documentation.

For every table include:

Purpose

Columns

Data Types

Default Values

Constraints

Primary Keys

Foreign Keys

Unique Constraints

Check Constraints

Indexes

Soft Delete Strategy

Audit Fields



---

DATABASE TABLES

Document tables such as:

Users

Roles

Permissions

Sessions

User Preferences

Pages

Blog Posts

Categories

Tags

Media

Media Folders

Menus

Menu Items

SEO Settings

Site Settings

Languages

Translations

Themes

Plugins

Plugin Settings

Widgets

Announcements

Notifications

Audit Logs

System Logs

Error Logs

API Keys

Backups

Backup History

Activity Logs

Contact Messages

Newsletter Subscribers

Future Feature Flags


---

ENTITY RELATIONSHIPS

Describe:

One-to-One

One-to-Many

Many-to-Many

Cascade Rules

Deletion Rules

Update Rules

Relationship diagrams (described in text).


---

DATABASE INDEXING

Specify:

Primary Indexes

Composite Indexes

Search Indexes

Full-text Search Strategy

Performance Optimization


---

MIGRATION STRATEGY

Document:

Migration Process

Rollback Process

Version Control

Seed Data

Initial Data


---

API ARCHITECTURE

Design a RESTful API.

Document standards for:

Versioning

Authentication

Authorization

Pagination

Filtering

Sorting

Searching

Rate Limiting

Error Responses

Idempotency (where applicable)


---

API MODULES

Specify endpoints for:

Authentication

Users

Roles

Permissions

Pages

Posts

Categories

Tags

Media

Menus

SEO

Settings

Themes

Plugins

Widgets

Notifications

Languages

Translations

Search

Audit Logs

System Logs

Health Checks

Backups


---

API DOCUMENTATION

For every endpoint document:

Purpose

HTTP Method

URL

Headers

Authentication

Permissions

Request Body

Query Parameters

Validation Rules

Success Response

Error Responses

Status Codes

Example Requests

Example Responses


---

ERROR MODEL

Define standard error format.

Support:

400

401

403

404

409

422

429

500

503

Include machine-readable error codes.


---

AUTHENTICATION FLOW

Document:

Registration

Login

Logout

Password Reset

Email Verification

Session Refresh

Token Rotation

Logout All Devices


---

AUTHORIZATION

Document Role-Based Access Control.

Permission inheritance.

Custom permissions.

Future policy engine support.


---

CACHING STRATEGY

Specify:

Redis usage

Cache Keys

TTL Policies

Cache Invalidation

Cache Warming


---

STORAGE LAYER

Document:

Media Storage

Temporary Storage

Backup Storage

Configuration Storage

Future cloud providers.


---

SEARCH ARCHITECTURE

Design:

Global Search

Content Search

Media Search

Settings Search

Plugin Search

Future Elasticsearch compatibility.


---

EVENT SYSTEM

Document system events.

Examples:

UserCreated

UserUpdated

PostPublished

MediaUploaded

BackupCompleted

ThemeChanged

PluginInstalled

LanguageAdded


---

BACKGROUND JOBS

Document workers for:

Emails

Backups

Media Processing

Cache Refresh

Notifications

Search Index Updates


---

LOGGING

Document:

Application Logs

Audit Logs

Security Logs

API Logs

System Logs

Error Logs

Retention Policies


---

SECURITY MODEL

Document:

Authentication

Authorization

Password Policy

Session Management

CSRF

CORS

XSS Protection

SQL Injection Protection

File Upload Validation

Secret Management

Rate Limiting

Audit Logging


---

OBSERVABILITY

Document:

Metrics

Logging

Tracing

Health Checks

Performance Monitoring

Alerting


---

CONFIGURATION MANAGEMENT

Document:

Environment Variables

Configuration Files

Feature Flags

Secrets

Runtime Configuration


---

DEPLOYMENT ARCHITECTURE

Describe:

Application Server

Database Server

Redis

Object Storage

Reverse Proxy

CDN (future)

Monitoring Stack


---

API VERSIONING

Document strategy for:

Version 1

Version 2

Deprecation

Backward Compatibility


---

ENGINEERING STANDARDS

Specify:

Naming Conventions

Folder Structure

Code Reviews

Pull Requests

Git Flow

Commit Standards

Documentation Standards


---

TEST ARCHITECTURE

Document:

Unit Tests

Integration Tests

API Tests

UI Tests

Regression Tests

Performance Tests

Security Tests

Accessibility Tests


---

DIAGRAMS (Describe in Detail)

Provide text descriptions for:

System Context Diagram

Container Diagram

Component Diagram

Entity Relationship Diagram

Authentication Flow Diagram

Deployment Diagram

Request Lifecycle Diagram

Plugin Lifecycle Diagram

Theme Lifecycle Diagram


---

DELIVERABLES

Produce:

1. Technical Architecture Document (TAD)


2. Database Design Document (DDD)


3. API Specification


4. Entity Relationship Documentation


5. Authentication Specification


6. Authorization Specification


7. Logging Specification


8. Deployment Specification


9. Engineering Standards Guide


10. Backend Developer Handoff Guide




---

FINAL QUALITY REQUIREMENTS

The documentation must:

Be implementation-ready.

Be internally consistent.

Avoid ambiguity.

Follow enterprise software engineering standards.

Be understandable by human developers and AI coding assistants.

Support future growth without major redesign.



---

ENTERPRISE REQUIREMENTS

Design for 100,000+ users in the long term without changing the core architecture.

Maintain API-first, headless CMS, and cloud-ready principles.

Ensure every subsystem is independently testable.

Keep all documentation version-controlled and traceable to business requirements.

Provide enough detail that multiple engineering teams can work in parallel without conflicting implementations.

