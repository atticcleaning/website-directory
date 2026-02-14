# Story 7.1: Security Headers & Application Hardening

Status: done

## Story

As a **homeowner**,
I want the site to be secure and trustworthy,
So that my browsing is protected and the site operates safely.

## Acceptance Criteria

1. **Security Headers Present:** Content-Security-Policy, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy (strict-origin-when-cross-origin), Strict-Transport-Security, and Permissions-Policy headers are configured via `next.config.ts` `headers()` function and applied to all routes.
2. **HTTPS with TLS 1.2+:** All external resource references in the codebase use HTTPS. HSTS header configured with `max-age=31536000; includeSubDomains`. (Actual TLS enforcement is Cloudflare/DO responsibility in Story 7.2.)
3. **No Cookies Beyond Analytics:** No `Set-Cookie` headers are emitted by the application in any response. (Verified by checking the application does not set cookies.)
4. **No User-Submitted Data Storage:** Confirmed — all data is admin-imported only. SearchLog captures search queries for expansion analytics (no PII). No user accounts, profiles, or submissions exist.
5. **CLI-Only Admin Interface:** Confirmed — no `/admin/` routes or remote admin endpoints exist. Admin operations are local CLI scripts only (`src/scripts/`).
6. **robots.txt Blocks API Routes:** Confirmed from Story 6.2 — `src/app/robots.ts` blocks `/api/` with `disallow: "/api/"`.
7. **Search Input Sanitization:** Confirmed from Story 2.2 — Prisma parameterized queries via `Prisma.sql` tagged templates, `MAX_QUERY_LENGTH = 200`, service type validation against enum.
8. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with no regressions.

## Tasks / Subtasks

