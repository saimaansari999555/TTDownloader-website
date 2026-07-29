

PHASE 3 – PART D

MASTER PROMPT (Enterprise Deployment + High Availability + Disaster Recovery + DevOps)

> Continue the project from all previous phases.

Build a production-ready enterprise deployment architecture for a modern SaaS application.

Focus on reliability, scalability, maintainability, security, and business continuity.




---

PRIMARY OBJECTIVE

Prepare the application for enterprise production deployment.

Implement architecture for:

High Availability

Business Continuity

Disaster Recovery

DevOps

CI/CD

Infrastructure as Code

Secure Operations



---

DEPLOYMENT ENVIRONMENTS

Support:

Local Development

Testing

Staging

Production


Each environment should have isolated configuration.


---

CI/CD

Prepare automated pipelines for:

Linting

Unit Tests

Integration Tests

Security Scans

Build

Deployment


Support rollback if deployment fails.


---

CONTAINERIZATION

Prepare:

Dockerfile

Docker Compose

Health Checks

Environment Variables



---

LOAD BALANCING

Design architecture for:

Multiple application instances

Session strategy

Health-based routing



---

DATABASE

Prepare:

Backup strategy

Restore procedures

Read replicas (future)

Migration strategy



---

DISASTER RECOVERY

Create documented procedures for:

Server failure

Database corruption

Accidental deletion

Storage failure


Define:

Recovery Point Objective (RPO)

Recovery Time Objective (RTO)



---

BACKUP POLICY

Implement:

Daily backups

Weekly backups

Monthly archives

Backup verification

Restore testing



---

SECRETS MANAGEMENT

Never store secrets in source code.

Use secure environment variable management.

Support secret rotation.


---

SECURITY OPERATIONS

Provide:

Security audit logs

Dependency scanning

Patch management process

Access reviews



---

MONITORING

Track:

Uptime

Error rates

Resource usage

Application health


Provide dashboards and alerting architecture.


---

BUSINESS CONTINUITY

Document procedures for:

Planned maintenance

Emergency maintenance

Incident response

Service restoration



---

DOCUMENTATION

Produce documentation for:

Deployment

Configuration

Operations

Backup & Restore

Troubleshooting

Disaster Recovery



---

TESTING

Run:

Production readiness review

Backup restore validation

Disaster recovery drills

Security testing

Performance regression testing



---

FINAL CHECKLIST

Before production:

All tests pass

Monitoring enabled

Backups verified

Security review complete

Documentation complete

Rollback plan available



---

FUTURE READY

Design the platform so it can later support:

Multi-region deployments

Kubernetes

Service mesh

Multi-cloud deployments

Enterprise identity providers

Advanced observability


without redesigning the core architecture.


---

⭐ Enterprise Requirements

Follow industry best practices for DevOps, security, and operations.

Keep the platform cloud-agnostic.

Prioritize reliability, maintainability, and operational excellence.

Ensure every critical operational process is documented and testable.



