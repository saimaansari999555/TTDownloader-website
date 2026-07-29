

PHASE 3 – PART A

MASTER PROMPT (Media Downloader Engine + Download Queue + Processing Architecture)

> Continue the project from Phase 1 (A–D) and Phase 2 (A–D).

Do not recreate the project.

Build a production-ready, scalable Media Processing and Download Platform using a provider-based architecture.

The system must be modular so that supported providers can be added or removed without modifying the core application.

Implement only functionality that complies with applicable platform policies, permissions, and legal requirements.




---

PRIMARY OBJECTIVE

Develop a secure, high-performance media processing system capable of:

Accepting supported media URLs

Validating requests

Processing supported media

Presenting available download formats (where available)

Managing downloads

Tracking processing status

Handling large traffic efficiently



---

DOWNLOADER ARCHITECTURE

Design separate modules:

URL Validation

Provider Detection

Metadata Extraction

Media Processing

Format Detection

Download Manager

Queue Manager

File Manager

Cache Manager

Logging


Each module must be independent.


---

PROVIDER SYSTEM

Design a provider architecture.

Support adding providers through plugins.

Each provider should implement:

URL Validation

Metadata Fetching

Format Discovery

Download Handling

Error Handling


Core application should never depend on one provider.


---

USER DOWNLOAD FLOW

1. User pastes supported URL.


2. Validate URL.


3. Detect provider.


4. Process metadata.


5. Display available formats (when available).


6. User selects format.


7. Start download process.


8. Log activity.


9. Clean temporary resources.




---

METADATA

Where available, display:

Thumbnail

Title

Creator Name

Duration

Resolution

File Size

Format

Publish Date


Gracefully handle unavailable metadata.


---

FORMAT SELECTION

Prepare UI for:

Video formats

Audio formats

Multiple resolutions (when available)


If a format is unavailable, disable it instead of showing errors.


---

DOWNLOAD MANAGER

Support:

Multiple concurrent requests

Retry logic

Progress updates

Cancel requests

Timeouts

Error recovery



---

DOWNLOAD QUEUE

Implement queue architecture.

Features:

FIFO queue

Queue priorities

Retry failed jobs

Job timeout

Queue cleanup

Queue monitoring



---

BACKGROUND JOBS

Use background workers for processing.

Never block HTTP requests during heavy processing.


---

TEMPORARY FILE MANAGEMENT

Store temporary files securely.

Automatically remove expired files.

Prevent storage leaks.


---

CACHE

Use Redis for:

Metadata cache

Queue cache

Session cache

Temporary results


Implement TTL policies.


---

RATE LIMITING

Protect download endpoints.

Support:

Per-IP limits

Per-user limits

Burst protection



---

LOGGING

Log:

Download requests

Processing status

Failures

Queue events

Processing time


Avoid logging sensitive information.


---

PERFORMANCE

Optimize:

Concurrent processing

Database queries

Caching

Background workers

Memory usage



---

STORAGE

Design support for:

Local storage

Object storage

CDN integration (future)



---

SECURITY

Validate every request.

Sanitize URLs.

Prevent SSRF where applicable.

Protect against abuse.

Restrict file access.


---

API DESIGN

Create REST APIs for:

Submit download request

Check processing status

Retrieve metadata

Retrieve available formats

Cancel request


Use consistent response formats.


---

ERROR HANDLING

Handle gracefully:

Invalid URLs

Unsupported providers

Processing failures

Timeouts

Rate limits

Network errors


Provide user-friendly messages.


---

TESTING

Prepare:

Unit tests

Integration tests

Queue tests

Performance tests

Security tests



---

FUTURE READY

The architecture should support future additions such as:

Premium download features

Batch processing (where appropriate)

User download history

Analytics

Notifications

Additional supported providers


without changing the core architecture.


---

FINAL DEVELOPMENT ORDER

1. Build provider framework.


2. Implement URL validation.


3. Build metadata pipeline.


4. Implement queue architecture.


5. Add background workers.


6. Implement download manager.


7. Optimize caching.


8. Test scalability.


9. Test security.


10. Deliver production-ready documentation.