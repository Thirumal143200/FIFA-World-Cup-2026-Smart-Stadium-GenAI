# 🔒 Security Policy

We take the security of tournament operations and fan data seriously.

## Supported Versions

Only the latest release version receives security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0.0 | ❌ No              |

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues. Instead, email security reports to `security@fifa2026.dev`.

Our response process:
1. **Acknowledge**: We acknowledge receipt of your report within 48 hours.
2. **Investigate**: We analyze the vulnerability and scope potential fixes.
3. **Patch**: We release a patched version within 7 business days.
4. **Disclose**: Public disclosure will occur after users/venues have upgraded.

## Core Protection Measures

- **Input Sanitization**: All incoming inputs are sanitized through DOMPurify to prevent XSS.
- **Rate Limiting**: Configured sliding window limits per IP/user using Upstash Redis.
- **CSP Headers**: Strict Content-Security-Policy rules are injected via middleware.
- **Secret Management**: API keys and Firestore credentials are kept in environment configurations, never embedded in files.