- [x] Task 1: Add security headers to `next.config.ts` (AC: #1, #2)
  - [x] 1.1 Add an `async headers()` function to the Next.js config that returns security headers for all routes (`/:path*`).
  - [x] 1.2 Headers to add:
    - `Content-Security-Policy` — see Dev Notes for exact directives
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
    - `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()`
  - [x] 1.3 CSP must NOT block: `next/font/google` self-hosted fonts, Google Maps embed iframe (`https://www.google.com/maps/embed/v1/`), JSON-LD `<script type="application/ld+json">`, Tailwind inline styles.

- [x] Task 2: Verify no cookies emitted (AC: #3)
  - [x] 2.1 Inspect the application — confirm no `Set-Cookie` headers are set by the app. Next.js does not set session cookies by default. No auth system exists. Document in completion notes.

- [x] Task 3: Verify no user-submitted data and CLI-only admin (AC: #4, #5)
  - [x] 3.1 Confirm no `/admin/` routes exist in `src/app/`. Confirm all admin scripts are in `src/scripts/` and are CLI-only. Document in completion notes.

- [x] Task 4: Verify robots.txt and input sanitization (AC: #6, #7)
  - [x] 4.1 Confirm `src/app/robots.ts` disallows `/api/`. Confirm `src/lib/search.ts` uses Prisma parameterized queries and input validation. Document in completion notes.

- [x] Task 5: Build validation (AC: #8)
  - [x] 5.1 Run `npx tsc --noEmit` — zero type errors.
  - [x] 5.2 Run `npm run lint` — zero violations.
  - [x] 5.3 Run `npm run build` — compiles successfully with no regressions.

## Dev Notes

### Architecture Compliance

**Security Headers (architecture.md, INFRA-8, NFR-S2):**
- Decision: Configure security headers via `next.config.ts` `headers()` function
- Target: securityheaders.com Grade A
- Headers apply to all routes via `source: "/:path*"`

**HTTPS/TLS (NFR-S1):**
- TLS enforcement is infrastructure-level (Cloudflare + DO App Platform) — Story 7.2
- Story 7.1 adds HSTS header for defense-in-depth (browsers remember HTTPS)
- All external references in code must use HTTPS

**Simplified Threat Model:**
- No user accounts → no session management or authentication attacks
- No user-submitted data → no user-generated content attacks
- No admin dashboard → no remote privilege escalation
- CLI-only operations → admin access is local machine only
- Read-heavy architecture → 99% GET requests to statically generated HTML

### Content-Security-Policy Directive Design

**Critical Context: How resources are loaded in this app:**
- **Fonts:** `next/font/google` — self-hosted at build time, served from `/_next/static/`. CSP only needs `'self'` for font-src.
- **Google Maps:** Loaded via `<iframe>` in `src/components/google-map.tsx` — `src="https://www.google.com/maps/embed/v1/place?..."`. CSP needs `frame-src https://www.google.com`.
- **Styles:** Tailwind CSS generates inline styles + a CSS file. CSP needs `style-src 'self' 'unsafe-inline'`.
- **Scripts:** Next.js injects inline `<script>` tags for hydration. CSP needs `script-src 'self' 'unsafe-inline'`.
- **JSON-LD:** Uses `dangerouslySetInnerHTML` with `JSON.stringify()` on Prisma data (safe, not user input). This is a `<script type="application/ld+json">` tag — requires `'unsafe-inline'` in script-src.
- **Images:** Only self-hosted or data URIs. No external image CDNs.

**CSP Header Value:**
```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

**Directive Rationale:**

| Directive | Value | Why |
|-----------|-------|-----|
| `default-src` | `'self'` | Block all external resources by default |
| `script-src` | `'self' 'unsafe-inline'` | Next.js hydration scripts + JSON-LD inline script |
| `style-src` | `'self' 'unsafe-inline'` | Tailwind CSS inline styles + stylesheet |
| `img-src` | `'self' data:` | Self-hosted images + data URIs for icons |
| `font-src` | `'self'` | next/font self-hosts Google Fonts at build time |
| `connect-src` | `'self'` | Search API is same-origin only |
| `frame-src` | `https://www.google.com` | Google Maps embed iframe |
| `object-src` | `'none'` | Block Flash/Java/plugins |
| `base-uri` | `'self'` | Prevent base tag hijacking |
| `form-action` | `'self'` | Search form submits to same origin |
| `frame-ancestors` | `'none'` | Prevent site from being embedded (replaces X-Frame-Options) |

**Why `'unsafe-inline'` is acceptable here:**
- Next.js App Router injects inline scripts for hydration — nonce-based CSP is not yet supported in Next.js 16 production builds without custom middleware complexity
- No user-supplied content is rendered as HTML — all inputs are server-side escaped by React
- `'unsafe-inline'` for styles is standard for Tailwind CSS applications
- The simplified threat model (no user accounts, no user content) means XSS attack surface is minimal

### What This Story Does NOT Do

- Does NOT set up Cloudflare or domain routing (Story 7.2)
- Does NOT create SSL certificates (Cloudflare handles this)
- Does NOT implement rate limiting (Cloudflare handles this in Story 7.2)
- Does NOT create middleware (`src/middleware.ts`) — headers are in next.config.ts
- Does NOT add any new npm dependencies
- Does NOT create tests (testing framework not yet set up)
- Does NOT modify any page routes, API handlers, or components
- Does NOT change the database schema
- Does NOT add environment variables

### Previous Story Learnings (from Epic 6)

- **Import order**: React/Next.js → third-party → @/components → @/lib → @/types
- **Build workers capped at 3**: `experimental.cpus: 3` in next.config.ts
- **Prisma connection pool**: `max: 3` with lazy Proxy initialization in `prisma.ts`
- **`next.config.ts` pattern**: Currently minimal — only has `experimental.cpus: 3`
- **`next/font/google`**: Self-hosts fonts at build time — no external font CDN requests at runtime
- **Google Maps embed**: Uses `<iframe>` with `src="https://www.google.com/maps/embed/v1/place?..."` — needs `frame-src` in CSP
- **JSON-LD**: Uses `dangerouslySetInnerHTML` with `JSON.stringify()` on Prisma data — safe but requires `'unsafe-inline'` in CSP script-src
- **`ssl: { rejectUnauthorized: false }`** in prisma.ts: Intentional for DO Managed PostgreSQL self-signed certs — not a Story 7.1 concern

### Existing Security Strengths (No Changes Needed)

- **SQL injection prevention**: Prisma `$queryRaw` with tagged template literals (`search.ts`)
- **Input validation**: `MAX_QUERY_LENGTH = 200`, service type enum validation (`search.ts`)
- **XSS prevention**: React auto-escapes all rendered content; `dangerouslySetInnerHTML` only used for `JSON.stringify()` on Prisma data
- **No user accounts**: No auth system, no session cookies, no password storage
- **robots.txt**: Already blocks `/api/` (Story 6.2)
- **Error handling**: Search API returns empty response on error, never exposes stack traces to client

### Project Structure Notes

```
next.config.ts                        ← MODIFIED (add headers() function)

src/
├── app/
│   ├── robots.ts                     (no change — already blocks /api/)
│   └── api/search/route.ts           (no change — already validates input)
├── lib/
│   ├── search.ts                     (no change — already uses parameterized queries)
│   └── prisma.ts                     (no change)
├── components/
│   └── google-map.tsx                (no change — iframe needs frame-src in CSP)
└── scripts/                          (no change — CLI-only admin scripts)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 7, Story 7.1] — NFR-S1 through NFR-S7, INFRA-8
- [Source: _bmad-output/planning-artifacts/architecture.md#Security] — Security headers, HTTPS, admin access
- [Source: _bmad-output/planning-artifacts/architecture.md#INFRA-8] — Security headers in next.config.ts
- [Source: src/components/google-map.tsx] — Google Maps iframe embed (CSP frame-src)
- [Source: src/app/layout.tsx] — next/font/google self-hosted fonts (CSP font-src)
- [Source: src/app/[citySlug]/[companySlug]/page.tsx:120] — JSON-LD dangerouslySetInnerHTML (CSP script-src)
- [Source: src/lib/search.ts] — Prisma parameterized queries, input validation
- [Source: src/app/robots.ts] — robots.txt blocks /api/
- [Source: _bmad-output/implementation-artifacts/6-3-search-analytics-logging.md] — Previous story learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- No issues encountered — clean implementation, build passed on first attempt

### Completion Notes List

- All 8 ACs implemented and verified
- Added `headers()` function to `next.config.ts` with 6 security headers applied to all routes (`/:path*`)
- CSP configured with directives tailored to app's resource loading: self-hosted fonts (next/font), Google Maps iframe, Tailwind inline styles, JSON-LD inline script
- HSTS configured with `max-age=31536000; includeSubDomains` for defense-in-depth
- Permissions-Policy disables unnecessary browser APIs (geolocation, microphone, camera, payment)
- Verified: zero cookie usage in codebase (no Set-Cookie, no auth, no analytics)
- Verified: no `/admin/` routes exist; all admin scripts are CLI-only in `src/scripts/`
- Verified: robots.txt blocks `/api/`; search uses Prisma parameterized queries with input validation
- Build: 35 static pages, no regressions

### File List

- `next.config.ts` — MODIFIED: Added security headers configuration (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy)
