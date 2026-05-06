# Security Policy

## Supported Versions

Epix is a continuously deployed web app — there are no versioned releases. The live site at [epixunblocked.github.io](https://epixunblocked.github.io) is always the current and only supported version.

| Version | Supported |
| ------- | --------- |
| Latest (live site) | ✅ |
| Archived / cached copies | ❌ |

## Reporting a Vulnerability

If you find a security issue with Epix — such as XSS vulnerabilities, unsafe iframes, exposed credentials, or anything that could harm users — please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, report it privately via GitHub's built-in security advisory tool:
[github.com/epixunblocked/epixunblocked.github.io/security/advisories/new](https://github.com/epixunblocked/epixunblocked.github.io/security/advisories/new)

### What to include

- A clear description of the vulnerability
- Steps to reproduce it
- What impact it could have on users
- Any suggested fix (optional but appreciated)

### What to expect

- **Acknowledgement** within 48 hours
- **Status update** within 7 days on whether the issue is confirmed
- Credit in the fix commit if you'd like it

### Scope

Things that are in scope:
- Cross-site scripting (XSS) via game embeds or search input
- Data exposure or leakage
- Clickjacking or malicious redirects
- Any issue that could affect user safety or privacy

Things that are out of scope:
- Games themselves (Epix embeds third-party games and is not responsible for their content)
- "This game is blocked at my school" — that's kind of the point
