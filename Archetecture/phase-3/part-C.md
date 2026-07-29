

PHASE 3 – PART C

MASTER PROMPT (Enterprise Infrastructure + Analytics + Storage + Performance + Monitoring)

> Continue the project from Phase 1, Phase 2, and Phase 3 (Parts A & B).

Build a production-grade infrastructure layer suitable for a scalable SaaS application.

Focus on performance, reliability, monitoring, analytics, storage, caching, observability, and operational excellence.

Design every component to be modular, cloud-ready, and maintainable.




---

PRIMARY OBJECTIVE

Prepare the platform for production workloads by implementing:

Analytics Architecture

Object Storage

CDN Integration Architecture

Cache Layer

Monitoring

Health Checks

Logging

Performance Optimization

Operational Dashboard



---

ANALYTICS DASHBOARD

Create an Admin Analytics Dashboard.

Display:

Active Users

Daily Visitors

Weekly Visitors

Monthly Visitors

Returning Users

New Users

Page Views

Top Pages

Top Blog Posts

Device Types

Browser Distribution

Operating Systems

Geographic Distribution

Traffic Sources

Error Rate

API Response Time

Server Uptime



---

REPORTING

Support reports for:

Daily

Weekly

Monthly

Yearly

Custom Date Range


Allow export to:

CSV

Excel

PDF (future ready)



---

STORAGE ARCHITECTURE

Support storage backends:

Local Storage

S3-Compatible Object Storage

Azure Blob (future ready)

Google Cloud Storage (future ready)


Files should be abstracted behind a storage service.


---

FILE MANAGEMENT

Support:

Upload

Download

Delete

Restore

Versioning (future ready)

Expiration Policies



---

CACHE LAYER

Use Redis.

Cache:

Sessions

Configuration

Menus

Pages

Frequently Requested Data

Translation Resources

API Responses (where appropriate)


Implement TTL policies and cache invalidation.


---

CDN ARCHITECTURE

Prepare the application for CDN usage.

Serve:

Images

Static Assets

CSS

JavaScript

Fonts


Use cache-friendly asset versioning.


---

PERFORMANCE OPTIMIZATION

Implement:

HTTP Compression

Lazy Loading

Code Splitting

Dynamic Imports

Image Optimization

Efficient Database Queries

Connection Pooling

Query Indexing

Background Processing



---

OBSERVABILITY

Create an Observability Center.

Include:

Application Metrics

Request Metrics

Error Metrics

Performance Metrics

Queue Metrics

Database Metrics

Cache Metrics



---

HEALTH CHECKS

Provide endpoints and dashboards for:

API Health

Database Health

Cache Health

Storage Health

Queue Health



---

LOGGING

Centralize logs.

Categories:

Application Logs

API Logs

Security Logs

Audit Logs

Error Logs


Support:

Search

Filter

Severity Levels

Export



---

ALERTING ARCHITECTURE

Prepare configurable alerts.

Examples:

High CPU Usage

Low Disk Space

High Error Rate

Failed Backups

Service Downtime


Notifications should be pluggable.


---

DASHBOARD WIDGETS

Allow administrators to customize dashboards with widgets such as:

System Health

Recent Activity

Storage Usage

Traffic Overview

Notifications



---

BACKGROUND JOBS

Separate long-running tasks into workers.

Provide:

Queue Monitoring

Retry Policies

Dead Letter Queue Architecture (future ready)



---

DATABASE OPTIMIZATION

Implement:

Proper Indexes

Pagination

Efficient Relationships

Query Monitoring



---

API PERFORMANCE

Support:

Compression

Pagination

Filtering

Sorting

Versioning



---

SEARCH

Design a scalable search layer.

Support:

Full-text Search

Autocomplete

Filters

Pagination


Future-ready for dedicated search engines.


---

SECURITY MONITORING

Display:

Failed Logins

Suspicious Requests

Rate Limit Events

Audit Trail



---

ADMIN OPERATIONS

Allow administrators to:

Clear Cache

Rebuild Search Index

View System Status

Download Logs

Run Health Checks



---

API DOCUMENTATION

Keep documentation synchronized with API versions.

Include examples and error responses.


---

TESTING

Prepare:

Load Tests

Stress Tests

Performance Tests

Failover Tests

Monitoring Tests



---

FUTURE READY

Design the infrastructure to support:

Horizontal Scaling

Microservices

Message Brokers

Advanced Search

Data Warehouse

Business Intelligence

Multi-region Deployments


without major architectural changes.


---

FINAL DEVELOPMENT ORDER

1. Build analytics architecture.


2. Implement storage abstraction.


3. Configure caching.


4. Prepare CDN integration.


5. Build monitoring dashboards.


6. Implement logging and health checks.


7. Optimize performance.


8. Run load and stress testing.


9. Validate operational readiness.


10. Deliver production-ready documentation.




---

⭐ Enterprise Requirements

Follow 12-Factor App principles where appropriate.

Keep infrastructure cloud-agnostic.

Ensure all operational features are configurable from the Admin Panel where practical.

Design for long-term maintainability, observability, and resilience.


